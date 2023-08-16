// function testFunction() {
//   alert("Test function called successfully!");
// }

// "object" != typeof JSON && (JSON = {}),
//   (function () {
//     "use strict";
//     var rx_one = /^[\],:{}\s]*$/,
//       rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
//       rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
//       rx_four = /(?:^|:|,)(?:\s*\[)+/g,
//       rx_escapable =
//         /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
//       rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
//       gap,
//       indent,
//       meta,
//       rep;
//     function f(t) {
//       return t < 10 ? "0" + t : t;
//     }
//     function this_value() {
//       return this.valueOf();
//     }
//     function quote(t) {
//       return (
//         (rx_escapable.lastIndex = 0),
//         rx_escapable.test(t)
//           ? '"' +
//             t.replace(rx_escapable, function (t) {
//               var e = meta[t];
//               return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4);
//             }) +
//             '"'
//           : '"' + t + '"'
//       );
//     }
//     function str(t, e) {
//       var r,
//         n,
//         o,
//         u,
//         f,
//         a = gap,
//         i = e[t];
//       switch (
//         (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(t)),
//         "function" == typeof rep && (i = rep.call(e, t, i)),
//         typeof i)
//       ) {
//         case "string":
//           return quote(i);
//         case "number":
//           return isFinite(i) ? String(i) : "null";
//         case "boolean":
//         case "null":
//           return String(i);
//         case "object":
//           if (!i) return "null";
//           if (((gap += indent), (f = []), "[object Array]" === Object.prototype.toString.apply(i))) {
//             for (u = i.length, r = 0; r < u; r += 1) f[r] = str(r, i) || "null";
//             return (o = 0 === f.length ? "[]" : gap ? "[\n" + gap + f.join(",\n" + gap) + "\n" + a + "]" : "[" + f.join(",") + "]"), (gap = a), o;
//           }
//           if (rep && "object" == typeof rep)
//             for (u = rep.length, r = 0; r < u; r += 1)
//               "string" == typeof rep[r] && (o = str((n = rep[r]), i)) && f.push(quote(n) + (gap ? ": " : ":") + o);
//           else for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = str(n, i)) && f.push(quote(n) + (gap ? ": " : ":") + o);
//           return (o = 0 === f.length ? "{}" : gap ? "{\n" + gap + f.join(",\n" + gap) + "\n" + a + "}" : "{" + f.join(",") + "}"), (gap = a), o;
//       }
//     }
//     "function" != typeof Date.prototype.toJSON &&
//       ((Date.prototype.toJSON = function () {
//         return isFinite(this.valueOf())
//           ? this.getUTCFullYear() +
//               "-" +
//               f(this.getUTCMonth() + 1) +
//               "-" +
//               f(this.getUTCDate()) +
//               "T" +
//               f(this.getUTCHours()) +
//               ":" +
//               f(this.getUTCMinutes()) +
//               ":" +
//               f(this.getUTCSeconds()) +
//               "Z"
//           : null;
//       }),
//       (Boolean.prototype.toJSON = this_value),
//       (Number.prototype.toJSON = this_value),
//       (String.prototype.toJSON = this_value)),
//       "function" != typeof JSON.stringify &&
//         ((meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }),
//         (JSON.stringify = function (t, e, r) {
//           var n;
//           if (((indent = gap = ""), "number" == typeof r)) for (n = 0; n < r; n += 1) indent += " ";
//           else "string" == typeof r && (indent = r);
//           if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
//           return str("", { "": t });
//         })),
//       "function" != typeof JSON.parse &&
//         (JSON.parse = function (text, reviver) {
//           var j;
//           function walk(t, e) {
//             var r,
//               n,
//               o = t[e];
//             if (o && "object" == typeof o)
//               for (r in o) Object.prototype.hasOwnProperty.call(o, r) && (void 0 !== (n = walk(o, r)) ? (o[r] = n) : delete o[r]);
//             return reviver.call(t, e, o);
//           }
//           if (
//             ((text = String(text)),
//             (rx_dangerous.lastIndex = 0),
//             rx_dangerous.test(text) &&
//               (text = text.replace(rx_dangerous, function (t) {
//                 return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4);
//               })),
//             rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, "")))
//           )
//             return (j = eval("(" + text + ")")), "function" == typeof reviver ? walk({ "": j }, "") : j;
//           throw new SyntaxError("JSON.parse");
//         });
//   })();

// function getLayerNames() {
//   var layerNames = [];
//   var comp = app.project.activeItem;
//   for (var i = 1; i <= comp.numLayers; i++) {
//     layerNames.push(comp.layer(i).name);
//   }
//   alert(JSON.stringify(layerNames));
//   return JSON.stringify(layerNames);
// }

// function duplicateLayers() {
//   var comp = app.project.activeItem;
//   if (comp && comp instanceof CompItem) {
//     var initialNumLayers = comp.numLayers; // Armazena o número inicial de layers
//     for (var i = 1; i <= initialNumLayers; i++) {
//       var layer = comp.layer(i);
//       layer.duplicate(); // Duplica a layer
//     }
//   }
// }

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

// function duplicatePrecompFromLibrary(precompName) {
//   var libraryFolder = findItemByName("Library");

//   if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
//     alert("Pasta 'Library' não encontrada!");
//     return;
//   }

//   var precompItem = null;
//   for (var i = 1; i <= libraryFolder.numItems; i++) {
//     var item = libraryFolder.item(i);
//     if (item.name === precompName && item instanceof CompItem) {
//       precompItem = item;
//       break;
//     }
//   }

//   if (!precompItem) {
//     alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
//     return;
//   }

//   // Cria uma nova composição
//   var newComp = app.project.items.addComp(
//     "Nova Composição",
//     precompItem.width,
//     precompItem.height,
//     precompItem.pixelAspect,
//     precompItem.duration,
//     precompItem.frameRate
//   );

//   // Duplica a pré-composição e adiciona à nova composição
//   var duplicatedPrecomp = precompItem.duplicate();
//   newComp.layers.add(duplicatedPrecomp);

//   alert("Pré-composição '" + precompName + "' duplicada e adicionada à nova composição!");
// }

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

// function duplicatePrecompFromLibrary(precompName) {
//   var libraryFolder = findItemByName("Library");

//   if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
//     alert("Pasta 'Library' não encontrada!");
//     return;
//   }

//   var precompItem = null;
//   for (var i = 1; i <= libraryFolder.numItems; i++) {
//     var item = libraryFolder.item(i);
//     if (item.name === precompName && item instanceof CompItem) {
//       precompItem = item;
//       break;
//     }
//   }

//   if (!precompItem) {
//     alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
//     return;
//   }

//   // Cria uma nova composição
//   var newComp = app.project.items.addComp(
//     "Nova Composição",
//     precompItem.width,
//     precompItem.height,
//     precompItem.pixelAspect,
//     precompItem.duration,
//     precompItem.frameRate
//   );

//   // Faz uma duplicação profunda da pré-composição e adiciona à nova composição
//   var duplicatedPrecomp = deepDuplicateComp(precompItem);
//   newComp.layers.add(duplicatedPrecomp);

//   alert("Pré-composição '" + precompName + "' duplicada e adicionada à nova composição!");
// }

// function duplicatePrecompFromLibraryAndCrop(precompName) {
//   var libraryFolder = findItemByName("Library");

//   if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
//     alert("Pasta 'Library' não encontrada!");
//     return;
//   }

//   var precompItem = null;
//   for (var i = 1; i <= libraryFolder.numItems; i++) {
//     var item = libraryFolder.item(i);
//     if (item.name === precompName && item instanceof CompItem) {
//       precompItem = item;
//       break;
//     }
//   }

//   if (!precompItem) {
//     alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
//     return;
//   }
//   // Cria uma nova composição com o mesmo tamanho da original
//   var newComp = app.project.items.addComp(
//     "Nova Composição",
//     precompItem.width,
//     precompItem.height,
//     precompItem.pixelAspect,
//     precompItem.duration,
//     precompItem.frameRate
//   );

//   // Faz uma duplicação profunda da pré-composição e adiciona à nova composição
//   var duplicatedPrecomp = deepDuplicateComp(precompItem);
//   newComp.layers.add(duplicatedPrecomp);

//   // Define a região de interesse para a nova composição (50% menor)
//   var xOffset = precompItem.width * 0.25;
//   var yOffset = precompItem.height * 0.25;
//   newComp.regionOfInterest = [xOffset, yOffset, precompItem.width * 0.5, precompItem.height * 0.5];

//   // Ajusta a largura e a altura da composição para corresponder à região de interesse
//   newComp.width = precompItem.width * 0.5;
//   newComp.height = precompItem.height * 0.5;

//   alert("Pré-composição '" + precompName + "' duplicada, cortada em 50% e adicionada à nova composição!");
// }

// function duplicatePrecompToOutput(precompName) {
//   var libraryFolder = findItemByName("Library");

//   if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
//     alert("Pasta 'Library' não encontrada!");
//     return;
//   }

//   var precompItem = null;
//   for (var i = 1; i <= libraryFolder.numItems; i++) {
//     var item = libraryFolder.item(i);
//     if (item.name === precompName && item instanceof CompItem) {
//       precompItem = item;
//       break;
//     }
//   }

//   if (!precompItem) {
//     alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
//     return;
//   }

//   // Faz uma duplicação profunda da pré-composição
//   var duplicatedPrecomp = deepDuplicateComp(precompItem);

//   // Mover a composição duplicada para a pasta "Output"
//   var outputFolder = findItemByName("Output");
//   if (!outputFolder) {
//     // Se a pasta "Output" não existir, crie-a
//     outputFolder = app.project.items.addFolder("Output");
//   }
//   duplicatedPrecomp.parentFolder = outputFolder;

//   alert("Pré-composição '" + precompName + "' foi duplicada e movida para a pasta 'Output'!");
// }

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

// function duplicatePrecompToOutput(precompName, customDuration, roi) {
//   var libraryFolder = findItemByName("Library");

//   if (!libraryFolder || !(libraryFolder instanceof FolderItem)) {
//     alert("Pasta 'Library' não encontrada!");
//     return;
//   }
//   var precompItem = null;
//   for (var i = 1; i <= libraryFolder.numItems; i++) {
//     var item = libraryFolder.item(i);
//     if (item.name === precompName && item instanceof CompItem) {
//       precompItem = item;
//       break;
//     }
//   }

//   if (!precompItem) {
//     alert("Pré-composição '" + precompName + "' não encontrada na pasta 'Library'!");
//     return;
//   }

//   // Faz uma duplicação profunda da pré-composição
//   var duplicatedPrecomp = deepDuplicateComp(precompItem);

//   if (roi) {
//     // Ajusta a posição de todas as camadas com base nas coordenadas x e y da região de interesse
//     adjustLayerPositions(duplicatedPrecomp, roi.x, roi.y);

//     // Define a região de interesse e ajusta a largura e altura da composição
//     duplicatedPrecomp.width = roi.width;
//     duplicatedPrecomp.height = roi.height;
//     duplicatedPrecomp.regionOfInterest = [0, 0, roi.width, roi.height]; // A região de interesse começa no canto superior esquerdo após reposicionar as camadas
//   }

//   // Verifica se CheckAlpha é true e oculta as camadas com o nome "AlphaTrue"
//   var CheckAlpha = false; // Defina esta variável conforme necessário
//   if (CheckAlpha) {
//     hideLayersByName(duplicatedPrecomp, "AlphaTrue");
//   }
//   // Estende a duração da composição duplicada e suas camadas para o tempo personalizado
//   extendCompAndLayersToCustomTime(duplicatedPrecomp, customDuration);

//   // Mover a composição duplicada para a pasta "Output"
//   var outputFolder = findItemByName("Output");
//   if (!outputFolder) {
//     outputFolder = app.project.items.addFolder("Output");
//   }
//   duplicatedPrecomp.parentFolder = outputFolder;

//   alert("Pré-composição '" + precompName + "' foi duplicada, estendida para " + customDuration + " segundos e movida para a pasta 'Output'!");
// }

function duplicatePrecompToOutput(values) {
  alert("Iniciando função duplicatePrecompToOutput no script JSX...");

  // Use os valores do objeto para configurar a composição duplicada
  var precompName = values.style + " " + values.version + " " + values.colorScheme;
  var customDuration = parseFloat(values.duration);
  var roi = values.roi;

  var libraryFolder = findItemByName("Library");

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
  var CheckAlpha = false; // Defina esta variável conforme necessário
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

  alert("Pré-composição '" + precompName + "' foi duplicada, estendida para " + customDuration + " segundos e movida para a pasta 'Output'!");
}

// Exemplo de uso:
// duplicatePrecompFromLibrary("Nome da Pré-composição");

// function osCheck() {
//   var os = $.os;
//   var match = os.indexOf("Windows");
//   if (match != -1) {
//     var userOS = "PC";
//   } else {
//     var userOS = "MAC";
//   }
//   alert(userOS);
//   return userOS;
// }

//osCheck();
//getLayerNames();
//duplicateLayers();
// duplicatePrecompFromLibrary("Motif_Teal_End_Aqua");

// duplicatePrecompFromLibraryAndCrop("Motif_Teal_End_Aqua");

// duplicatePrecompToOutput("Motif_Teal_End_Aqua");

// extendCompAndLayersToCustomTime("Motif_Teal_End_Aqua 2", 60);

//var desiredDuration = 60; // Defina a duração desejada aqui
//var regionOfInterest = { x: 2, y: 210, width: 1220, height: 680 }; // Defina a região de interesse aqui
//duplicatePrecompToOutput("Motif_Teal_End_Aqua", desiredDuration, regionOfInterest);
