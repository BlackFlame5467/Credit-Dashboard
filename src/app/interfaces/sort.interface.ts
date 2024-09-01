import { SortColumn, SortDirection } from '../types/sort.type';

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
