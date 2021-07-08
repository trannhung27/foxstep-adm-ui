import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CfgVo2ChallengeRule from './CfgVo2ChallengeRule';
import CfgVo2ChallengeRuleUpdate from './CfgVo2ChallengeRule-update';
import CfgVo2ChallengeRuleDetail from './CfgVo2ChallengeRule-details';
import CfgVo2ChallengeRuleDeleteDialog from './CfgVo2ChallengeRule-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CfgVo2ChallengeRuleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CfgVo2ChallengeRuleUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CfgVo2ChallengeRuleDetail} />
      <ErrorBoundaryRoute path={match.url} component={CfgVo2ChallengeRule} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CfgVo2ChallengeRuleDeleteDialog} />
  </>
);

export default Routes;