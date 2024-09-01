import { IProfile } from '../interfaces/profile.interface';

export type SortColumn = keyof IProfile | '';
export type SortDirection = 'asc' | 'desc' | '';
