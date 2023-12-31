﻿function itemExistsInProject(itemName) {
  for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i).name === itemName) {
      return true;
    }
  }
  return false;
}

//importa a biblioteca
function importAEPFile(Path, name) {
  var extensionPath = Path;
  var filePath = new File(extensionPath + name + ".aep");
  if (filePath) {
    // Verifica se a pasta "Library" já existe no projeto
    if (itemExistsInProject("Library")) {
      // alert("A pasta 'Library' já existe no projeto. Importação cancelada.");
    } else {
      // Importa o arquivo .aep
      var importedFolder = app.project.importFile(new ImportOptions(filePath));
      // Move os itens da pasta importada para a raiz do projeto
      for (var i = importedFolder.numItems; i > 0; i--) {
        importedFolder.item(i).parentFolder = app.project.rootFolder;
      }
      // Exclui a pasta vazia
      importedFolder.remove();
    }
  } else {
    alert("Arquivo não encontrado!");
  }
}

function deepDuplicateComp(comp, styleSuffix, ConocoFolder) {
  var duplicatedComp = comp.duplicate();
  if (styleSuffix) {
    duplicatedComp.name = styleSuffix;
  }
  for (var i = 1; i <= duplicatedComp.numLayers; i++) {
    var layer = duplicatedComp.layer(i);
    if (layer.source instanceof CompItem) {
      var duplicatedLayerComp = deepDuplicateComp(layer.source, null, ConocoFolder);

      layer.replaceSource(duplicatedLayerComp, false);

      var outputFolder = findItemByName("Output", ConocoFolder);

      if (!outputFolder) {
        outputFolder = ConocoFolder.items.addFolder("Output");
      }

      var baseFolder = findItemByName("Base", outputFolder);
      if (!baseFolder) {
        baseFolder = outputFolder.items.addFolder("Base");
      }
      duplicatedLayerComp.parentFolder = baseFolder;
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

function showLayersByName(comp, layerName) {
  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    if (layer.name === layerName) {
      layer.enabled = true; // Oculta a camada
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

function findCompByName(name) {
  for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === name) {
      return app.project.item(i);
    }
  }
  return null;
}

function moveKeyframes(compName, layerName, offsetTime) {
  var comp = findCompByName(compName);

  if (!comp) {
    alert("Composição não encontrada: " + compName);
    return;
  }

  var layer = comp.layer(layerName);

  if (!layer) {
    alert("Camada não encontrada: " + layerName + " na composição " + compName);
    return;
  }

  // Verifica se a camada tem Trim Paths 1 > Start dentro de Contents
  var startProperty;
  try {
    startProperty = layer.property("Contents").property("Trim Paths 1").property("Start");
  } catch (e) {
    alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada " + layerName + ".");
    return;
  }

  if (!startProperty) {
    alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada " + layerName + ".");
    return;
  }

  // Armazenar os valores e tempos dos keyframes
  var keyValues = [];
  var keyTimes = [];
  for (var i = 1; i <= startProperty.numKeys; i++) {
    keyValues.push(startProperty.keyValue(i));
    keyTimes.push(startProperty.keyTime(i));
  }

  // Remover os keyframes
  for (var j = startProperty.numKeys; j >= 1; j--) {
    startProperty.removeKey(j);
  }

  // Adicionar keyframes ajustados
  // Em segundos
  for (var k = 0; k < keyValues.length; k++) {
    startProperty.setValueAtTime(keyTimes[k] + offsetTime, keyValues[k]);
  }

  //alert("Keyframes de Start na camada " + layerName + " movidos com sucesso!");
}

// Esta função busca uma composição pelo nome

function findItemByName(name, parent) {
  parent = parent || app.project; // Set default value if parent is not provided
  var numItems = parent.numItems;
  for (var i = 1; i <= numItems; i++) {
    var currentItem = parent.item(i);
    //alert(currentItem.name);
    if (currentItem.name === name) {
      return currentItem;
    }
  }
  return null;
}

function duplicatePrecompToOutput(values) {
  var customDuration = parseFloat(values.duration);
  var path = values.path + "/library/";
  var Name = "Template_Library";
  var resolution = parseFloat(values.resolution);
  var roi = values.roi;
  var render = values.render;
  var aspectRatio = values.aspectRatio.replace(":", "X"); // Aqui está a mudança

  importAEPFile(path, Name);

  //alert(values.resolution);
  var ConocoFolder = findItemByName("Conoco");
  if (!ConocoFolder || !(ConocoFolder instanceof FolderItem)) {
    alert("Folder 'Conoco' not found! Creating a new one...");
    ConocoFolder = app.project.items.addFolder("Conoco");
  }

  var libraryFolder = findItemByName("Library", ConocoFolder);
  if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
    alert("Folder 'Library' not found!");
    return;
  }

  var styleFolder;
  var precompName;
  var firstWord = values.colorScheme.split(" ")[0];
  switch (values.style) {
    case "Solid Mark Motif":
      styleFolder = findItemByName("Solid Mark Motif", libraryFolder);
      var precompName = values.style + " " + values.colorScheme;
      break;
    case "Linear Mark Motif":
      styleFolder =
        values.version === "Main"
          ? findItemByName("Linear Mark Motif", libraryFolder)
          : findItemByName("Linear Mark Motif Text Frame", libraryFolder);
      var precompName = values.style + " " + firstWord;
      break;
    case "3D":
      styleFolder = findItemByName(values.duration, findItemByName("3D", libraryFolder));
      var precompName = values.style + " " + values.duration + " " + aspectRatio;
      break;
    case "Ribbon":
      styleFolder = findItemByName(values.duration, findItemByName("Ribbon", libraryFolder));

      var precompName = values.style + " " + values.duration + " " + aspectRatio;
      break;
    default:
      alert("Unknown style: " + values.style);
      return;
  }

  // var precompName = values.style + " " + firstWord + (values.duration ? values.duration + " " : "") + aspectRatio;

  if (!styleFolder || !(styleFolder instanceof FolderItem)) {
    alert("Subfolder corresponding to '" + values.style + "' not found in the 'Library' folder!");
    return;
  }

  var precompItem = findItemByName(precompName, styleFolder);
  if (!precompItem || !(precompItem instanceof CompItem)) {
    alert("Pre-composition '" + precompName + "' not found in the '" + values.style + "' folder!");
    return;
  } else {
    // alert("Comp Encontrada");
  }

  var sufix = values.fileName;

  // Faz uma duplicação profunda da pré-composição
  var duplicatedPrecomp = deepDuplicateComp(precompItem, sufix);

  if (values.style === "Solid Mark Motif" || values.style === "Linear Mark Motif") {
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
  }

  var colorMapping = {
    Teal: {
      BG: [0x00 / 255, 0x3e / 255, 0x44 / 255], // 003E44
      Color01: [0x00 / 255, 0x4f / 255, 0x4d / 255], // 004F4D
      Color02: [0x21 / 255, 0xaf / 255, 0x90 / 255], // 21AF90
    },
    Red: {
      BG: [0x60 / 255, 0x00 / 255, 0x1d / 255], // 60001D
      Color01: [0x8c / 255, 0x00 / 255, 0x21 / 255], // 8C0021
      Color02: [0xe4 / 255, 0x00 / 255, 0x15 / 255], // E40015
    },
    Purple: {
      BG: [0x29 / 255, 0x09 / 255, 0x68 / 255], // 290968
      Color01: [0x3d / 255, 0x15 / 255, 0x7f / 255], // 3D157F
      Color02: [0x87 / 255, 0x32 / 255, 0xe1 / 255], // 8732E1
    },
    Orange: {
      BG: [0x91 / 255, 0x22 / 255, 0x10 / 255], // 912210
      Color01: [0xd8 / 255, 0x35 / 255, 0x00 / 255], // D83500
      Color02: [0xff / 255, 0x71 / 255, 0x00 / 255], // FF7100
    },
    Green: {
      BG: [0x17 / 255, 0x49 / 255, 0x1d / 255], // 17491D
      Color01: [0x27 / 255, 0x62 / 255, 0x30 / 255], // 276230
      Color02: [0xbd / 255, 0xd3 / 255, 0x20 / 255], // BDD320
    },
    Fuchsia: {
      BG: [0x68 / 255, 0x04 / 255, 0x51 / 255], // 680451
      Color01: [0x97 / 255, 0x00 / 255, 0x77 / 255], // 970077
      Color02: [0xe8 / 255, 0x46 / 255, 0xd6 / 255], // E846D6
    },
    Blue: {
      BG: [0x08 / 255, 0x00 / 255, 0x72 / 255], // 080072
      Color01: [0x1f / 255, 0x0a / 255, 0xa5 / 255], // 1F0AA5
      Color02: [0x15 / 255, 0x8e / 255, 0xff / 255], // 158EFF
    },
    Aqua: {
      BG: [0x0c / 255, 0x41 / 255, 0x59 / 255], // 0C4159
      Color01: [0x0a / 255, 0x5c / 255, 0x83 / 255], // 0A5C83
      Color02: [0x3a / 255, 0xb5 / 255, 0xe2 / 255], // 3AB5E2
    },
    Salmon: {
      BG: [0x81 / 255, 0x1f / 255, 0x2c / 255], // 811F2C
      Color01: [0xc1 / 255, 0x2d / 255, 0x3c / 255], // C12D3C
      Color02: [0xff / 255, 0x56 / 255, 0x5a / 255], // FF565A
    },
  };

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
        hideLayersByName(duplicatedPrecomp, "Variable - Color 04");
        hideLayersByName(duplicatedPrecomp, "Variable - Color 05");
        hideLayersByName(duplicatedPrecomp, "Variable - Color 06");
      }
      if (values.switchAlpha) {
        hideLayersByName(duplicatedPrecomp, "bg");
      }

      break;
    case "Linear Mark Motif":
      var thirdWord = values.colorScheme.split(" ")[3];
      var offsetTime = customDuration - 5;

      moveKeyframes(duplicatedPrecomp.name, "Line 01", offsetTime);
      moveKeyframes(duplicatedPrecomp.name, "Line 02", offsetTime);
      moveKeyframes(duplicatedPrecomp.name, "Line 03", offsetTime);

      if (thirdWord === "White") {
        hideLayersByName(duplicatedPrecomp, "BG - Color");
        if (values.switchAlpha) {
          hideLayersByName(duplicatedPrecomp, "BG - White");
        }
      } else {
        hideLayersByName(duplicatedPrecomp, "BG - White");
      }

      break;

    case "3D":
      var thirdWord = values.colorScheme.split(" ")[3];
      var firstWord = values.colorScheme.split(" ")[0]; //Red
      var layerName = firstWord + " " + values.version;

      showLayersByName(duplicatedPrecomp, layerName);

      var layer = duplicatedPrecomp.layer("BG - Color");
      var colorProperty = layer.property("Contents").property("Rectangle 1").property("Contents").property("Fill 1").property("Color");

      var newColor = colorMapping[firstWord].BG;
      colorProperty.setValue(newColor);

      if (thirdWord === "White") {
        hideLayersByName(duplicatedPrecomp, "BG - Color");
        if (values.switchAlpha) {
          hideLayersByName(duplicatedPrecomp, "BG - White");
        }
      } else {
        hideLayersByName(duplicatedPrecomp, "BG - White");
      }

      break;
    case "Ribbon":
      var thirdWord = values.colorScheme.split(" ")[3];
      var firstWord = values.colorScheme.split(" ")[0]; //Red
      var layerName = firstWord + " " + values.version;
      showLayersByName(duplicatedPrecomp, layerName);

      var layer2 = duplicatedPrecomp.layer("BG - Color");
      var colorProperty = layer2.property("Contents").property("Rectangle 1").property("Contents").property("Fill 1").property("Color");
      var layer = duplicatedPrecomp.layer(1);
      var tintEffect = layer.effect("Tint");

      var mapBlackTo = tintEffect.property("Map Black To");
      var mapWhiteTo = tintEffect.property("Map White To");

      mapBlackTo.setValue(colorMapping[firstWord].Color01);
      mapWhiteTo.setValue(colorMapping[firstWord].Color02);

      colorProperty.setValue(colorMapping[firstWord].BG);

      if (thirdWord === "White") {
        hideLayersByName(duplicatedPrecomp, "BG - Color");
        if (values.switchAlpha) {
          hideLayersByName(duplicatedPrecomp, "BG - White");
        }
      } else {
        hideLayersByName(duplicatedPrecomp, "BG - White");
      }

      break;
  }

  // Estende a duração da composição duplicada e suas camadas para o tempo personalizado
  extendCompAndLayersToCustomTime(duplicatedPrecomp, customDuration);

  var outputFolder = findItemByName("Output", ConocoFolder);
  if (!outputFolder) {
    outputFolder = ConocoFolder.items.addFolder("Output");
  }
  duplicatedPrecomp.parentFolder = outputFolder;

  ScaleCompositionByWidth(duplicatedPrecomp, resolution);

  openComposition(duplicatedPrecomp);

  var renderSettings = {
    timeSpan: "Work Area", // Pode ser "Work Area", "Length", ou outros conforme a documentação
    quality: "Best",
    resolution: "Full",
    effects: "All On",
    diskCache: "Use Image Cache",
  };

  var outputSettings = {
    format: values.fileType === "mov" ? "High Quality with Alpha" : "H.264 - Match Render Settings - 15 Mbps",
    channel: "RGB+Alpha",
    destination: values.outputPath,
    colorDepth: "Millions of Colors+", // 8-bits = "Millions of Colors", 16-bits = "Trillions of Colors", 32-bits = "Floating Point"
    resize: false, // Se você deseja redimensionar
    frameRate: 25,
  };

  if (values.render) {
    var progress = renderComposition(duplicatedPrecomp, renderSettings, outputSettings);

    if (progress === 100) {
      // alert("1");
      return "1";
    }
  } else {
    return "0";
  }
}

function ScaleCompositionByWidth(compToScale, newWidth) {
  if (!compToScale || !(compToScale instanceof CompItem)) {
    alert("Composition not provided or invalid.");
    return;
  }

  var scale_factor = newWidth / compToScale.width;

  //alert("CSInterface: " + typeof CSInterface);

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

function chooseOutputPath(fileType, defaultFileName) {
  var saveFile = new File("~/Desktop/" + defaultFileName + "." + (fileType === "mov" ? "mov" : "mp4")); // Usa o nome do arquivo passado
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

  // var csInterface = new CSInterface();

  // Adiciona a composição à fila de renderização
  var renderQueueItem = app.project.renderQueue.items.add(comp);

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

  return 100;
}
