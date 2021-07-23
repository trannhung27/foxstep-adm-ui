export interface IBanner {
  id?: number;
  contentId?: number;
  bannerTypeId?: number;
  title?: string | null;
  imgUrl?: string | null;
  dateStart?: string | null;
  dateFinish?: string | null;
  datePublished?: string | null;
  status?: number;
}

export const defaultValue: Readonly<IBanner> = {};
