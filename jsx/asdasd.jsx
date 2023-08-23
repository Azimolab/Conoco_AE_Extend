// This function searches for an item by its name and optionally within a parent folder
function findItemByName(name, parentFolder) {
  const searchFolder = parentFolder || app.project;
  const numItems = searchFolder.numItems;

  for (let i = 1; i <= numItems; i++) {
    const currentItem = searchFolder.item(i);
    if (currentItem.name === name) {
      return currentItem;
    }
  }
  return null;
}

function findCompByName(name) {
  return findItemByName(name);
}

function getStyleFolderAndPrecompName(values, libraryFolder) {
  let styleFolder;
  let precompName;

  switch (values.style) {
    case "Solid Mark Motif":
      precompName = values.style + " " + values.colorScheme;
      styleFolder = findItemByName("Solid Mark Motif", libraryFolder);
      break;
    case "Linear Mark Motif":
      const firstWord = values.colorScheme.split(" ")[0];
      precompName = values.style + " " + firstWord;
      styleFolder = findItemByName(values.version === "Main" ? "Linear Mark Motif" : "Linear Mark Motif Text Frame", libraryFolder);
      break;
    case "3D":
    case "Ribbon":
      styleFolder = findItemByName(values.style, libraryFolder);
      const durationFolder = findItemByName(values.duration, styleFolder);
      styleFolder = durationFolder;
      precompName = values.style + " " + values.duration + " " + values.aspectRatio.replace(":", "X");
      if (values.style === "Ribbon") {
        alert("Ribbon");
      }
      break;
  }

  return { styleFolder, precompName };
}

function duplicatePrecompToOutput(values) {
  const path = values.path + "/library/";
  const Name = "Template_Library";

  importAEPFile(path, Name);

  let ConocoFolder = findItemByName("Conoco");
  if (!ConocoFolder) {
    alert("Pasta 'Conoco' não encontrada! Criando uma nova...");
    ConocoFolder = app.project.items.addFolder("Conoco");
  }

  const libraryFolder = findItemByName("Library", ConocoFolder);
  if (!libraryFolder) {
    alert("Pasta 'Library' não encontrada!");
    return;
  }

  const { styleFolder, precompName } = getStyleFolderAndPrecompName(values, libraryFolder);

  if (!styleFolder) {
    alert("Subpasta correspondente a '" + values.style + "' não encontrada na pasta 'Library'!");
    return;
  }

  const precompItem = findItemByName(precompName, styleFolder);

  if (!precompItem || !(precompItem instanceof CompItem)) {
    alert("Pré-composição '" + precompName + "' não encontrada na pasta '" + values.style + "'!");
    return;
  }
}
