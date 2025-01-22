document.addEventListener('DOMContentLoaded', (event) => {
    const genButton = document.getElementById('gen');
    const saveButton = document.getElementById('save');
    const hexButton = document.getElementById('hex');
    const colorHarmonySelect = document.getElementById('color-harmony-select');
    const numColorsSlider = document.getElementById("myRange");

    genButton.addEventListener('click', generatePalette);
    saveButton.addEventListener('click', savePalette);
    hexButton.addEventListener('click', copyHexCode);
    colorHarmonySelect.addEventListener('change', changeColorHarmony);
    numColorsSlider.addEventListener('input', adjustNumColors);
});

function changeColorHarmony() {
    relationship = document.getElementById('color-harmony-select').value;
    generatePalette();
    console.log('Color Harmony changed');
}



let palette = []; 
let numColors = 3; 
let relationship = "analogous"; 
let originalHue = 0, originalSaturation = 0, originalLightness = 0; 
let slidersLocked = false;

// UI elements
let relationshipSelect, randomButton, saveButton, copyHexButton;
let animationProgress = []; 
function setup() {
  createCanvas(800, 600);
  colorMode(HSL);

 

  initializeDefaultPalette();
}
  
  function adjustNumColors() {
    numColors = document.getElementById("myRange").value;
    switch (relationship) {
      case "monochromatic":
        numColorsSlider.attribute("max", 5);
        break;
      case "triadic":
        numColorsSlider.attribute("max", 3);
        break;
      case "complementary":
        numColorsSlider.attribute("max", 2);
        break;
      case "split complementary":
        numColorsSlider.attribute("max", 3);
        break;
      default: // "none" and others
        numColorsSlider.attribute("max", 6);
        break;
    }
    numColors = constrain(numColorsSlider.value(), 1, numColorsSlider.attribute("max"));
    numColorsSlider.value(numColors);
  }

  function draw() {
    background(240);
  
    // Display palette
    let swatchWidth = width / max(1, palette.length);
    let paletteYOffset = 0;
    for (let i = 0; i < palette.length; i++) {
      let currentProgress = animationProgress[i];
      let outlineAlpha = map(currentProgress, 0, 30, 0, 255); // Fade effect
  

      fill(palette[i]);
      rect(i * swatchWidth, paletteYOffset, swatchWidth, 200);
  
      // Reset stroke for text
      noStroke();
  
      // Display color info
      fill(0);
      textAlign(CENTER);
      textSize(16);
      let h = int(hue(palette[i]));
      let s = int(saturation(palette[i]));
      let l = int(lightness(palette[i]));
      let hexColor = colorToHex(palette[i]);
      text(`H:${h} S:${s} L:${l}`, i * swatchWidth + swatchWidth / 2, paletteYOffset + 220);
      text(hexColor, i * swatchWidth + swatchWidth / 2, paletteYOffset + 240);
    }
  }

  function mousePressed() {
    let swatchWidth = width / max(1, palette.length);
    for (let i = 0; i < palette.length; i++) {
      if (mouseX > i * swatchWidth && mouseX < (i + 1) * swatchWidth) {
        selectedColorIndex = i;
        originalHue = hue(palette[i]);
        originalSaturation = saturation(palette[i]);
        originalLightness = lightness(palette[i]);
  
        slidersLocked = false;
        break;
      }
    }
  }

function generatePalette() {
    relationship = document.getElementById('color-harmony-select').value;
    palette = [];
    let baseHue = random(360); 
  
    switch (relationship) {
      case "none":
        for (let i = 0; i < numColors; i++) {
            let h = random(360);
            let s = random(100);
            let l = random(100);
            palette.push(color(h, s, l));
          }
        break;
      case "analogous":
        let anal_light = random(40,70);
        let anal_sat = random(anal_light,100);
        for (let i = 0; i < numColors; i++) {
          let hueOffset = (i - 1) * 30; 
          let newHue = (baseHue + hueOffset + 360) % 360;
          palette.push(color(newHue,anal_sat, anal_light));
        }
        break;
      case "monochromatic":
        let mono_light = 50;
        let mono_sat = random(20,100);
        for (let i = 0; i < 5; i++) {
          let lightnessOffset = (i - 1) * 20;
          let newLightness = constrain(mono_light + lightnessOffset, 0, 100);
          palette.push(color(baseHue, mono_sat, newLightness));
        }
        break;
      case "triadic":
        let tri_light = random(50,90);
        let tri_sat = random(tri_light + 10,100);
        for (let i = 0; i < 3; i++) {
          let hueOffset = i * 120;
          let newHue = (baseHue + hueOffset + 360) % 360;
          palette.push(color(newHue, tri_sat, tri_light));
        }
        break;
      case "complementary":
        let comp_light = random(45, 70);
        let comp_sat = random(comp_light + 20,100);
        palette.push(color(baseHue, comp_sat, comp_light));
        palette.push(color((baseHue + 180) % 360, comp_sat, comp_light));
        break;
      case "split complementary":
        let scomp_light = random(45, 70);
        let scomp_sat = random(scomp_light + 20,100);
        palette.push(color(baseHue, scomp_sat, scomp_light));
        palette.push(color((baseHue + 150) % 360, scomp_sat, scomp_light));
        palette.push(color((baseHue + 210) % 360, scomp_sat, scomp_light));
        break;
    }
  
    selectedColorIndex = -1; 
  }


function savePalette() {
    let img = createGraphics(width, 200);
    let swatchWidth = width / numColors;
  
    for (let i = 0; i < palette.length; i++) {
      img.fill(palette[i]);
      img.noStroke();
      img.rect(i * swatchWidth, 0, swatchWidth, 200);
    }
  
    save(img, "palette.png");
}

function copyHexCode() {
    if (selectedColorIndex >= 0) {
        let hexColor = colorToHex(palette[selectedColorIndex]);
        navigator.clipboard.writeText(hexColor).then(() => {
          alert("Hex code copied: " + hexColor);
        });
      }
}

function colorToHex(c) {
  let r = red(c);
  let g = green(c);
  let b = blue(c);
  return '#' + hex(r, 2) + hex(g, 2) + hex(b, 2);
}

function initializeDefaultPalette() {
  generatePalette(); // Generate an initial palette
}