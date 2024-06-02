const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const luminance = (rgb: number[]) => {
  var a = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
};

export const contrast = (bg: string, fg: string) => {
  var lum1 = luminance(hexToRgb(bg)!);
  var lum2 = luminance(hexToRgb(fg)!);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const preferenceColor = (bg: string, candidate0: string, candidate1: string) => {
  const cr0 = contrast(bg, candidate0);
  const cr1 = contrast(bg, candidate1);
  if (cr1 >= cr0) return candidate1;
  return candidate0;
};
