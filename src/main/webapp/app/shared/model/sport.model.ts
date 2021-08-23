import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface ISport {
  id?: number;
  name?: string;
}

export const defaultValue: Readonly<ISport> = {};
