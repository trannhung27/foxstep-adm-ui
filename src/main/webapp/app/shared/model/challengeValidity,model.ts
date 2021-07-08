export interface IChallengeValidity {
  checkTime?: number;
  avgPaceFrom?: number;
  avgPaceTo?: number;
  minDistance?: number;
  elevationGain?: number;
  avgCadenceFrom?: number;
  avgCadenceTo?: number;
  gps?: number;
  completionCriteria?: number;
  rankCriteria1?: number | null;
  rankCriteria2?: number | null;
  rankCriteria3?: number | null;
}

export const defaultValue: Readonly<IChallengeValidity> = {};
