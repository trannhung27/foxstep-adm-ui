import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CfgLevelInfo from './CfgLevelInfo';
import CfgLevelInfoUpdate from './CfgLevelInfo-update';
import CfgLevelInfoDetail from './CfgLevelInfo-details';
import CfgLevelInfoDeleteDialog from './CfgLevelInfo-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CfgLevelInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CfgLevelInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CfgLevelInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={CfgLevelInfo} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CfgLevelInfoDeleteDialog} />
  </>
);

export default Routes;