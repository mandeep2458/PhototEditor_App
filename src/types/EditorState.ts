type EditorState = {
  imageUri: string;
  filter: number[];
  adjustmentMatrix:number[];
  texts: TextItem[];
  overLAyImages:OverlayImageItem[];
}
type TextItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontFaimly:string|undefined;
};
type OverlayImageItem = {
  id: string;
  uri: string;
  x: number;
  y: number;
  isSelected:boolean;
  width: number;
  height: number;
}