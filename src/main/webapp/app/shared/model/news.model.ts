import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ICategory } from 'app/shared/model/category.model';

export interface INews {
  id?: number;
  content?: string;
  typeId?: number;
  desc?: string;
  title?: string;
  dateCreated?:string;
  dateUpdated?:string;
  user?: IUser;
  category?: ICategory;
}

export const defaultValue: Readonly<INews> = {};
