export const Colors = {
  paper: '#FBF8F1',
  cream: '#F6F1E8',
  cream2: '#EFE7D6',
  stone: '#D4C9B8',
  stone2: '#BFB29E',

  oliveInk: '#2A331C',
  olive: '#3D4A2A',
  cocoa: '#4A3F35',
  cocoaSoft: '#6B5D50',

  matcha: '#7A8B5C',
  matchaDeep: '#5D6E42',

  strawberry: '#E8A5A5',
  strawberryDeep: '#C77D7D',
} as const;

export type ColorKey = keyof typeof Colors;
