const express = require('express');
const app = express();
const url = require('url');
// const http = require('http');
// const cors = require('cors');
const hostname = '127.0.0.1';
const port = 3000;
const ColorScheme = require('color-scheme');

app.set('views', './views')
app.set('view engine', 'pug')


app.use('/files', express.static(`${__dirname}/assets/pdf`));
app.use('/img', express.static(`${__dirname}/assets/img`));
app.use('/css', express.static(`${__dirname}/assets/css`));
app.use('/font', express.static(`${__dirname}/assets/fonts`));
app.use('/js', express.static(`${__dirname}/assets/js`));

app.get('/', (req, res) => {
  res.render('color-combinations', {
    title: 'Color Combinations',
    metaTitle: 'Color Combinations',
    metaDescription: 'Color Combinations',
    css: 'color-combinations',
    js: 'color-combinations'
  })
});

// API JSON
app.get('/complementary/', (req, res) => {




  /**
   * Convert RGB model to HEX
   * @param {int} r value of red color
   * @param {int} g value of green color
   * @param {itt} b value of blue color
   * @returns color in HEX model (like #00000)
   */
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');



  /**
   * Convert RGB model to HSL and change H value to 180 degrees
   * @param {int} r value of red color 
   * @param {int} g value of green color
   * @param {int} b value of blue color
   * @returns converted HSL model
   */
  const rgbToHsl = (r, g, b) => {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;

    // Make inversion
    if (h >= 180) {
      h -= 180;
    } else {
      h += 180;
    }

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    // return "hsl(" + h + "," + s + "%," + l + "%)";
    return [h, s, l];
  }

  /**
   * Convert HSL model to RGB
   * @param {int} h value of hue
   * @param {int} s value of saturation
   * @param {int} l value of intensity
   * @returns RGB model color
   */
  const hslToRgb = (h, s, l) => {
    // Must be fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // return "rgb(" + r + "," + g + "," + b + ")";
    return [r, g, b];
  }

  let JSON_RESULT;
  let nextStep = false;

  // Get URL parameters
  const queryObject = url.parse(req.url, true).query;

  // Check if we have needed parameter
  if (typeof queryObject.color != 'undefined') {

    // If parameter exist but without any value
    if (queryObject.color === '') {
      JSON_RESULT = {
        'status': 'error',
        'description': 'wrong parameter, color parameter can\'t be an empty'
      };
    } // [x] if (queryObject.color === '') {...}

    // If parameter has some value
    else {

      let rgbColor, hexColor;

      // RGB model
      if (queryObject.color.includes(',')) {
        rgbColor = queryObject.color;
        rbgColors = rgbColor.split(',');

        // Wrong RGB model
        if (parseInt(rbgColors[0]) > 255 || parseInt(rbgColors[1]) > 255 || parseInt(rbgColors[2]) > 255) {
          JSON_RESULT = {
            'status': 'error',
            'description': 'wrong color parameter'
          };
        } // [x] wrong RGB model

        // RGB model is correct
        else {
          hexColor = colorFunctions.rgbToHex(parseInt(rbgColors[0]), parseInt(rbgColors[1]), parseInt(rbgColors[2]));
          JSON_RESULT = {
            'rgb': rgbColor,
            'hex': hexColor,
            'status': 'success',
            'description': 'RGB model'
          };
          nextStep = true;
        } // [x] RGB model is correct
      } // [x] rgb model

      // HEX model
      else {

        let hexCodeLength = queryObject.color.length;

        // Correct format
        if (hexCodeLength > 3 || hexCodeLength == 6) {
          nextStep = true;
          hexColor = queryObject.color;
          rgbColor = hexToRgb('#' + hexColor);
          JSON_RESULT = {
            'rgb': rgbColor,
            'hex': hexColor,
            'status': 'success',
            'description': 'HEX model'
          };
        } // [x] correct format

        // Error in format
        else {
          JSON_RESULT = {
            'status': 'error',
            'description': 'wrong parameter, HEX model needed to be 3 or 6 symbols length, in your case it ' + hexCodeLength + ' symbols'
          };
        } // [x] format error

      } // [x] hex model

      // Colors ready to next step
      if (nextStep) {
        // Convert RGB to HSL and change H value for 180 degrees
        let complementaryHslColor = rgbToHsl(rgbColor[0], rgbColor[1], rgbColor[2]);
        let complementaryRgbColor = hslToRgb(complementaryHslColor[0], complementaryHslColor[1], complementaryHslColor[2]);
        let complementaryHEXColor = rgbToHex(complementaryRgbColor[0], complementaryRgbColor[1], complementaryRgbColor[2]);

        JSON_RESULT = {
          'rgb': 'rgb(' + rgbColor + ')',
          'hex': '#' + hexColor,
          'complementary': {
            'rgb': 'rgb(' + complementaryRgbColor + ')',
            'hex': complementaryHEXColor
          },
          'mono': {
            'default' : generateColorScheme('mono', 'default', hexColor),
            'pastel' : generateColorScheme('mono', 'pastel', hexColor),
            'soft' : generateColorScheme('mono', 'soft', hexColor),
            'light' : generateColorScheme('mono', 'light', hexColor),
            'hard' : generateColorScheme('mono', 'hard', hexColor),
            'pale' : generateColorScheme('mono', 'pale', hexColor),
          },
          'contrast': {
            'default' : generateColorScheme('contrast', 'default', hexColor),
            'pastel' : generateColorScheme('contrast', 'pastel', hexColor),
            'soft' : generateColorScheme('contrast', 'soft', hexColor),
            'light' : generateColorScheme('contrast', 'light', hexColor),
            'hard' : generateColorScheme('contrast', 'hard', hexColor),
            'pale' : generateColorScheme('contrast', 'pale', hexColor),
          },
          'triade': {
            'default' : generateColorScheme('triade', 'default', hexColor),
            'pastel' : generateColorScheme('triade', 'pastel', hexColor),
            'soft' : generateColorScheme('triade', 'soft', hexColor),
            'light' : generateColorScheme('triade', 'light', hexColor),
            'hard' : generateColorScheme('triade', 'hard', hexColor),
            'pale' : generateColorScheme('triade', 'pale', hexColor),
          },
          'tetrade': {
            'default' : generateColorScheme('tetrade', 'default', hexColor),
            'pastel' : generateColorScheme('tetrade', 'pastel', hexColor),
            'soft' : generateColorScheme('tetrade', 'soft', hexColor),
            'light' : generateColorScheme('tetrade', 'light', hexColor),
            'hard' : generateColorScheme('tetrade', 'hard', hexColor),
            'pale' : generateColorScheme('tetrade', 'pale', hexColor),
          },
          'analogic': {
            'default' : generateColorScheme('analogic', 'default', hexColor),
            'pastel' : generateColorScheme('analogic', 'pastel', hexColor),
            'soft' : generateColorScheme('analogic', 'soft', hexColor),
            'light' : generateColorScheme('analogic', 'light', hexColor),
            'hard' : generateColorScheme('analogic', 'hard', hexColor),
            'pale' : generateColorScheme('analogic', 'pale', hexColor),
          },
          'status': 'success'
        };

      } // [x] colors ready to next step


    } // [x] else { ... }

  } // [x] if (typeof queryObject.color != 'undefined') {

  // There is no parameters
  else {
    JSON_RESULT = {
      'status': 'error',
      'description': 'color parameter was not found'
    };
  } // [x] else {...}

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(JSON_RESULT, null, 3));
}); // [x] app.get('/api', (req, res) => { ... }


app.listen(port);

function generateColorScheme(neededScheme, neededVariation, value_hex) {
  let scheme = new ColorScheme;
  scheme.from_hex(value_hex)
    .scheme(neededScheme)
    .variation(neededVariation);
  var colors = scheme.colors();
  var colors_count = 0;
  var result;

  switch (neededScheme) {
    case 'mono':
      result = {
        'rgb' : {
          1 : `rgb(${hexToRgb('#'+colors[0])})`,
          2 : `rgb(${hexToRgb('#'+colors[1])})`,
          3 : `rgb(${hexToRgb('#'+colors[2])})`,
          4 : `rgb(${hexToRgb('#'+colors[3])})`
    
        },
        'hex' : {
          1 : `#${colors[0]}`,
          2 : `#${colors[1]}`,
          3 : `#${colors[2]}`,
          4 : `#${colors[3]}`
        }
      };
      break;

    case 'contrast':
      result = {
        'rgb' : {
          1 : `rgb(${hexToRgb('#'+colors[0])})`,
          2 : `rgb(${hexToRgb('#'+colors[1])})`,
          3 : `rgb(${hexToRgb('#'+colors[2])})`,
          4 : `rgb(${hexToRgb('#'+colors[3])})`,
          5 : `rgb(${hexToRgb('#'+colors[4])})`,
          6 : `rgb(${hexToRgb('#'+colors[5])})`,
          7 : `rgb(${hexToRgb('#'+colors[6])})`,
          8 : `rgb(${hexToRgb('#'+colors[7])})`,
    
        },
        'hex' : {
          1 : `#${colors[0]}`,
          2 : `#${colors[1]}`,
          3 : `#${colors[2]}`,
          4 : `#${colors[3]}`,
          5 : `#${colors[4]}`,
          6 : `#${colors[5]}`,
          7 : `#${colors[6]}`,
          8 : `#${colors[7]}`,
        }
      };
      break;

    case 'triade':
      result = {
        'rgb' : {
          1 : `rgb(${hexToRgb('#'+colors[0])})`,
          2 : `rgb(${hexToRgb('#'+colors[1])})`,
          3 : `rgb(${hexToRgb('#'+colors[2])})`,
          4 : `rgb(${hexToRgb('#'+colors[3])})`,
          5 : `rgb(${hexToRgb('#'+colors[4])})`,
          6 : `rgb(${hexToRgb('#'+colors[5])})`,
          7 : `rgb(${hexToRgb('#'+colors[6])})`,
          8 : `rgb(${hexToRgb('#'+colors[7])})`,
          9 : `rgb(${hexToRgb('#'+colors[8])})`,
          10 : `rgb(${hexToRgb('#'+colors[9])})`,
          11 : `rgb(${hexToRgb('#'+colors[10])})`,
          12 : `rgb(${hexToRgb('#'+colors[11])})`,
    
        },
        'hex' : {
          1 : `#${colors[0]}`,
          2 : `#${colors[1]}`,
          3 : `#${colors[2]}`,
          4 : `#${colors[3]}`,
          5 : `#${colors[4]}`,
          6 : `#${colors[5]}`,
          7 : `#${colors[6]}`,
          8 : `#${colors[7]}`,
          9 : `#${colors[8]}`,
          10 : `#${colors[9]}`,
          11 : `#${colors[10]}`,
          12 : `#${colors[11]}`,
        }
      };
      break;

    case 'tetrade':
      result = {
        'rgb' : {
          1 : `rgb(${hexToRgb('#'+colors[0])})`,
          2 : `rgb(${hexToRgb('#'+colors[1])})`,
          3 : `rgb(${hexToRgb('#'+colors[2])})`,
          4 : `rgb(${hexToRgb('#'+colors[3])})`,
          5 : `rgb(${hexToRgb('#'+colors[4])})`,
          6 : `rgb(${hexToRgb('#'+colors[5])})`,
          7 : `rgb(${hexToRgb('#'+colors[6])})`,
          8 : `rgb(${hexToRgb('#'+colors[7])})`,
          9 : `rgb(${hexToRgb('#'+colors[8])})`,
          10 : `rgb(${hexToRgb('#'+colors[9])})`,
          11 : `rgb(${hexToRgb('#'+colors[10])})`,
          12 : `rgb(${hexToRgb('#'+colors[11])})`,
          13 : `rgb(${hexToRgb('#'+colors[12])})`,
          14 : `rgb(${hexToRgb('#'+colors[13])})`,
          15 : `rgb(${hexToRgb('#'+colors[14])})`,
          16 : `rgb(${hexToRgb('#'+colors[15])})`
    
        },
        'hex' : {
          1 : `#${colors[0]}`,
          2 : `#${colors[1]}`,
          3 : `#${colors[2]}`,
          4 : `#${colors[3]}`,
          5 : `#${colors[4]}`,
          6 : `#${colors[5]}`,
          7 : `#${colors[6]}`,
          8 : `#${colors[7]}`,
          9 : `#${colors[8]}`,
          10 : `#${colors[9]}`,
          11 : `#${colors[10]}`,
          12 : `#${colors[11]}`,
          13 : `#${colors[12]}`,
          14 : `#${colors[13]}`,
          15 : `#${colors[14]}`,
          16 : `#${colors[15]}`
        }
      };
      break;

    case 'analogic':
      result = {
        'rgb' : {
          1 : `rgb(${hexToRgb('#'+colors[0])})`,
          2 : `rgb(${hexToRgb('#'+colors[1])})`,
          3 : `rgb(${hexToRgb('#'+colors[2])})`,
          4 : `rgb(${hexToRgb('#'+colors[3])})`,
          5 : `rgb(${hexToRgb('#'+colors[4])})`,
          6 : `rgb(${hexToRgb('#'+colors[5])})`,
          7 : `rgb(${hexToRgb('#'+colors[6])})`,
          8 : `rgb(${hexToRgb('#'+colors[7])})`,
          9 : `rgb(${hexToRgb('#'+colors[8])})`,
          10 : `rgb(${hexToRgb('#'+colors[9])})`,
          11 : `rgb(${hexToRgb('#'+colors[10])})`,
          12 : `rgb(${hexToRgb('#'+colors[11])})`,
    
        },
        'hex' : {
          1 : `#${colors[0]}`,
          2 : `#${colors[1]}`,
          3 : `#${colors[2]}`,
          4 : `#${colors[3]}`,
          5 : `#${colors[4]}`,
          6 : `#${colors[5]}`,
          7 : `#${colors[6]}`,
          8 : `#${colors[7]}`,
          9 : `#${colors[8]}`,
          10 : `#${colors[9]}`,
          11 : `#${colors[10]}`,
          12 : `#${colors[11]}`,
        }
      };
        break;

    default:
      break;
  }

  return result;
}

  /**
   * Convert HEX model to RGB
   * @param {string} hex color in format #fff or #ffffff
   * @returns HEX model color (like 255,255,255)
   */
   const hexToRgb = hex =>
   hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
   .substring(1).match(/.{2}/g)
   .map(x => parseInt(x, 16));
