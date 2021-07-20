export interface IUploadImage {
  content?: string;
  imageName?: string;
  url?: string;
}

export const defaultValue: Readonly<IUploadImage> = {};
