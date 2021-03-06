const palette = require('google-palette');

export function generateColors(number = 10) {
  const scheme = palette.listSchemes('mpn65')[0];
  return scheme.call(scheme, number);
}

export function resetColors(diagram: go.Diagram) {
  const colors = generateColors(diagram.nodes.count);
  let idx = 0;
  diagram.nodes.each(node => {
    if (!node.data.isGroup) {
      const color = colors[idx++];
      diagram.model.setDataProperty(node.data, 'color', `#${color}`);
      diagram.model.setDataProperty(node.data, 'textColor', `${invertColor(color, true)}`);
    }
  });
}

function padZero(str: string, len: number = 2) {
  const zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export function invertColor(hex: string, bw = false) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r: any = parseInt(hex.slice(0, 2), 16),
    g: any = parseInt(hex.slice(2, 4), 16),
    b: any = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}
