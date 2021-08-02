export interface IJoinChallengeRequest {
  challengeUserId?: number;
  userId?: number;
  teamId?: number;
  name?: string | null;
  email?: string | null;
  status?: number;
  dateUpdated?: number | null;
  distanceTarget?: number;
  vo2Max?: number;
}
export const defaultValue: Readonly<IJoinChallengeRequest> = {};
