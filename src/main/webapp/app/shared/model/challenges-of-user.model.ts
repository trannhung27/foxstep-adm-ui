export interface IChallengesOfUser {
  chalId?: number;
  chalTitle?: string | null;
  sportName?: string | null;
  chalType?: string | null;
  chalStatus?: string | null;
  chalUserStatus?: string | null;
  dateStart?: string | null;
  dateFinish?: string | null;
}

export const defaultValue: Readonly<IChallengesOfUser> = {};
