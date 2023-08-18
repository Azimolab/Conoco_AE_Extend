// (function () {
//   var comp = app.project.activeItem; // Pega a composição ativa

//   if (!comp || !(comp instanceof CompItem)) {
//     alert("Por favor, abra e selecione uma composição.");
//     return;
//   }

//   var selectedLayers = comp.selectedLayers;

//   if (selectedLayers.length === 0) {
//     alert("Por favor, selecione uma camada.");
//     return;
//   }

//   var layer = selectedLayers[0];

//   // Verifica se a camada tem Trim Paths 1 dentro de Contents
//   var trimPathsStartProperty;
//   try {
//     trimPathsStartProperty = layer.property("Contents").property("Trim Paths 1").property("Start");
//   } catch (e) {
//     alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada selecionada.");
//     return;
//   }

//   if (!trimPathsStartProperty) {
//     alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada selecionada.");
//     return;
//   }

//   alert(trimPathsStartProperty.keyLabel(2));

//   // Move cada keyframe em 30 segundos que tem o label "Red"
//   var offsetTime = 30; // Em segundos
//   for (var i = 1; i <= trimPathsStartProperty.numKeys; i++) {
//     var keyLabel = trimPathsStartProperty.keyLabel(i);
//     if (keyLabel === 1) {
//       alert("Keyframes com label 'Red' movidos com sucesso!");
//       var oldTime = trimPathsStartProperty.keyTime(i);
//       trimPathsStartProperty.setKeyTime(i, oldTime + offsetTime);
//     }
//   }
// })();

(function () {
  var comp = app.project.activeItem; // Pega a composição ativa

  if (!comp || !(comp instanceof CompItem)) {
    alert("Por favor, abra e selecione uma composição.");
    return;
  }

  var selectedLayers = comp.selectedLayers;

  if (selectedLayers.length === 0) {
    alert("Por favor, selecione uma camada.");
    return;
  }

  var layer = selectedLayers[0];

  // Verifica se a camada tem Trim Paths 1 > Start dentro de Contents
  var startProperty;
  try {
    startProperty = layer.property("Contents").property("Trim Paths 1").property("Start");
  } catch (e) {
    alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada selecionada.");
    return;
  }

  if (!startProperty) {
    alert("A propriedade Start em Trim Paths 1 não foi encontrada na camada selecionada.");
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
  var offsetTime = 20; // Em segundos
  for (var k = 0; k < keyValues.length; k++) {
    startProperty.setValueAtTime(keyTimes[k] + offsetTime, keyValues[k]);
  }

  alert("Keyframes de Start movidos com sucesso!");
})();
