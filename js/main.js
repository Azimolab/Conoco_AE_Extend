const csInterface = new CSInterface();

window.onload = function () {
  updateCompDropdown();

  const compDropdown = document.getElementById("compDropdown");
  compDropdown.addEventListener("change", (event) => {
    updateCompPreview(event.target.value);
  });

  var first = document.getElementById("first");
  var second = document.getElementById("second");
  var third = document.getElementById("third");
  var image = document.getElementById("image"); // Adicione esta linha

  for (var x in subjectObject) {
    first.options[first.options.length] = new Option(x);
  }

  first.onchange = function () {
    // ...
    for (var y in subjectObject[this.value]) {
      second.options[second.options.length] = new Option(y);
    }
  };

  second.onchange = function () {
    third.length = 1;

    third.style.display = "block";
    var z = Object.keys(subjectObject[first.value][this.value]);

    for (let i = 0; i < z.length; i++) {
      third.options[third.options.length] = new Option(z[i]);
    }
  };

  // Quando uma opção na terceira lista suspensa é selecionada, atualize a imagem
  third.onchange = function () {
    var chosenOption = this.value;
    var imageUrl = subjectObject[first.value][second.value][chosenOption].img;
    // topicImage.src = imageUrl; // atualize o atributo src do elemento img

    const compPreview = document.getElementById("compPreview");
    compPreview.src = imageUrl;
  };

  const frame = document.getElementById("frame");
  frame.onmousedown = function (event) {
    event.preventDefault();

    const shiftX = event.clientX - frame.getBoundingClientRect().left;
    const shiftY = event.clientY - frame.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      var compPreview = document.getElementById("compPreview");
      var compPreviewRect = compPreview.getBoundingClientRect();

      var newLeft = pageX - shiftX;
      var newTop = pageY - shiftY;

      // Verifica os limites à esquerda e à direita
      if (newLeft < compPreviewRect.left) {
        newLeft = compPreviewRect.left;
      } else if (newLeft + frame.offsetWidth > compPreviewRect.right) {
        newLeft = compPreviewRect.right - frame.offsetWidth;
      }

      // Verifica os limites superior e inferior
      if (newTop < compPreviewRect.top) {
        newTop = compPreviewRect.top;
      } else if (newTop + frame.offsetHeight > compPreviewRect.bottom) {
        newTop = compPreviewRect.bottom - frame.offsetHeight;
      }

      frame.style.left = newLeft - compPreviewRect.left + "px";
      frame.style.top = newTop - compPreviewRect.top + "px";

      // Atualiza as coordenadas do frame
      const frameCoords = document.getElementById("frameCoords");
      frameCoords.textContent = `Frame coordinates: X = ${newLeft - compPreviewRect.left}, Y = ${newTop - compPreviewRect.top}`;
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };

    const copyCompButton = document.getElementById("copyCompButton");
    copyCompButton.addEventListener("click", () => {
      const compDropdown = document.getElementById("compDropdown");
      const compName = compDropdown.value;
      csInterface.evalScript(`copyToNewComp("${compName}", 1280, 720)`);
    });
  };

  frame.ondragstart = function () {
    return false;
  };
};

function updateCompDropdown() {
  csInterface.evalScript("getCompNames()", (result) => {
    const compNames = JSON.parse(result);
    const compDropdown = document.getElementById("compDropdown");
    compDropdown.innerHTML = "";
    for (let compName of compNames) {
      const option = document.createElement("option");
      option.value = compName;
      option.text = compName;
      compDropdown.appendChild(option);
    }
    // Auto-seleciona a primeira composição e atualiza a pré-visualização
    if (compNames.length > 0) {
      updateCompPreview(compNames[0]);
    }
  });
}

function updateCompPreview(compName) {
  const compPreview = document.getElementById("compPreview");
  compPreview.src = `./assets/${compName}.png`;
}

document.getElementById("addCompButton").addEventListener("click", function () {
  const selectedComp = document.getElementById("compDropdown").value;
  csInterface.evalScript(`addComp("${selectedComp}")`);
});

function addComp(compName) {
  var project = app.project;
  var comps = getCompositions();
  for (var i = 0; i < comps.length; i++) {
    if (comps[i].name === compName) {
      var comp = comps[i];
      var newComp = project.items.addComp("Nova Composição", comp.width, comp.height, comp.pixelAspect, comp.duration, comp.frameRate);
      for (var j = 1; j <= comp.numLayers; j++) {
        newComp.layers.add(comp.layer(j));
      }
      break;
    }
  }
}

function createNewComp(compName) {
  const script = `
        var comp = app.project.item(compName);
        if (comp) {
            app.project.items.addComp(compName + ' (Copy)', comp.width, comp.height, comp.pixelAspect, comp.duration, comp.frameRate);
        }
    `;
  csInterface.evalScript(script.replace("compName", `"${compName}"`));
}

var subjectObject = {
  "Solid Mark Motif": {
    "With Lines": {
      "Red only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Salmon only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Orange only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Purple only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Fuschia only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Green only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Aqua only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Salmon": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Orange": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Purple": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Fuschia": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Green": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Aqua": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    "Without Lines": {
      "Red only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Salmon only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Orange only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Purple only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Fuschia only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Green only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Aqua only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Salmon": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Orange": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Purple": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Fuschia": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Green": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Aqua": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    "Text Frame": {
      "Red only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Salmon only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Orange only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Purple only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Fuschia only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Green only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Aqua only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Salmon": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Orange": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Purple": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Fuschia": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Green": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Aqua": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    "Text Frame": {
      "Red only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Salmon only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Orange only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Purple only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Fuschia only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Green only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Aqua only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Salmon": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Orange": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Purple": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Fuschia": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Green": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Aqua": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    // Continue dessa forma para as outras seções: Bootstrap5, JavaScript, React.JS
  },
  "Linear Mark Motif": {
    Main: {
      "Red + BG W": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + BG R4": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    "Text Frame": {
      "Red only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Salmon only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Orange only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Purple only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Fuschia only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Green only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Aqua only": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Salmon": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Red + Orange": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Purple": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Blue + Fuschia": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Green": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
      "Teal + Aqua": { img: "./assets/Motif_Blue_End_Fuchsia.png" },
    },
    // Continue dessa forma para as outras seções: Bootstrap5, JavaScript, React.JS
  },
  "Back-end": {
    "Express.js": {
      "Routing and HTTP Methods": { img: "url_para_imagem_de_routing_and_http_methods" },
      Middleware: { img: "url_para_imagem_de_middleware" },
      Cookies: { img: "url_para_imagem_de_cookies" },
      "REST APIs": { img: "url_para_imagem_de_rest_apis" },
      Scaffolding: { img: "url_para_imagem_de_scaffolding" },
      "Database Connectivity": { img: "url_para_imagem_de_database_connectivity" },
      Templating: { img: "url_para_imagem_de_templating" },
    },
    // Continue dessa forma para as outras seções: Node.js
  },
  // Continue dessa forma para as outras categorias: Database, Hybrid/Cross-Platform
};

// import 'cropperjs/dist/cropper.css';
//import Cropper from "cropperjs";

// const image = document.getElementById("image");
// const cropper = new Cropper(image, {
//   aspectRatio: 1 / 1,
//   crop(event) {
//     console.log(event.detail.x);
//     console.log(event.detail.y);
//     console.log(event.detail.width);
//     console.log(event.detail.height);
//     console.log(event.detail.rotate);
//     console.log(event.detail.scaleX);
//     console.log(event.detail.scaleY);
//     frameCoords.textContent = event.detail.x;
//   },
// });

window.addEventListener("DOMContentLoaded", function () {
  var image = document.querySelector("#image");
  var data = document.querySelector("#data");
  var button = document.getElementById("button");
  var result = document.getElementById("result");
  var minCroppedWidth = 100;
  var minCroppedHeight = 100;
  var maxCroppedWidth = 1920;
  var maxCroppedHeight = 1080;

  var cropper = new Cropper(image, {
    viewMode: 3,
    zoomable: false,

    data: {
      width: (minCroppedWidth + maxCroppedWidth) / 2,
      height: (minCroppedHeight + maxCroppedHeight) / 2,
    },

    crop: function (event) {
      var width = Math.round(event.detail.width);
      var height = Math.round(event.detail.height);

      if (width < minCroppedWidth || height < minCroppedHeight || width > maxCroppedWidth || height > maxCroppedHeight) {
        cropper.setData({
          width: Math.max(minCroppedWidth, Math.min(maxCroppedWidth, width)),
          height: Math.max(minCroppedHeight, Math.min(maxCroppedHeight, height)),
        });
      }

      data.textContent = JSON.stringify(cropper.getData(true));
    },
  });

  button.onclick = function () {
    result.innerHTML = "";
    result.appendChild(cropper.getCroppedCanvas());
  };
});
