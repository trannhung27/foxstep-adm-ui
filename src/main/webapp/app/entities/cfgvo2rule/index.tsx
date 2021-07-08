import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CfgVo2Rule from './CfgVo2Rule';
import CfgVo2RuleUpdate from './CfgVo2Rule-update';
import CfgVo2RuleDetail from './CfgVo2Rule-details';
import CfgVo2RuleDeleteDialog from './CfgVo2Rule-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CfgVo2RuleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CfgVo2RuleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CfgVo2RuleDetail} />
      <ErrorBoundaryRoute path={match.url} component={CfgVo2Rule} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CfgVo2RuleDeleteDialog} />
  </>
);

export default Routes;