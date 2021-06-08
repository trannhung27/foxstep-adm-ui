import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ICategory } from 'app/shared/model/category.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: string;
  creationDate?: string;
  user?: IUser;
  category?: ICategory;
}

export const defaultValue: Readonly<IPost> = {};
