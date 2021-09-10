export interface ICfgRuleContent {
  id?: number;
  content?: string;
  type?: number;
}

export const defaultValue: Readonly<ICfgRuleContent> = {};