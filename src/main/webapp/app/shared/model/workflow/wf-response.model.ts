export interface IWfResponse {
  wfProcessGroupId?: number;
  wfProcessType?: number;
  wfActionType?: number;
  contentId?: number;
  wfRequestStatus?: number;
  userId?: number;
  actionNote?: string;
}

export const defaultValue: Readonly<IWfResponse> = {};
