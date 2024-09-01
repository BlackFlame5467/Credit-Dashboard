export interface IBoard {
  id: number;
  title: string;
  value: () => void;
  newValue?: void;
}
