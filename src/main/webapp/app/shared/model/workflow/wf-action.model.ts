export interface IWfAction {
  email?: string;
  userType?: string;
  actionType?: string;
  requestStatus?: string;
  datCreated?: string | null;
}

export const defaultValue: Readonly<IWfAction> = {};
