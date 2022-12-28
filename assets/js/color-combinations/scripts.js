new WOW().init(); // animate on scroll



const
  // Nav
  link_JSON = document.getElementById('jsonLink'),
  // Header
  el_header = document.getElementById('header'),
  // Range Input
  el_range_r = document.getElementById('r_value_range'),
  el_range_g = document.getElementById('g_value_range'),
  el_range_b = document.getElementById('b_value_range'),
  // Number Input
  el_number_r = document.getElementById('r_value_input'),
  el_number_g = document.getElementById('g_value_input'),
  el_number_b = document.getElementById('b_value_input'),
  // HEX Input
  el_input_hex = document.getElementById('box-hex-input'),

  // Complementary colors
  complementary_box_1 = document.getElementById('box-complementary-color-1'),
  complementary_box_2 = document.getElementById('box-complementary-color-2'),
  complementary_color_1 = document.getElementById('box-complementary-code-1'),
  complementary_color_2 = document.getElementById('box-complementary-code-2');



let value_hex, vale_rgb, value_r, value_g, value_b;
let neededColor = false;

do {
  value_hex = '#' + Math.floor(Math.random() * 16777215).toString(16);
  vale_rgb = hexToRgb(`${value_hex}`);
  if (vale_rgb[0] != vale_rgb[1] && vale_rgb[0] != vale_rgb[2] && vale_rgb[1] != vale_rgb[2]) {
    if (vale_rgb[0] < 180 && vale_rgb[1] < 180 && vale_rgb[2] < 200) {
      neededColor = true;
    }
  }

} while (!neededColor);

value_r = vale_rgb[0];
value_g = vale_rgb[1];
value_b = vale_rgb[2];

// Change background color and data
changeHeaderLinearGradient();
changeRGB();
changeHEXInput();
changeJsonLink();
// Change Color Combinations
changeComplementaryColor();
generateAllMono();
generateAllContrast();
generateAllTriadic();
generateAllTetradic();
generateAllAnalogic();





// R change
el_number_r.addEventListener('input', () => {
  inputChanged(el_number_r, el_range_r, 'r');
});
el_range_r.addEventListener('input', () => {
  inputChanged(el_range_r, el_number_r, 'r');
});
// G change
el_number_g.addEventListener('input', () => {
  inputChanged(el_number_g, el_range_g, 'g');
});
el_range_g.addEventListener('input', () => {
  inputChanged(el_range_g, el_number_g, 'g');
});
// B change
el_number_b.addEventListener('input', () => {
  inputChanged(el_number_b, el_range_b, 'b');
});
el_range_b.addEventListener('input', () => {
  inputChanged(el_range_b, el_number_b, 'b');
});

// HEX changed
el_input_hex.addEventListener('input', () => {

  let enteredHexValue = el_input_hex.value,
    enteredHexValueLength = el_input_hex.value.length,
    convertedRgbValue = enteredHexValueLength > 2 ? hexToRgb(enteredHexValue) : [];

  if (convertedRgbValue.length === 3) {
    value_r = convertedRgbValue[0];
    value_g = convertedRgbValue[1];
    value_b = convertedRgbValue[2];
    value_hex = enteredHexValue;

    changeRGB();
    changeHeaderLinearGradient();
    changeHEXInput();
    changeJsonLink();
    // Change Color Combinations
    changeComplementaryColor();
    generateAllMono();
    generateAllContrast();
    generateAllTriadic();
    generateAllTetradic();
    generateAllAnalogic();
  } // [x] if (convertedRgbValue.length === 3) { ... }

}); // [x] el_input_hex.addEventListener('input', ()=>{ ... }




/**
 * On input(range or number) change
 * @param {Element} el_number number input
 * @param {Element} el_range  range input
 * @param {String} color color
 */
function inputChanged(el_number, el_range, color) {
  let enteredValue = el_number.value;
  if (enteredValue < 0) {
    enteredValue = 0;
  } else if (enteredValue > 255) {
    enteredValue = 255;
  }

  el_number.value = enteredValue;
  el_range.value = enteredValue;

  switch (color) {
    case 'r':
      value_r = parseInt(enteredValue);
      break;
    case 'g':
      value_g = parseInt(enteredValue);
      break;
    case 'b':
      value_b = parseInt(enteredValue);
      break;
    default:
      break;
  }

  value_hex = rgbToHex(value_r, value_g, value_b);

  changeHeaderLinearGradient();
  changeHEXInput();
  changeJsonLink();
  // Change Color Combinations
  changeComplementaryColor();
  generateAllMono();
  generateAllContrast();
  generateAllTetradic();
  generateAllTriadic();
  generateAllAnalogic();
} // [x] function inputChanged(el_number, el_range, color) { ... }


/**
 * Change Header Linear Gradient
 */
function changeHeaderLinearGradient() {
  value_hex_lighten = pSBC(0.42, value_hex);
  el_header.style.background = `url(img/wave.webp),linear-gradient(180deg, ${value_hex} 50%, ${value_hex_lighten} 100%)`;
  el_header.style.backgroundRepeat = 'no-repeat';
  el_header.style.backgroundPosition = 'left bottom';
  el_header.style.backgroundSize = '100% auto';
} // [x] function changeHeaderLinearGradient() {...}


/**
 * Change JSON link in nav menu
 */
function changeJsonLink() {
  link_JSON.href = `/complementary?color=${value_hex.replace('#','')}`;
} // [x] function changeJsonLink() {...}


function changeRGB() {
  el_number_r.value = value_r;
  el_range_r.value = value_r;
  el_number_g.value = value_g;
  el_range_g.value = value_g;
  el_number_b.value = value_b;
  el_range_b.value = value_b;
}

/**
 * Change complementary color
 */
function changeComplementaryColor() {
  let complementaryHSL = rgbToHsl(value_r, value_g, value_b);
  result_rgb = hslToRgb(complementaryHSL[0], complementaryHSL[1], complementaryHSL[2]);
  result_hex = rgbToHex(result_rgb[0], result_rgb[1], result_rgb[2]);
  complementary_box_1.style.backgroundColor = value_hex;
  complementary_box_2.style.backgroundColor = result_hex;
  complementary_color_1.innerHTML = `${value_hex} <br> rgb(${hexToRgb(value_hex)})`;
  complementary_color_2.innerHTML = `${result_hex} <br> rgb(${result_rgb})`;

  // el_value_comp.style.color = result_hex;
  // el_value_comp.innerHTML = `${result_hex} <br> rgb(${result_rgb})`;

} // [x] function changeComplementaryColor() { ... }


/**
 * Change HEX input
 */
function changeHEXInput() {
  el_input_hex.value = value_hex;
  el_input_hex.style.color = 'white';
  el_input_hex.style.outlineColor = value_hex;
  // el_input_hex.style.borderColor = value_hex;
  el_input_hex.style.backgroundColor = value_hex;
} // [x] function changeHEXInput() { ... }



// 


// document.getElementById('box-result-mono-color-1').style.backgroundColor = `#${colors[0]}`;
// document.getElementById('box-result-mono-color-2').style.backgroundColor = `#${colors[1]}`;
// document.getElementById('box-result-mono-color-3').style.backgroundColor = `#${colors[2]}`;
// document.getElementById('box-result-mono-color-4').style.backgroundColor = `#${colors[3]}`;



function generateRandom(min = 0, max = 100) {

  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor(rand * difference);

  // add with min value 
  rand = rand + min;
  console.log(min, max, rand);
  return rand;
}

function generateColorScheme(neededScheme, neededVariation) {
  let scheme = new ColorScheme;
  scheme.from_hex(value_hex.replace('#', ''))
    .scheme(neededScheme)
    .variation(neededVariation);
  var colors = scheme.colors();
  var colors_count = 0;

  switch (neededScheme) {
    case 'mono':
      colors_count = 3;
      break;

    case 'contrast':
      colors_count = 7;
      break;

    case 'triade':
      colors_count = 11;
      break;

    case 'tetrade':
      colors_count = 15;
      break;

    case 'analogic':
        colors_count = 11;
        break;

    default:
      break;
  }



  for (let index = 0; index <= colors_count; index++) {
    document.getElementById(`box-${neededScheme}-${neededVariation}-color-${index}`).style.backgroundColor = colors[index];
    document.getElementById(`box-${neededScheme}-${neededVariation}-code-${index}`).innerHTML = `#${colors[index]} <br> rgb(${hexToRgb('#'+colors[index])})`;
  }
}


function generateAllMono() {
  generateColorScheme('mono', 'default');
  generateColorScheme('mono', 'pastel');
  generateColorScheme('mono', 'soft');
  generateColorScheme('mono', 'light');
  generateColorScheme('mono', 'hard');
  generateColorScheme('mono', 'pale');
}

function generateAllContrast() {
  generateColorScheme('contrast', 'default');
  generateColorScheme('contrast', 'pastel');
  generateColorScheme('contrast', 'soft');
  generateColorScheme('contrast', 'light');
  generateColorScheme('contrast', 'hard');
  generateColorScheme('contrast', 'pale');
}


function generateAllTriadic() {
  generateColorScheme('triade', 'default');
  generateColorScheme('triade', 'pastel');
  generateColorScheme('triade', 'soft');
  generateColorScheme('triade', 'light');
  generateColorScheme('triade', 'hard');
  generateColorScheme('triade', 'pale');
}

function generateAllTetradic() {
  generateColorScheme('tetrade', 'default');
  generateColorScheme('tetrade', 'pastel');
  generateColorScheme('tetrade', 'soft');
  generateColorScheme('tetrade', 'light');
  generateColorScheme('tetrade', 'hard');
  generateColorScheme('tetrade', 'pale');
}

function generateAllAnalogic() {
  generateColorScheme('analogic', 'default');
  generateColorScheme('analogic', 'pastel');
  generateColorScheme('analogic', 'soft');
  generateColorScheme('analogic', 'light');
  generateColorScheme('analogic', 'hard');
  generateColorScheme('analogic', 'pale');
}