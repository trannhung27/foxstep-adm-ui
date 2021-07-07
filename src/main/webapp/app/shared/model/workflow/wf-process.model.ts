import { IWfProcessGroup } from 'app/shared/model/workflow/wf-process-group.model';
import { IAuthority } from 'app/shared/model/authority.model';

export interface IWfProcess {
  id?: number;
  type?: number;
  status?: number;
  wfProcessGroup?: IWfProcessGroup | null;
  authority?: IAuthority | null;
}

export const defaultValue: Readonly<IWfProcess> = {};
