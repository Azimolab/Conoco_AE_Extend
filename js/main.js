const csInterface = new CSInterface();

window.onload = function () {
  updateCompDropdown();

  const compDropdown = document.getElementById("compDropdown");
  compDropdown.addEventListener("change", (event) => {
    updateCompPreview(event.target.value);
  });

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
