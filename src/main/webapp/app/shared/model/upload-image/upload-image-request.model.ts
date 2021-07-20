export interface IUploadImageRequest {
  content?: string;
  imageName?: string;
  url?: string;
}

export const defaultValue: Readonly<IUploadImageRequest> = {};
