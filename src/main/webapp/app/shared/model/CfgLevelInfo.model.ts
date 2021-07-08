export interface ICfgLevelInfo {
  id?: number;
  minPoint?: number;
  maxPoint?: number;
  level?: number;
}

export const defaultValue: Readonly<ICfgLevelInfo> = {};