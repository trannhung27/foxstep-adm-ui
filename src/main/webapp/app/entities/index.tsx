import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Post from './post';
import Category from './category';
import News_categories from './news_categories';
import News from './news';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/post`} component={Post} />
      <ErrorBoundaryRoute path={`${match.url}/category`} component={Category} />
      <ErrorBoundaryRoute path={`${match.url}/news_categories`} component={News_categories} />
      <ErrorBoundaryRoute path={`${match.url}/news`} component={News} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
