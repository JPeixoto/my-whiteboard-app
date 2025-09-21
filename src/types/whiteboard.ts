export type Tool = 'pen' | 'bruh' | 'eraser' | 'shape' | 'select' | 'text';

export type BrushStyle =
  | 'brush'
  | 'calligraphy-brush'
  | 'calligraphy-pen'
  | 'airbrush'
  | 'oil-brush'
  | 'crayon'
  | 'marker'
  | 'natural-pencil'
  | 'watercolor-brush';

export type ShapeType = 'rectangle' | 'circle' | 'triangle';

export interface Path {
  id: number;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  brushStyle?: BrushStyle; // defaults to 'brush'
}

export interface Shape {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  type: ShapeType;
}

export interface Img {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLImageElement;
  src: string;
}

export interface TextElement {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  width: number;
  height: number;
}
