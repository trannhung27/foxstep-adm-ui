export interface ICfgVo2ChallengeRule {
  id?: number;
  minParticipant?: number;
  minComplete?: number;
  calType?: number;
}

export const defaultValue: Readonly<ICfgVo2ChallengeRule> = {};