export interface IChallengeValidity {
  check_time?: number;
  avg_pace_from?: number;
  avg_pace_to?: number;
  min_distance?: number;
  elevation_gain?: number;
  avg_cadence_from?: number;
  avg_cadence_to?: number;
  gps?: number;
  completion_criteria?: number;
  rank_criteria1?: number | null;
  rank_criteria2?: number | null;
  rank_criteria3?: number | null;
}

export const defaultValue: Readonly<IChallengeValidity> = {};
