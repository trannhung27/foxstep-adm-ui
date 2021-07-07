import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WfProcess from './wf-process';
import WfProcessDetail from './wf-process-detail';
import WfProcessUpdate from './wf-process-update';
import WfProcessDeleteDialog from './wf-process-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WfProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WfProcessUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WfProcessDetail} />
      <ErrorBoundaryRoute path={match.url} component={WfProcess} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={WfProcessDeleteDialog} />
  </>
);

export default Routes;
