import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WfActionType from './wf-action-type';
import WfActionTypeDetail from './wf-action-type-detail';
import WfActionTypeUpdate from './wf-action-type-update';
import WfActionTypeDeleteDialog from './wf-action-type-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WfActionTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WfActionTypeUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WfActionTypeDetail} />
      <ErrorBoundaryRoute path={match.url} component={WfActionType} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={WfActionTypeDeleteDialog} />
  </>
);

export default Routes;
