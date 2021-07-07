export interface IWfRequest {
  processGroupId?: number;
  processTypeId?: number;
  actionType?: number;
  contentId?: number;

  attachmentUrl?: string;
  requestNote?: string;
  requestData?: string;
  actionNote?: string;
}

export const defaultValue: Readonly<IWfRequest> = {};
