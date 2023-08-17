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

function deepDuplicateComp(comp, styleSuffix) {
  // Duplica a composição
  var duplicatedComp = comp.duplicate();

  if (styleSuffix) {
    duplicatedComp.name = styleSuffix;
  }

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
  // alert("Iniciando função duplicatePrecompToOutput no script JSX...");
  //  alert(values.version);
  //
  // Use os valores do objeto para configurar a composição duplicada
  var precompName = values.style + " " + values.colorScheme;
  var customDuration = parseFloat(values.duration);

  var resolution = parseFloat(values.resolution);
  var roi = values.roi;
  var render = values.render;
  var aspectRatio = values.aspectRatio.replace(":", "-"); // Aqui está a mudança

  //alert(aspectRatio);

  var libraryFolder = findItemByName("Library");

  if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
    alert("Pasta 'Library' não encontrada!");
    return;
  }

  // Procura a subpasta correta dentro da pasta "Library" com base em values.style
  var styleFolder;
  switch (values.style) {
    case "Solid Mark Motif":
      precompName = values.style + " " + values.colorScheme;
      styleFolder = findItemByName("Solid Mark Motif", libraryFolder);
      break;
    case "Linear Mark Motif":
      var firstWord = values.colorScheme.split(" ")[0];
      // alert(firstWord);
      precompName = values.style + " " + firstWord;

      styleFolder = findItemByName("Linear Mark Motif", libraryFolder);
      break;
    case "3D":
      styleFolder = findItemByName("3D", libraryFolder);
      break;
    case "Ribbon":
      styleFolder = findItemByName("Ribbon", libraryFolder);
      break;
  }

  // alert(precompName);

  if (!styleFolder || !(styleFolder instanceof FolderItem)) {
    alert("Subpasta correspondente a '" + values.style + "' não encontrada na pasta 'Library'!");
    return;
  }

  // Busca a composição dentro da subpasta correta
  var precompItem = null;
  for (var i = 1; i <= styleFolder.numItems; i++) {
    var item = styleFolder.item(i);
    if (item.name === precompName && item instanceof CompItem) {
      precompItem = item;
      break;
    }
  }

  if (!precompItem) {
    alert("Pré-composição '" + precompName + "' não encontrada na pasta '" + values.style + "'!");
    return;
  }

  var sufix = values.style + " " + values.version + " " + values.colorScheme + " " + aspectRatio;

  // Faz uma duplicação profunda da pré-composição
  var duplicatedPrecomp = deepDuplicateComp(precompItem, sufix);

  if (roi) {
    // Ajusta a posição de todas as camadas com base nas coordenadas x e y da região de interesse

    roi.x = Math.round(roi.x * 1.92);
    roi.width = Math.round(roi.width * 1.92);
    roi.y = Math.round(roi.y * 1.92);
    roi.height = Math.round(roi.height * 1.92);

    adjustLayerPositions(duplicatedPrecomp, roi.x, roi.y);

    // Define a região de interesse e ajusta a largura e altura da composição
    duplicatedPrecomp.width = roi.width;
    duplicatedPrecomp.height = roi.height;
    duplicatedPrecomp.regionOfInterest = [0, 0, roi.width, roi.height];

    // A região de interesse começa no canto superior esquerdo após reposicionar as camadas
  }

  switch (values.style) {
    case "Solid Mark Motif":
      if (values.version === "Without Lines") {
        hideLayersByName(duplicatedPrecomp, "Line 01");
        hideLayersByName(duplicatedPrecomp, "Line 02");
        hideLayersByName(duplicatedPrecomp, "Line 03");
      }
      if (values.version === "With Lines") {
      }
      if (values.version === "Text Frame") {
        hideLayersByName(duplicatedPrecomp, "Line 01");
        hideLayersByName(duplicatedPrecomp, "Line 02");
        hideLayersByName(duplicatedPrecomp, "Line 03");
        hideLayersByName(duplicatedPrecomp, "Variable - Color 01");
        hideLayersByName(duplicatedPrecomp, "Variable - Color 02");
        hideLayersByName(duplicatedPrecomp, "Variable - Color 03");

        if (values.switchAlpha) {
          hideLayersByName(duplicatedPrecomp, "bg");
        }
      }

      break;
    case "Linear Mark Motif":
      var thirdWord = values.colorScheme.split(" ")[3];
      // alert(thirdWord);

      if (values.version === "Main") {
        if (thirdWord === "White") {
          hideLayersByName(duplicatedPrecomp, "BG - Color");
          if (values.switchAlpha) {
            hideLayersByName(duplicatedPrecomp, "BG - White");
          }
        } else {
          hideLayersByName(duplicatedPrecomp, "BG - White");
        }
      }

      break;
    case "3D":
      break;
    case "Ribbon":
      break;
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

  alert("Composição " + sufix + " (" + customDuration + "s) criada com sucesso e adicionada na pasta Output");

  openComposition(duplicatedPrecomp);

  var renderSettings = {
    timeSpan: "Work Area", // Pode ser "Work Area", "Length", ou outros conforme a documentação
    quality: "Best",
    resolution: "Full",
    effects: "All On",
    diskCache: "Use Image Cache",
  };

  var outputSettings = {
    format: values.fileType === "mov" ? "MOV" : "H.264",
    channel: "RGB+Alpha",
    destination: values.outputPath,
    colorDepth: "Millions of Colors+", // 8-bits = "Millions of Colors", 16-bits = "Trillions of Colors", 32-bits = "Floating Point"
    resize: false, // Se você deseja redimensionar
    frameRate: 25,
  };

  if (values.render) {
    renderComposition(duplicatedPrecomp, renderSettings, outputSettings);
  }
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

function chooseOutputPath(fileType) {
  var saveFile = new File();
  var fileFilter = fileType === "mov" ? "MOV:*.mov" : "MP4:*.mp4";
  saveFile = saveFile.saveDlg("Salvar Como", fileFilter);
  if (saveFile != null) {
    return saveFile.fsName; // Retorna o caminho completo escolhido pelo usuário
  } else {
    return null; // Usuário cancelou o diálogo
  }
}

function renderComposition(comp, renderSettings, outputSettings) {
  while (app.project.renderQueue.numItems > 0) {
    app.project.renderQueue.item(1).remove();
  }

  // Verifica se a composição é válida
  if (!comp || !(comp instanceof CompItem)) {
    alert("Composição inválida fornecida para renderização.");
    return;
  }

  // Adiciona a composição à fila de renderização
  var renderQueueItem = app.project.renderQueue.items.add(comp);
  alert("Iniciando Renderização, aguarde......");

  // Configura as Configurações de Renderização
  if (renderSettings) {
    if (renderSettings.timeSpan) renderQueueItem.timeSpan = renderSettings.timeSpan;

    if (renderSettings.quality) renderQueueItem.quality = renderSettings.quality;

    if (renderSettings.resolution) renderQueueItem.resolution = renderSettings.resolution;

    if (renderSettings.effects) renderQueueItem.effects = renderSettings.effects;

    if (renderSettings.diskCache) renderQueueItem.diskCache = renderSettings.diskCache;
  }

  // Configura as Configurações de Saída
  var outputModule = renderQueueItem.outputModule(1);
  if (outputSettings) {
    if (outputSettings.format) outputModule.applyTemplate(outputSettings.format);
    if (outputSettings.destination) outputModule.file = new File(outputSettings.destination);
    if (outputSettings.channel) outputModule.channels = outputSettings.channel;

    if (outputSettings.colorDepth) outputModule.depth = outputSettings.colorDepth;

    if (outputSettings.resize) outputModule.resize = outputSettings.resize;

    if (outputSettings.frameRate) outputModule.frameRate = outputSettings.frameRate;
  }

  // Inicia a renderização

  app.project.renderQueue.render();
  alert("Render Concluído");
}

//var desiredDuration = 60; // Defina a duração desejada aqui
//var regionOfInterest = { x: 2, y: 210, width: 1220, height: 680 }; // Defina a região de interesse aqui
//duplicatePrecompToOutput("Motif_Teal_End_Aqua", desiredDuration, regionOfInterest);
