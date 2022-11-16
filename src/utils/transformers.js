export function transformStatus(statusStr) {
  if (statusStr === undefined) return [0];
  
  let status = statusStr.split('x')[1];

  if (!status) return [0];
  
  let statusArr = [];
  for (let i = 0; i < status.length ;i += 2) {
    let val = parseInt('0x' + status[i] + status[i + 1], 16);
    statusArr.push(val);
  }
  return statusArr;
}

export function numberToByteString(number) {
  // let outStr = '0x';
  let outStr = '';

  if (Array.isArray(number)) {
    number.forEach( item => {
      outStr = outStr.concat(Number(item).toString(16).padStart(2, '0'));
    });
  } else if (!isNaN(Number(number))) {
    outStr = outStr.concat(Number(number).toString(16).padStart(2, '0'));
  } else {
    throw "Parameter is not a number or array of numbers!";
  }

  return outStr;
}

export function transformStatusToHalfBytes(statusArr) {
  if (!Array.isArray(statusArr)) throw "Parameter is not an array!"

  return statusArr.map( item => [
    parseInt(item.toString(2).padStart(8, '0').substring(4), 2),
    parseInt(item.toString(2).padStart(8, '0').substring(0, 4), 2)
  ]);
}

export function transformStatusFromHalfBytes(statusArr) {
  if (!Array.isArray(statusArr)) throw "Parameter is not an array!"

  if (!statusArr.reduce( (accum, item) => accum && (Array.isArray(item) && item.length == 2), true)) {
    throw "Invalid array format!"
  }
  
  return statusArr.map( item => parseInt(item[1].toString(2).padStart(4, '0')
    .concat(item[0].toString(2).padStart(4, '0')), 2)
  );
}

export function concatHalfBytes(arr) {
  if (!Array.isArray(arr)) throw "Parameter is not an array!"
  
  return parseInt(arr[1].toString(2).padStart(4, '0')
    .concat(arr[0].toString(2).padStart(4, '0')), 2)
}

export function rgbToHsv({ r, g, b }) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

export function hexToRgb(hexStr) {
  let r = 0, g = 0, b = 0;

  if (!typeof hexStr == 'string' || !hexStr.startsWith('#')) return { r, g, b };

  r = parseInt(hexStr.substring(1, 3), 16);
  g = parseInt(hexStr.substring(3, 5), 16);
  b = parseInt(hexStr.substring(5, 7), 16);

  return { r, g, b };
}

export const hexToHsv = (hex) => rgbToHsv(hexToRgb(hex));


export function hsvToRgb(hsv) {
  let h = hsv.h / 360,
      s = hsv.s / 100,
      v = 1;

  let r, g, b;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function rgbToHex({ r, g, b }) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export const hsvToHex = (hsv) => rgbToHex(hsvToRgb(hsv));

//  Settings
import { SETTINGS_MAP } from '@/utils/consts/consts.js';

export function parseSettingsString(settingsString) {
  let settingsKeys = Array.from(Object.keys(SETTINGS_MAP));
  let settingsKeysStr = settingsKeys.join('|')

  let regexp = new RegExp(`(${settingsKeysStr})=.*?(?=(;(${settingsKeysStr})|$))`, 'gi');
  let result = Array.from(settingsString.matchAll(regexp))
    .map( item => item[0] )
    .reduce( (accum, item) => {
      let key = item.substring(0, item.indexOf('='));
      let val = item.substring(item.indexOf('=') + 1);

      return {
        ...accum,
        [key]: val
      }
    }, {});

  return result;
}

export function hexToDecimal (value, type) {
  if (!value) return
  let first = value.slice(0, 2)
  let second = value.slice(2, 4)

  const hexToDecimal = hex => parseInt(hex, 16);

  const dec1 = Number(hexToDecimal(first));
  const dec2 = Number(hexToDecimal(second));

  let calculation = dec1 / 250 * 10;
  let result = Number(dec2 + "." + Math.round(calculation));

  switch (type) {
    case 'co2':
      return Math.round(+(dec2 * 100) + (dec1 * 100) / 255)
    case 'dimer-lamp':
      return (result.toFixed(1) * 100) / 255;
    case 'sensor-device':
      return result
    case 'leak':
      switch (value) {
        case '00':
          return 'Протечки <br> нет';
        case '01':
          return 'Протечка  <br> есть'
        case '02':
          return 'Протечка <br> игнорируется';
        case '03':
          return ''
        default:
          return '--'
      }
  }

  return result.toFixed(1);
}

export function replaceAt (str, index, replacement) {
  str = str.split('');
  str[index] = replacement;
  return str = str.join('');
}