import dayjs from 'dayjs';

export interface IUsersPosition {
  id?: number;
  level?: number | null;
  point?: number | null;
  distanceTotal?: number | null;
  timeTotal?: number | null;
  dateCreated?: string | null;
  dateUpdate?: string | null;
}

export const defaultValue: Readonly<IUsersPosition> = {};
