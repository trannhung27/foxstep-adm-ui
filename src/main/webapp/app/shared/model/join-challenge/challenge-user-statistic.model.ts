import { IChallenge } from 'app/shared/model/challenge.model';
import { IUsers } from 'app/shared/model/users.model';

export interface IChallengeUserStatistic {
  distanceTarget?: number;
  teamId?: number;
  challenge?: IChallenge | null;
  user?: IUsers | null;
}

export const defaultValue: Readonly<IChallengeUserStatistic> = {};
