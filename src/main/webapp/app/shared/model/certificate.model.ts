export interface ICertificate {
  challengeId?: number;
  fullName?: number;
  challengeName?: number;
  timeChallenge?: number;
  avgPace?: number;
  timeFinish?: number;
  rank?: number | null;
  signature?: number;
  distance?: number;
  textCompletion?: number;
  frame?: string;
  signatureDisplay?: string;
}

export const defaultValue: Readonly<ICertificate> = {};
