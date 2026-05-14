export type CircleData = {
  c: Point;
  r: number;
  name?: string;
  color: string;
};

export type Point = {
  x: number;
  y: number;
};

export const COLORS = {
  primary: '#ffb300',
  surface: '#f2f2f2',
  border: '#d9d9d9',
  focus_ring: '#ffb300',
  text: '#333333',
  white: '#fff',
  black: '#000',
};
