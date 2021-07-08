import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Post from './post';
import Category from './category';
import CfgLevelInfo  from './cfglevelinfo';
import CfgVo2ChallengeRule  from './cfgvo2challengerule';
import CfgVo2Rule  from './cfgvo2rule';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/post`} component={Post} />
      <ErrorBoundaryRoute path={`${match.url}/category`} component={Category} />
      <ErrorBoundaryRoute path={`${match.url}/cfglevelinfo`} component={CfgLevelInfo} />
      <ErrorBoundaryRoute path={`${match.url}/cfgvo2challengerule`} component={CfgVo2ChallengeRule} />
      <ErrorBoundaryRoute path={`${match.url}/cfgvo2rule`} component={CfgVo2Rule} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
