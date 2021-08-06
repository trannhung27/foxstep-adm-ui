export interface IUserLockRequest {
  activity?: number | null;
  reason?: string | null;
  userId?: number | null;
}

export const defaultValue: Readonly<IUserLockRequest> = {};
