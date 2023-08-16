function findItemByName(name) {
  var numItems = app.project.numItems;
  for (var i = 1; i <= numItems; i++) {
    var currentItem = app.project.item(i);
    if (currentItem.name === name) {
      return currentItem;
    }
  }
  return null;
}

function deepDuplicateComp(comp) {
  // Duplica a composição
  var duplicatedComp = comp.duplicate();

  // Itera sobre todas as camadas da composição duplicada
  for (var i = 1; i <= duplicatedComp.numLayers; i++) {
    var layer = duplicatedComp.layer(i);

    // Se a camada for uma pré-composição, duplica essa pré-composição também
    if (layer.source instanceof CompItem) {
      var duplicatedLayerComp = deepDuplicateComp(layer.source);
      layer.replaceSource(duplicatedLayerComp, false);
    }
  }

  return duplicatedComp;
}

function hideLayersByName(comp, layerName) {
  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    if (layer.name === layerName) {
      layer.enabled = false; // Oculta a camada
    }
  }
}

function extendCompAndLayersToCustomTime(comp, customDuration) {
  var originalDuration = comp.duration;
  comp.duration = customDuration;

  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    if (Math.abs(layer.outPoint - originalDuration) <= 2.001) {
      layer.outPoint = customDuration;
    }
  }
}

function adjustLayerPositions(comp, xOffset, yOffset) {
  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    var currentPosition = layer.position.value;
    layer.position.setValue([currentPosition[0] - xOffset, currentPosition[1] - yOffset]);
  }
}

function openComposition(comp) {
  if (comp && comp instanceof CompItem) {
    comp.openInViewer();
  } else {
    alert("Erro ao abrir a composição.");
  }
}

function duplicatePrecompToOutput(values) {
  alert("Iniciando função duplicatePrecompToOutput no script JSX...");

  // Use os valores do objeto para configurar a composição duplicada
  var precompName = values.style + " " + values.version + " " + values.colorScheme;
  var customDuration = parseFloat(values.duration);

  var resolution = parseFloat(values.resolution);
  var roi = values.roi;

  var libraryFolder = findItemByName("Library");

  alert(resolution);

  if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
    alert("Pasta 'Library' não encontrada!");
    return;
  }
  var precompItem = null;
  for (var i = 1; i <= libraryFolder.numItems; i++) {
    var item = libraryFolder.item(i);
    if (item.name === precompName && item instanceof CompItem) {
      precompItem = item;
      break;
    }
  }

  if (!precompItem) {
    alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
    return;
  }

  // Faz uma duplicação profunda da pré-composição
  var duplicatedPrecomp = deepDuplicateComp(precompItem);

  if (roi) {
    // Ajusta a posição de todas as camadas com base nas coordenadas x e y da região de interesse

    adjustLayerPositions(duplicatedPrecomp, roi.x, roi.y);

    // Define a região de interesse e ajusta a largura e altura da composição
    duplicatedPrecomp.width = roi.width;
    duplicatedPrecomp.height = roi.height;
    duplicatedPrecomp.regionOfInterest = [0, 0, roi.width, roi.height];

    // A região de interesse começa no canto superior esquerdo após reposicionar as camadas
  }

  // Verifica se CheckAlpha é true e oculta as camadas com o nome "AlphaTrue"
  var CheckAlpha = true; // Defina esta variável conforme necessário
  if (CheckAlpha) {
    hideLayersByName(duplicatedPrecomp, "AlphaTrue");
  }
  // Estende a duração da composição duplicada e suas camadas para o tempo personalizado
  extendCompAndLayersToCustomTime(duplicatedPrecomp, customDuration);

  // Mover a composição duplicada para a pasta "Output"
  var outputFolder = findItemByName("Output");
  if (!outputFolder) {
    outputFolder = app.project.items.addFolder("Output");
  }

  duplicatedPrecomp.parentFolder = outputFolder;

  ScaleCompositionByWidth(duplicatedPrecomp, resolution);

  alert("Pré-composição '" + precompName + "' foi duplicada, estendida para " + customDuration + " segundos e movida para a pasta 'Output'!");

  openComposition(duplicatedPrecomp);
}

function ScaleCompositionByWidth(compToScale, newWidth) {
  if (!compToScale || !(compToScale instanceof CompItem)) {
    alert("Composição não fornecida ou inválida.");
    return;
  }

  var scale_factor = newWidth / compToScale.width;

  app.beginUndoGroup("Scale Composition By Width");

  // Create a null 3D layer.
  var null3DLayer = compToScale.layers.addNull();
  null3DLayer.threeDLayer = true;

  // Set its position to (0,0,0).
  null3DLayer.position.setValue([0, 0, 0]);

  // Set null3DLayer as parent of all layers that don't have parents.
  makeParentLayerOfAllUnparented(compToScale, null3DLayer);

  // Set new comp width and height.
  compToScale.width = Math.floor(compToScale.width * scale_factor);
  compToScale.height = Math.floor(compToScale.height * scale_factor);

  // Then for all cameras, scale the Zoom parameter proportionately.
  scaleAllCameraZooms(compToScale, scale_factor);

  // Set the scale of the super parent null3DLayer proportionately.
  var superParentScale = null3DLayer.scale.value;
  superParentScale[0] = superParentScale[0] * scale_factor;
  superParentScale[1] = superParentScale[1] * scale_factor;
  superParentScale[2] = superParentScale[2] * scale_factor;
  null3DLayer.scale.setValue(superParentScale);

  // Delete the super parent null3DLayer with dejumping enabled.
  null3DLayer.remove();

  app.endUndoGroup();
}
function makeParentLayerOfAllUnparented(theComp, newParent) {
  for (var i = 1; i <= theComp.numLayers; i++) {
    var curLayer = theComp.layer(i);
    if (curLayer != newParent && curLayer.parent == null) {
      curLayer.parent = newParent;
    }
  }
}

function scaleAllCameraZooms(theComp, scaleBy) {
  for (var i = 1; i <= theComp.numLayers; i++) {
    var curLayer = theComp.layer(i);
    if (curLayer.matchName == "ADBE Camera Layer") {
      var curZoom = curLayer.zoom;
      if (curZoom.numKeys == 0) {
        curZoom.setValue(curZoom.value * scaleBy);
      } else {
        for (var j = 1; j <= curZoom.numKeys; j++) {
          curZoom.setValueAtKey(j, curZoom.keyValue(j) * scaleBy);
        }
      }
    }
  }
}

//var desiredDuration = 60; // Defina a duração desejada aqui
//var regionOfInterest = { x: 2, y: 210, width: 1220, height: 680 }; // Defina a região de interesse aqui
//duplicatePrecompToOutput("Motif_Teal_End_Aqua", desiredDuration, regionOfInterest);
