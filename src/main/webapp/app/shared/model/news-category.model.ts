import dayjs from 'dayjs';

export interface INewsCategory {
  id?: number;
  name?: string;
  dateCreated?: string | null;
}

export const defaultValue: Readonly<INewsCategory> = {};
