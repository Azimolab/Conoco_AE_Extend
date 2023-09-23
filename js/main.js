(function () {
  ("use strict");
  const sliderWrapper = document.getElementById("sliderWrapper");

  var path, slash;
  path = location.href;
  if (getOS() == "MAC") {
    slash = "/";
    path = path.substring(0, path.length - 11);
  }
  if (getOS() == "WIN") {
    slash = "/";
    path = path.substring(7, path.length - 11);
    path = path.replace(":", "");
    path = path.replace("C", "c");
  }

  //document.getElementById("previewSection").innerHTML = path;
  const forms = document.querySelectorAll(".needs-validation");
  const style = document.getElementById("style");
  const version = document.getElementById("version");
  const aspect_ratio_select = document.getElementById("aspect_ratio_select");
  const color_scheme = document.getElementById("color_scheme");
  const crop_select = document.getElementById("crop_select");
  const image = document.getElementById("image");
  const inputs = document.querySelectorAll("select"); // Seleciona todos os elementos select
  const createCompositionBtn = document.getElementById("create-composition"); // Botão Create Composition
  const exportBtn = document.getElementById("export"); // Botão Export
  const switch_alpha = document.getElementById("switch_alpha"); // Botão Export
  const movRadio = document.getElementById("MOV_file");
  const mp4Radio = document.getElementById("MP4_file");
  const resolution = document.getElementById("resolution_select");
  const fileNameInput = document.getElementById("FileNameInput");

  const widthSlider = document.getElementById("widthSlider");
  const heightSlider = document.getElementById("heightSlider");
  const xSlider = document.getElementById("xSlider");
  const ySlider = document.getElementById("ySlider");

  let cropper;
  var csInterface = new CSInterface();
  var rduration = true;
  var intervaloPermitido = [10, 15, 20, 30];
  var valoresDesabilitados = [5, 25, 35, 40, 45, 50, 55, 60];

  var modal = new bootstrap.Modal(document.getElementById("renderModal"), {
    backdrop: "static",
    keyboard: false,
  });

  document.getElementById("customRange1").addEventListener("input", function () {
    updateValue(this.value);
  });

  document.getElementById("cc-name").addEventListener("input", function () {
    updateRange(this.value);
  });

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      // 13 is the key code for Enter
      event.preventDefault();
      return false;
    }
  });

  if (rduration) {
    document.getElementById("cc-name").disabled = true;
    for (var valor of valoresDesabilitados) {
      var index = valor / 5;
      document.getElementById("sliderTicks").children[index - 1].classList.add("desabilitado");
    }
  }

  function updateValue(newValue) {
    if (rduration) {
      if (!intervaloPermitido.includes(Number(newValue))) {
        newValue = findClosestValue(Number(newValue), intervaloPermitido);
      }
    }
    document.getElementById("customRange1").value = newValue;
    document.getElementById("cc-name").value = newValue; // Note: Este elemento "cc-name" não está incluído no HTML fornecido. Certifique-se de que ele exista em seu código.
    updateFileNameInput();
  }

  function updateRange(newValue) {
    if (newValue < 5) {
      newValue = 5;
    } else if (newValue > 60) {
      newValue = 60;
    }
    document.getElementById("customRange1").value = newValue;
  }

  function findClosestValue(target, arr) {
    return arr.reduce((prev, curr) => (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev));
  }
  const AR = {
    "16:9": { x: 0, y: 0, width: 998, aspectRatio: 16 / 9 },
    "9:16": { x: 0, y: 0, width: 316, aspectRatio: 9 / 16 },
    "2:3": { x: 0, y: 0, width: 374, aspectRatio: 2 / 3 },
    "4:3": { x: 0, y: 0, width: 750, aspectRatio: 4 / 3 },
    "21:9": { x: 0, y: 0, width: 998, aspectRatio: 21 / 9 },
    "9:21": { x: 0, y: 0, width: 241, aspectRatio: 9 / 21 },
    "1:1": { x: 0, y: 0, width: 560, aspectRatio: 1 },
  };

  const AR4 = {
    "16:9": { x: 140, y: 279, width: 398, aspectRatio: 16 / 9 },
    "9:16": { x: 250, y: 0, width: 292, aspectRatio: 9 / 16 },
    "2:3": { x: 172, y: 280, width: 137, aspectRatio: 2 / 3 },
    "4:3": { x: 128, y: 216, width: 378, aspectRatio: 4 / 3 },
    "21:9": { x: 157, y: 316, width: 434, aspectRatio: 21 / 9 },
    "9:21": { x: 116, y: 72, width: 229, aspectRatio: 9 / 21 },
    "1:1": { x: 304, y: 269, width: 232, aspectRatio: 1 },
  };

  const AR2 = {
    "16:9": { x: 0, y: 168, width: 467, aspectRatio: 16 / 9 },
    "9:16": { x: 216, y: 141, width: 145, aspectRatio: 9 / 16 },
    "2:3": { x: 158, y: 133, width: 181, aspectRatio: 2 / 3 },
    "4:3": { x: 0, y: 120, width: 416, aspectRatio: 4 / 3 },
    "21:9": { x: 0, y: 160, width: 670, aspectRatio: 21 / 9 },
    "9:21": { x: 220, y: 119, width: 118, aspectRatio: 9 / 21 },
    "1:1": { x: 108, y: 154, width: 287, aspectRatio: 1 },
  };

  const AR3 = {
    "16:9": { x: 370, y: 234, width: 381, aspectRatio: 16 / 9 },
    "9:16": { x: 446, y: 56, width: 217, aspectRatio: 9 / 16 },
    "2:3": { x: 443, y: 120, width: 214, aspectRatio: 2 / 3 },
    "4:3": { x: 370, y: 130, width: 397, aspectRatio: 4 / 3 },
    "21:9": { x: 370, y: 265, width: 393, aspectRatio: 21 / 9 },
    "9:21": { x: 446, y: 29, width: 217, aspectRatio: 9 / 21 },
    "1:1": { x: 370, y: 53, width: 385, aspectRatio: 1 },
  };

  var imagesData = {
    "Solid Mark Motif": {
      "Without Lines": {
        "Red only": { img: "./assets/smm/smm_red_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue only": { img: "./assets/smm/smm_blue_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal only": { img: "./assets/smm/smm_teal_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Salmon only": { img: "./assets/smm/smm_salmon_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Orange only": { img: "./assets/smm/smm_orange_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Purple only": { img: "./assets/smm/smm_purple_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Fuchsia only": { img: "./assets/smm/smm_fuchsia_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Green only": { img: "./assets/smm/smm_green_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Aqua only": { img: "./assets/smm/smm_aqua_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Red + Salmon": { img: "./assets/smm/smm_red_salmon.png", rduration: false, lock: false, alpha: true, data: AR },
        "Red + Orange": { img: "./assets/smm/smm_red_orange.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue + Purple": { img: "./assets/smm/smm_blue_purple.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue + Fuchsia": { img: "./assets/smm/smm_blue_fuchsia.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal + Green": { img: "./assets/smm/smm_teal_green.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal + Aqua": { img: "./assets/smm/smm_teal_aqua.png", rduration: false, lock: false, alpha: true, data: AR },
      },
      "With Lines": {
        "Red only": { img: "./assets/smml/smml_red_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue only": { img: "./assets/smml/smml_blue_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal only": { img: "./assets/smml/smml_teal_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Salmon only": { img: "./assets/smml/smml_salmon_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Orange only": { img: "./assets/smml/smml_orange_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Purple only": { img: "./assets/smml/smml_purple_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Fuchsia only": { img: "./assets/smml/smml_fuchsia_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Green only": { img: "./assets/smml/smml_green_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Aqua only": { img: "./assets/smml/smml_aqua_only.png", rduration: false, lock: false, alpha: true, data: AR },
        "Red + Salmon": { img: "./assets/smml/smml_red_salmon.png", rduration: false, lock: false, alpha: true, data: AR },
        "Red + Orange": { img: "./assets/smml/smml_red_orange.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue + Purple": { img: "./assets/smml/smml_blue_purple.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue + Fuchsia": { img: "./assets/smml/smml_blue_fuchsia.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal + Green": { img: "./assets/smml/smml_teal_green.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal + Aqua": { img: "./assets/smml/smml_teal_aqua.png", rduration: false, lock: false, alpha: true, data: AR },
      },
      "Text Frame": {
        "Red only": { img: "./assets/smm_text_frame/smm_text_frame_red_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Blue only": { img: "./assets/smm_text_frame/smm_text_frame_blue_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Teal only": { img: "./assets/smm_text_frame/smm_text_frame_teal_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Salmon only": { img: "./assets/smm_text_frame/smm_text_frame_salmon_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Orange only": { img: "./assets/smm_text_frame/smm_text_frame_orange_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Purple only": { img: "./assets/smm_text_frame/smm_text_frame_purple_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Fuchsia only": { img: "./assets/smm_text_frame/smm_text_frame_fuchsia_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Green only": { img: "./assets/smm_text_frame/smm_text_frame_green_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Aqua only": { img: "./assets/smm_text_frame/smm_text_frame_aqua_only_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Red + Salmon": { img: "./assets/smm_text_frame/smm_text_frame_red_salmon_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Red + Orange": { img: "./assets/smm_text_frame/smm_text_frame_red_orange_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Blue + Purple": { img: "./assets/smm_text_frame/smm_text_frame_blue_purple_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
        "Blue + Fuchsia": {
          img: "./assets/smm_text_frame/smm_text_frame_blue_purple_16_9.png",
          rduration: false,
          lock: true,
          alpha: true,
          data: AR2,
        },
        "Blue + Fuchsia": {
          img: "./assets/smm_text_frame/smm_text_frame_blue_fuchsia_16_9.png",
          rduration: false,
          lock: true,
          alpha: true,
          data: AR2,
        },
        "Teal + Green": {
          img: "./assets/smm_text_frame/smm_text_frame_teal_green_16_9.png",
          rduration: false,
          lock: true,
          alpha: true,
          data: AR2,
        },
        "Teal + Aqua": { img: "./assets/smm_text_frame/smm_text_frame_teal_aqua_16_9.png", rduration: false, lock: true, alpha: true, data: AR2 },
      },
    },
    "Linear Mark Motif": {
      Main: {
        "Red 1 BG White": { img: "./assets/lmm_m/lmm_main_red_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Red 1 BG Red 4": { img: "./assets/lmm_m/lmm_main_red_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Blue 1 BG White": { img: "./assets/lmm_m/lmm_main_blue_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Blue 1 BG Blue 4": { img: "./assets/lmm_m/lmm_main_blue_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Teal 1 BG White": { img: "./assets/lmm_m/lmm_main_teal_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Teal 1 BG Teal 4": { img: "./assets/lmm_m/lmm_main_teal_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Salmon 1 BG White": { img: "./assets/lmm_m/lmm_main_salmon_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Salmon 1 BG Salmon 4": { img: "./assets/lmm_m/lmm_main_salmon_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Orange 1 BG White": { img: "./assets/lmm_m/lmm_main_orange_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Orange 1 BG Orange 4": { img: "./assets/lmm_m/lmm_main_orange_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Purple 1 BG White": { img: "./assets/lmm_m/lmm_main_purple_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Purple 1 BG Purple 4": { img: "./assets/lmm_m/lmm_main_purple_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Fuchsia 1 BG White": { img: "./assets/lmm_m/lmm_main_fuchsia_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Fuchsia 1 BG Fuchsia 4": { img: "./assets/lmm_m/lmm_main_fuchsia_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Green 1 BG White": { img: "./assets/lmm_m/lmm_main_green_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Green 1 BG Green 4": { img: "./assets/lmm_m/lmm_main_green_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        "Aqua 1 BG White": { img: "./assets/lmm_m/lmm_main_aqua_white_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
        "Aqua 1 BG Aqua 4": { img: "./assets/lmm_m/lmm_main_aqua_only_16_9.png", rduration: false, lock: false, alpha: false, data: AR },
        White: { img: "./assets/lmm_m/lmm_main_white_only_16_9.png", rduration: false, lock: false, alpha: true, data: AR },
      },
      "Text Frame": {
        "Red 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_red_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Red 1 BG Red 4": { img: "./assets/lmm_text/lmm_text_frame_red_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Blue 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_blue_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Blue 1 BG Blue 4": { img: "./assets/lmm_text/lmm_text_frame_blue_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Teal 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_teal_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Teal 1 BG Teal 4": { img: "./assets/lmm_text/lmm_text_frame_teal_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Salmon 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_salmon_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Salmon 1 BG Salmon 4": { img: "./assets/lmm_text/lmm_text_frame_salmon_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Orange 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_orange_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Orange 1 BG Orange 4": { img: "./assets/lmm_text/lmm_text_frame_orange_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Purple 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_purple_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Purple 1 BG Purple 4": { img: "./assets/lmm_text/lmm_text_frame_purple_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Fuchsia 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_fuchsia_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Fuchsia 1 BG Fuchsia 4": { img: "./assets/lmm_text/lmm_text_frame_fuchsia_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Green 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_green_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Green 1 BG Green 4": { img: "./assets/lmm_text/lmm_text_frame_green_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        "Aqua 1 BG White": { img: "./assets/lmm_text/lmm_text_frame_aqua_white.png", rduration: false, lock: true, alpha: true, data: AR4 },
        "Aqua 1 BG Aqua 4": { img: "./assets/lmm_text/lmm_text_frame_aqua_only.png", rduration: false, lock: true, alpha: false, data: AR4 },
        White: { img: "./assets/lmm_text/lmm_text_frame_white_only.png", rduration: false, lock: true, alpha: true, data: AR4 },
      },
    },
    Ribbon: {
      Main: {
        "Red 1 BG White": { img: "./assets/ribbon_main/ribbon_main_red02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Red 1 BG Red 4": { img: "./assets/ribbon_main/ribbon_main_red02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Blue 1 BG White": { img: "./assets/ribbon_main/ribbon_main_blue02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Blue 1 BG Blue 4": { img: "./assets/ribbon_main/ribbon_main_blue02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Teal 1 BG White": { img: "./assets/ribbon_main/ribbon_main_teal02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Teal 1 BG Teal 4": { img: "./assets/ribbon_main/ribbon_main_teal02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Salmon 1 BG White": { img: "./assets/ribbon_main/ribbon_main_salmon02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Salmon 1 BG Salmon 4": { img: "./assets/ribbon_main/ribbon_main_salmon02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Orange 1 BG White": { img: "./assets/ribbon_main/ribbon_main_orange02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Orange 1 BG Orange 4": { img: "./assets/ribbon_main/ribbon_main_orange02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Purple 1 BG White": { img: "./assets/ribbon_main/ribbon_main_purple02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Purple 1 BG Purple 4": { img: "./assets/ribbon_main/ribbon_main_purple02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Fuchsia 1 BG White": { img: "./assets/ribbon_main/ribbon_main_fuchsia02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Fuchsia 1 BG Fuchsia 4": {
          img: "./assets/ribbon_main/ribbon_main_fuchsia02_only.png",
          rduration: true,
          lock: true,
          alpha: false,
          data: AR3,
        },
        "Green 1 BG White": { img: "./assets/ribbon_main/ribbon_main_green02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Green 1 BG Green 4": { img: "./assets/ribbon_main/ribbon_main_green02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Aqua 1 BG White": { img: "./assets/ribbon_main/ribbon_main_aqua02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Aqua 1 BG Aqua 4": { img: "./assets/ribbon_main/ribbon_main_aqua02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
      },
    },
    "3D": {
      Fluid: {
        "Red 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_red_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Red 1 BG Red 4": { img: "./assets/3d_fluid_main/3d_fluid_red_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Blue 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_blue_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Blue 1 BG Blue 4": { img: "./assets/3d_fluid_main/3d_fluid_blue_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Teal 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_teal_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Teal 1 BG Teal 4": { img: "./assets/3d_fluid_main/3d_fluid_teal_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Salmon 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_salmon_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Salmon 1 BG Salmon 4": { img: "./assets/3d_fluid_main/3d_fluid_salmon_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Orange 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_orange_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Orange 1 BG Orange 4": { img: "./assets/3d_fluid_main/3d_fluid_orange_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Purple 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_purple_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Purple 1 BG Purple 4": { img: "./assets/3d_fluid_main/3d_fluid_purple_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Fuchsia 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_fuchsia_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Fuchsia 1 BG Fuchsia 4": { img: "./assets/3d_fluid_main/3d_fluid_fuchsia_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Green 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_green_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Green 1 BG Green 4": { img: "./assets/3d_fluid_main/3d_fluid_green_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Aqua 1 BG White": { img: "./assets/3d_fluid_main/3d_fluid_aqua_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Aqua 1 BG Aqua 4": { img: "./assets/3d_fluid_main/3d_fluid_aqua_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
      },
      Precise: {
        "Red 1 BG White": { img: "./assets/3d_precise/3d_precise_red02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Red 1 BG Red 4": { img: "./assets/3d_precise/3d_precise_red02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Blue 1 BG White": { img: "./assets/3d_precise/3d_precise_blue02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Blue 1 BG Blue 4": { img: "./assets/3d_precise/3d_precise_blue02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Teal 1 BG White": { img: "./assets/3d_precise/3d_precise_teal02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Teal 1 BG Teal 4": { img: "./assets/3d_precise/3d_precise_teal02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Salmon 1 BG White": { img: "./assets/3d_precise/3d_precise_salmon02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Salmon 1 BG Salmon 4": { img: "./assets/3d_precise/3d_precise_salmon02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Orange 1 BG White": { img: "./assets/3d_precise/3d_precise_orange02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Orange 1 BG Orange 4": { img: "./assets/3d_precise/3d_precise_orange02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Purple 1 BG White": { img: "./assets/3d_precise/3d_precise_purple02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Purple 1 BG Purple 4": { img: "./assets/3d_precise/3d_precise_purple02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Fuchsia 1 BG White": { img: "./assets/3d_precise/3d_precise_fuchsia02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Fuchsia 1 BG Fuchsia 4": { img: "./assets/3d_precise/3d_precise_fuchsia02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Green 1 BG White": { img: "./assets/3d_precise/3d_precise_green02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Green 1 BG Green 4": { img: "./assets/3d_precise/3d_precise_green02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
        "Aqua 1 BG White": { img: "./assets/3d_precise/3d_precise_aqua02_white.png", rduration: true, lock: true, alpha: true, data: AR3 },
        "Aqua 1 BG Aqua 4": { img: "./assets/3d_precise/3d_precise_aqua02_only.png", rduration: true, lock: true, alpha: false, data: AR3 },
      },
    },
    // Continue dessa forma para as outras categorias: Database, Hybrid/Cross-Platform
  };

  // Functions
  function populateDropdown(dropdown, options) {
    dropdown.options.length = 0;
    options.forEach((option) => dropdown.options.add(new Option(option)));
  }

  function initCropper(imageData, aspectRatio, lock, cropOption) {
    if (cropper) cropper.destroy();

    image.classList.remove("fade");

    image.onload = function () {
      image.classList.add("fade");
      const cropData = imageData.data[aspectRatio];
      const cropScale = cropOption === "100%" ? 1 : cropOption === "200%" ? 0.7 : 0.5;
      console.log(cropScale);
      console.log(cropData);

      widthSlider.disabled = false;
      heightSlider.disabled = false;
      xSlider.disabled = false;
      ySlider.disabled = false;

      cropper = new Cropper(image, {
        viewMode: 3,
        zoomable: false,
        aspectRatio: cropData.aspectRatio,
        highlight: false,
        guides: !lock,
        cropBoxResizable: getOS() === "MAC" ? false : !lock,
        center: !lock,

        crop: function (event) {
          data.textContent = JSON.stringify(cropper.getData(true));
          updateSliders(cropper.getData(true));
        },
        ready: function () {
          let cropData = imageData.data[aspectRatio];

          if (getOS() == "MAC") {
            sliderWrapper.style.display = "block";
          }

          const cropScale = cropOption === "100%" ? 1 : cropOption === "200%" ? 0.7 : 0.5;

          let newWidth = cropData.width * cropScale;
          let newHeight = (cropData.width * cropScale) / cropData.aspectRatio;

          // If lock is false and cropOption is "100%" or "200%", center the crop area
          if (!lock && (cropOption === "100%" || cropOption === "200%" || cropOption === "free")) {
            cropData.x = (image.naturalWidth - newWidth) / 2;
            cropData.y = (image.naturalHeight - newHeight) / 2;
          }

          cropper.setData(
            {
              x: cropData.x,
              y: cropData.y,
              width: newWidth,
              height: newHeight,
            },
            () => {
              updateSliders(cropData);
            }
          );

          // If lock is true, disable the cropper
          if (lock) {
            cropper.disable();
            widthSlider.disabled = true;
            heightSlider.disabled = true;
            xSlider.disabled = true;
            ySlider.disabled = true;
          }
        },
        cropmove: function (event) {
          if (lock == true) event.preventDefault();
        },
      });
    };

    image.src = imageData.img;
  }

  function updateSliders(cropData) {
    const aspectRatio = cropData.width / cropData.height;
    const maxCropWidthByHeight = image.naturalHeight * aspectRatio;

    // Escolha o menor valor entre a largura disponível baseada na posição x e a largura baseada na altura disponível
    const maxCropWidth = Math.min(image.naturalWidth - cropData.x, maxCropWidthByHeight);
    const maxCropHeight = image.naturalHeight - cropData.y;

    widthSlider.max = maxCropWidth;
    widthSlider.value = cropData.width;

    heightSlider.max = maxCropHeight;
    heightSlider.value = cropData.height;

    xSlider.max = image.naturalWidth - cropData.width;
    xSlider.value = cropData.x;

    ySlider.max = image.naturalHeight - cropData.height;
    ySlider.value = cropData.y;
  }

  xSlider.addEventListener("input", function () {
    const currentData = cropper.getData(true);
    currentData.x = parseInt(this.value, 10);
    cropper.setData(currentData);
    updateSliders(currentData); // Atualize os sliders após ajustar o x
  });

  ySlider.addEventListener("input", function () {
    const currentData = cropper.getData(true);
    currentData.y = parseInt(this.value, 10);
    cropper.setData(currentData);
    updateSliders(currentData); // Atualize os sliders após ajustar o y
  });

  widthSlider.addEventListener("input", function () {
    const currentData = cropper.getData(true);
    const aspect = currentData.width / currentData.height;
    currentData.width = parseInt(this.value, 10);
    currentData.height = currentData.width / aspect;
    cropper.setData(currentData);
    updateSliders(currentData); // Atualize os sliders após ajustar a largura
  });

  heightSlider.addEventListener("input", function () {
    const currentData = cropper.getData(true);
    const aspect = currentData.width / currentData.height;
    currentData.height = parseInt(this.value, 10);
    currentData.width = currentData.height * aspect;
    cropper.setData(currentData);
    updateSliders(currentData); // Atualize os sliders após ajustar a altura
  });

  function checkAlpha() {
    const chosenData = imagesData[style.value][version.value][color_scheme.value];

    if (chosenData.alpha && movRadio.checked) {
      switch_alpha.disabled = false;
      switch_alpha.checked = false;
    } else {
      switch_alpha.disabled = true;
      switch_alpha.checked = false;
    }

    // console.log(chosenData.alpha);
  }

  // Adiciona o evento de "change" ao checkbox
  mp4Radio.addEventListener("change", checkAlpha);
  movRadio.addEventListener("change", checkAlpha);

  function updateRdurationSettings() {
    const chosenData = imagesData[style.value][version.value][color_scheme.value];
    rduration = chosenData.rduration;

    const ccNameElement = document.getElementById("cc-name");
    const sliderTicksElement = document.getElementById("sliderTicks");
    const customRange1Element = document.getElementById("customRange1");

    if (rduration) {
      ccNameElement.disabled = true;
      for (let valor of valoresDesabilitados) {
        let index = valor / 5;
        sliderTicksElement.children[index - 1].classList.add("desabilitado");
      }
      customRange1Element.value = 15;
      ccNameElement.value = 15;
    } else {
      ccNameElement.disabled = false;
      for (let valor of valoresDesabilitados) {
        let index = valor / 5;
        sliderTicksElement.children[index - 1].classList.remove("desabilitado");
      }
    }
    // Reset slider value to 15
  }

  // Ouve eventos de alteração em todos os campos de entrada
  // inputs.forEach((input) => {
  //   input.addEventListener("change", checkInputs);
  // });

  // Event listeners
  window.onload = function () {
    //  alert("onload");

    //openExplorerOrFinder(outputPath);

    populateDropdown(style, Object.keys(imagesData));
    populateDropdown(version, Object.keys(imagesData[style.value]));
    populateDropdown(color_scheme, Object.keys(imagesData[style.value][version.value]));
    // checkInputs;
    // checkInputs;
    console.log(style.value);

    var globalStyle = style.value;
    var ribbon3D = false;

    style.onchange = function () {
      //console.log("style.value " + style.value);
      // console.log("globalStyle anterior " + globalStyle);

      if (globalStyle != style.value) {
        if (style.value === "3D" || style.value === "Ribbon") {
          if (ribbon3D === false) {
            console.log("ribbon false");
            populateDropdown(version, Object.keys(imagesData[this.value]));
            populateDropdown(color_scheme, Object.keys(imagesData[style.value][version.value]));

            ribbon3D = true;
          } else {
            populateDropdown(version, Object.keys(imagesData[this.value]));
          }
        }

        if (style.value === "Solid Mark Motif" || style.value === "Linear Mark Motif") {
          populateDropdown(version, Object.keys(imagesData[this.value]));
          populateDropdown(color_scheme, Object.keys(imagesData[style.value][version.value]));
          ribbon3D = false;
        }

        globalStyle = style.value;
        // console.log("globalStyle now " + globalStyle);
      }

      version.onchange();
      switch_alpha.onchange();
      //checkAlpha();
      //updateRdurationSettings();
      updateFileNameInput();
    };

    version.onchange = function () {
      color_scheme.onchange();
      //checkAlpha();
      //switch_alpha.onchange();
      updateRdurationSettings();
      updateFileNameInput();
    };

    color_scheme.onchange = function () {
      const chosenData = imagesData[style.value][version.value][this.value];
      const lock = chosenData.lock;

      // Disable crop_select if lock is true
      crop_select.disabled = lock;

      if (lock) {
        crop_select.value = "100%";
        crop_select.onchange(); // trigger the onchange event to update the cropper with 100% crop
      }

      aspect_ratio_select.disabled = !this.value;
      //aspect_ratio_select.onchange();
      //checkAlpha();
      //updateRdurationSettings();
      switch_alpha.onchange();
      updateFileNameInput();
    };

    crop_select.onchange = function () {
      const chosenData = imagesData[style.value][version.value][color_scheme.value];
      const aspectRatio = aspect_ratio_select.value;
      const lock = chosenData.lock;

      let cropOption = this.value;
      if (lock) {
        cropOption = "100%"; // force crop option to be 100% if lock is true
      }

      switch_alpha.onchange();
      updateFileNameInput();
      //initCropper(chosenData, aspectRatio, lock, cropOption);
    };

    aspect_ratio_select.onchange = function () {
      const chosenData = imagesData[style.value][version.value][color_scheme.value];
      const aspectRatio = this.value;
      const lock = chosenData.lock;
      const cropOption = crop_select.value;
      //console.log(aspectRatio);
      // checkAlpha();
      switch_alpha.onchange();
      updateFileNameInput();
      // initCropper(chosenData, aspectRatio, lock, cropOption);
    };

    switch_alpha.onchange = function () {
      const chosenData = imagesData[style.value][version.value][color_scheme.value];
      var thirdWord = color_scheme.value.split(" ")[3];

      console.log(thirdWord);
      const isSwitchChecked = switch_alpha.checked;
      const aspectRatio = aspect_ratio_select.value;
      const lock = chosenData.lock;
      const cropOption = crop_select.value;

      let selectedData;

      if (isSwitchChecked) {
        if (style.value === "Solid Mark Motif") {
          const newChosenData = Object.assign({}, chosenData);
          newChosenData.img = newChosenData.img.replace(".png", "_alpha.png");
          selectedData = newChosenData;
        } else if ((style.value === "Linear Mark Motif" || style.value === "Ribbon" || style.value === "3D") & (thirdWord === "White")) {
          const newChosenData = Object.assign({}, chosenData);
          newChosenData.img = newChosenData.img.replace(".png", "_alpha.png");
          selectedData = newChosenData;
        } else {
          const newChosenData = Object.assign({}, chosenData);
          selectedData = newChosenData;
          switch_alpha.disabled = true;
          switch_alpha.checked = false;
        }
      } else {
        const newChosenData = Object.assign({}, chosenData);
        switch_alpha.disabled = false;
        selectedData = chosenData;
      }

      //  console.log(selectedData);
      updateFileNameInput();
      initCropper(selectedData, aspectRatio, lock, cropOption);
    };

    resolution_select.onchange = function () {
      // Actions to be performed on resolution change can be added here
      //  console.log("Resolution changed to: " + this.value);
      // For now, just logging the change to the console
      updateFileNameInput();
    };

    style.onchange(); // Populate the dropdowns on page load

    function sendValuesToJSX(render, outputPath) {
      //alert("Coletando valores dos elementos DOM...");
      let croppedCanvas = cropper.getCroppedCanvas();
      let croppedImageSrc = croppedCanvas.toDataURL("image/png");
      // Transforma o objeto cropData no formato desejado
      const cropData = JSON.parse(data.textContent);

      const roi = {
        x: cropData.x,
        y: cropData.y,
        width: cropData.width,
        height: cropData.height,
      };

      const values = {
        style: style.value,
        version: version.value,
        colorScheme: color_scheme.value,
        cropSelect: crop_select.value,
        resolution: resolution.value,
        aspectRatio: aspect_ratio_select.value,
        duration: document.getElementById("customRange1").value,
        roi: roi,
        path: path,
        outputPath: outputPath,
        render: render,
        switchAlpha: switch_alpha.checked,
        fileType: movRadio.checked ? "mov" : mp4Radio.checked ? "mp4" : null,
        fileName: fileNameInput.value,
      };

      function openExplorerOrFinder(paths) {
        var os = csInterface.getOSInformation();
        // alert(os);
        if (os.indexOf("Windows") !== -1) {
          // Para Windows
          //alert("explorer");
          window.cep.process.createProcess("C:\\Windows\\explorer.exe", paths);
          //csInterface.evalScript("system.callSystem('cmd.exe /c start explorer .')");
        } else if (os.indexOf("Mac") !== -1) {
          // Para macOS
          csInterface.evalScript("system.callSystem('open .')");
        }
      }

      function openFile() {
        openExplorerOrFinder(outputPath);
      }

      function openDirectory() {
        var path = outputPath;
        var lastSlashIndex = path.lastIndexOf("\\");
        if (lastSlashIndex !== -1) {
          path = path.substring(0, lastSlashIndex);
        }
        openExplorerOrFinder(path);
      }

      let listContent = `
<div class="container mt-3 text-white">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <!-- Div da Imagem -->
            <div class="cropped-image-container mb-3 text-center">
                <img src="${croppedImageSrc}" alt="Cropped Image" class="img-fluid rounded border" />
            </div>
            
            <!-- Div da Tabela -->
            <div class="row justify-content-center">
            <div class="col-md-8" >
            <div class="table-responsive mb-3">
                <table class="table table-dark table-sm">
                    <tbody>
                        <tr>
                            <td><i class="bi bi-images"></i> Style</td>
                            <td>${values.style}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-collection"></i> Version</td>
                            <td>${values.version}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-palette"></i> Color Scheme</td>
                            <td>${values.colorScheme}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-tv"></i> Resolution (w)</td>
                            <td>${values.resolution + "p"}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-aspect-ratio-fill"></i> Aspect Ratio</td>
                            <td>${values.aspectRatio}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-clock"></i> Duration</td>
                            <td>${values.duration + " seconds"}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-eye"></i> Alpha</td>
                            <td>${values.switchAlpha ? "Yes" : "No"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            </div>
            <p class="text-center fs-7">Check the composition in the 'Output' folder</p>
        </div>
    </div>
</div>
`;

      let listContent2 = `
<div class="container mt-3 text-white">
    <div class="row justify-content-center">
        <div class="col-md-10">
            <!-- Div da Imagem -->
            <div class="cropped-image-container mb-3 text-center">
                <img src="${croppedImageSrc}" alt="Cropped Image" class="img-fluid rounded border" />
            </div>
            
            <!-- Div da Tabela -->
            <div class="row justify-content-center">
            <div class="col-md-8" >
            <div class="table-responsive mb-3">
                <table class="table table-dark table-sm">
                    <tbody>
                        <tr>
                            <td><i class="bi bi-images"></i> Style</td>
                            <td>${values.style}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-collection"></i> Version</td>
                            <td>${values.version}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-palette"></i> Color Scheme</td>
                            <td>${values.colorScheme}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-tv"></i> Resolution (w)</td>
                            <td>${values.resolution + "p"}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-aspect-ratio-fill"></i> Aspect Ratio</td>
                            <td>${values.aspectRatio}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-clock"></i> Duration</td>
                            <td>${values.duration + " seconds"}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-eye"></i> Alpha</td>
                            <td>${values.switchAlpha ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                            <td><i class="bi bi-file-earmark-play"></i> Format</td>
                            <td>${movRadio.checked ? "Mov" : mp4Radio.checked ? "Mp4" : null}</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            </div>
            </div>
            <div class="text-center">
    <p class="fs-7">Please check the rendered composition in the directory: ${outputPath}</p>
<div class="btn-group">
<button class="btn btn-outline-secondary" type="button" id="openFileBtn">Open File</button>
<button class="btn btn-outline-secondary" type="button" id="openDirectoryBtn">Open Directory</button>

</div>
</div>
        </div>
    </div>
</div>
`;

      // Envia o objeto para o script JSX
      csInterface.evalScript(`duplicatePrecompToOutput(${JSON.stringify(values)})`, function (result) {
        if (result === "1") {
          showModalWithMessage("Rendering Complete!", listContent2, false);
          document.getElementById("openFileBtn").addEventListener("click", openFile);
          document.getElementById("openDirectoryBtn").addEventListener("click", openDirectory);
        }
        if (result === "0") {
          showModalWithMessage("Composition Created!", listContent, false);
        }
      });
    }

    function showModalWithMessage(title, message, showProgress = true) {
      document.querySelector(".modal-body").innerHTML = message; // Isso limpará o conteúdo anterior
      if (showProgress) {
        addProgressBar(); // Adiciona a barra de progresso
      } else {
        removeProgressBar(); // Remove a barra de progresso
      }
      document.querySelector(".modal-title").textContent = title;
      modal.show();
    }

    createCompositionBtn.addEventListener("click", function () {
      showModalWithMessage("Creating composition", "Awaiting....", true);
      sendValuesToJSX(false);
    });

    exportBtn.addEventListener("click", function () {
      const desiredFileName = fileNameInput.value; // Recupera o valor do input

      const fileType = movRadio.checked ? "mov" : mp4Radio.checked ? "mp4" : null;

      // Passe o desiredFileName como um argumento adicional
      csInterface.evalScript(`chooseOutputPath("${fileType}", "${desiredFileName}")`, function (outputPath) {
        if (outputPath !== "null") {
          var msg2 = "Please wait and do not use the program until the process is complete.";

          sendValuesToJSX(true, outputPath);
          showModalWithMessage("Rendering in progress...", msg2, true);
        } else {
          console.log("Seleção de caminho cancelada pelo usuário.");
        }
      });
    });
    // Adiciona um evento de clique ao botão "Create Composition"
  };

  function removeProgressBar() {
    const modalBody = document.querySelector(".modal-body");
    const progressBarContainer = modalBody.querySelector(".progress");
    if (progressBarContainer) {
      modalBody.removeChild(progressBarContainer);
    }
  }

  function updateFileNameInput() {
    var firstName = style.value;
    var aspectRatio = aspect_ratio_select.value.replace(":", "x");
    var duration = document.getElementById("customRange1").value;
    var colorValue = color_scheme.value.replace(" +", "").replace("only", "").replace(" BG", "").trim();
    var vers = version.value.replace("Without Lines", "wL").replace("With Lines", "L").replace("Main", "M").replace("Text Frame", "TF").trim();

    var alphaName;
    if (switch_alpha.checked === true) {
      alphaName = " Alpha";
    } else {
      alphaName = "";
    }
    console.log(switch_alpha.checked);
    if (firstName === "Solid Mark Motif") {
      firstName = "SMM";
    }
    if (firstName === "Linear Mark Motif") {
      firstName = "LMM";
    }

    fileNameInput.value = firstName + " " + vers + " " + colorValue + alphaName + " " + aspectRatio + " " + duration + "s " + resolution.value;
  }

  function addProgressBar() {
    // Criar o contêiner da barra de progresso
    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress mt-3";

    // Criar a barra de progresso
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar progress-bar-striped progress-bar-animated";
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuenow", "100");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.style.width = "100%";

    // Anexar a barra de progresso ao contêiner
    progressBarContainer.appendChild(progressBar);

    // Anexar o contêiner da barra de progresso ao .modal-body
    const modalBody = document.querySelector(".modal-body");
    modalBody.appendChild(progressBarContainer);
  }
})();
