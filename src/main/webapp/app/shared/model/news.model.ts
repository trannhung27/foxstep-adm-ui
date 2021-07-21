import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { INewsCategories } from './news_categories.model';
import { ICategory } from './category.model';

export interface INews {
  id?: number;
  content?: string;
  typeId?: number;
  desc?: string;
  title?: string;
  dateCreated?:string;
  dateUpdated?:string;
  status?: number;
  user?: IUser;
  category?: INewsCategories;
}

export const defaultValue: Readonly<INews> = {};
