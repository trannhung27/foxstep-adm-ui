export interface ICfgVo2Rule {
  id?: number;
  calType?: number;
  fromDistance?: number;
  toDistance?: number;
  point?: number;
}

export const defaultValue: Readonly<ICfgVo2Rule> = {};