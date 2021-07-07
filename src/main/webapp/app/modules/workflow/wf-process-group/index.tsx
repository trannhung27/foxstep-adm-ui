import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WfProcessGroup from './wf-process-group';
import WfProcessGroupDetail from './wf-process-group-detail';
import WfProcessGroupUpdate from './wf-process-group-update';
import WfProcessGroupDeleteDialog from './wf-process-group-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WfProcessGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WfProcessGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WfProcessGroupDetail} />
      <ErrorBoundaryRoute path={match.url} component={WfProcessGroup} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={WfProcessGroupDeleteDialog} />
  </>
);

export default Routes;
