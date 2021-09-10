import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CfgRuleContent from './cfg-rule-content';
import CfgRuleContentUpdate from './cfg-rule-content-update';
import CfgRuleContentDetail from './cfg-rule-content-detail';
import CfgRuleContentDeleteDialog from './cfg-rule-content-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CfgRuleContentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CfgRuleContentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CfgRuleContentDetail} />
      <ErrorBoundaryRoute path={match.url} component={CfgRuleContent} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CfgRuleContentDeleteDialog} />
  </>
);

export default Routes;