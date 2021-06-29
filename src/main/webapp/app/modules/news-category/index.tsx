import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import NewsCategory from './news-category';
import NewsCategoryDetail from './news-category-detail';
import NewsCategoryUpdate from './news-category-update';
import NewsCategoryDeleteDialog from './news-category-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={NewsCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={NewsCategoryUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={NewsCategoryDetail} />
      <ErrorBoundaryRoute path={match.url} component={NewsCategory} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={NewsCategoryDeleteDialog} />
  </>
);

export default Routes;
