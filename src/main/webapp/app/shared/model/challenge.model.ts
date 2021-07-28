import { ISport } from 'app/shared/model/sport.model';
import { IChallengeValidity } from './challengeValidity,model';
import { IChallengeDistance } from './challenge-distance.model';
import { ITeam } from './team.model';
import { IUserCreated } from 'app/shared/model/user-created.model';
export interface IChallenge {
  id?: number;
  title?: string | null;
  calType?: number | null;
  objectType?: number | null;
  content?: string | null;
  status?: number | null;
  imgUrl?: string | null;
  price?: number | null;
  dateRegisDeadline?: string | null;
  dateStart?: string | null;
  dateFinish?: string | null;
  numOfParticipant?: number | null;
  numOfRegis?: number | null;
  userIdCreated?: number | null;
  challengeType?: number | null;
  dateUpdated?: string | null;
  dateCreated?: string | null;
  sport?: ISport;
  challengeValidity?: IChallengeValidity | null;
  challengeDistance?: IChallengeDistance[] | [];
  teams?: ITeam[] | [];
  organizationName?: string | null;
  numPerTeam?: number | null;
  userCreated?: IUserCreated | null;
}

export const defaultValue: Readonly<IChallenge> = {};
