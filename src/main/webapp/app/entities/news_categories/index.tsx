import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Category from './news_categories';
import CategoryDetail from './news_categories-detail';
import CategoryUpdate from './news_categories-update';
import CategoryDeleteDialog from './news_categories-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={Category} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={CategoryDeleteDialog} />
  </>
);

export default Routes;
