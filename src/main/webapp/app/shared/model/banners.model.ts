import { INews } from "./news.model";
import { INewsCategories } from "./news_categories.model";

export interface IBanners{
    id?: number,
    content_id?: number;
    banner_type_id?: number;
    date_created?: string;
    date_updated?: string;
}

export const defaultValue: Readonly<IBanners> = {};