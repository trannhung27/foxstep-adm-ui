import { INewsCategory } from 'app/shared/model/news-category.model';
import { IUser } from 'app/shared/model/user.model';

export interface INews {
  id?: number;
  content?: string;
  description?: string;
  title?: string;
  imgUrl?: string | null;
  dateCreated?: string | null;
  dateUpdated?: string | null;
  datePublished?: string;
  status?: number;
  newsCategory?: INewsCategory;
  user?: IUser;
}

export const defaultValue: Readonly<INews> = {};
