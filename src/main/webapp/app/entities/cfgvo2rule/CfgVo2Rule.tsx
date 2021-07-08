import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './CfgVo2Rule.reducer';

import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Translate, getSortState, IPaginationBaseState } from 'react-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

import { Button, Col, Row, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InfiniteScroll from 'react-infinite-scroller';

export interface ICfgVo2RuleProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

const mapStateToProps = ({ cfgVo2Rule }: IRootState) => ({
  cfgVo2RuleList: cfgVo2Rule.entities,
  loading: cfgVo2Rule.loading,
  totalItems: cfgVo2Rule.totalItems,
  links: cfgVo2Rule.links,
  entity: cfgVo2Rule.entity,
  updateSuccess: cfgVo2Rule.updateSuccess,
});

const mapDispatchToProps = {
  getEntities,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export const CfgVo2Rule = (props : ICfgVo2RuleProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );
  const [sorting, setSorting] = useState(false);

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const resetAll = () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
    props.getEntities();
  };

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      resetAll();
    }
  }, [props.updateSuccess]);

  useEffect(() => {
    getAllEntities();
  }, [paginationState.activePage]);

  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      });
    }
  };

  useEffect(() => {
    if (sorting) {
      getAllEntities();
      setSorting(false);
    }
  }, [sorting]);

  const sort = p => () => {
    props.reset();
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
    setSorting(true);
  };

  const handleSyncList = () => {
    resetAll();
  };

  const { cfgVo2RuleList, match, loading } = props;
  return (
    <div>
      <h2 id="cfgVo2Rule-heading" data-cy="cfgVo2RuleHeading">
        CFG VO2 Rule
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh List
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new CFG VO2 Rule
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        <InfiniteScroll
          pageStart={paginationState.activePage}
          loadMore={handleLoadMore}
          hasMore={paginationState.activePage - 1 < props.links.next}
          loader={<div className="loader">Loading ...</div>}
          threshold={0}
          initialLoad={false}
        >
          {cfgVo2RuleList && cfgVo2RuleList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand" onClick={sort('id')}>
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('calType')}>
                    Cal Type <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('fromDistance')}>
                    From Distance <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('toDistance')}>
                    To Distance <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('point')}>
                    Point <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cfgVo2RuleList.map((cfgVo2Rule, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button tag={Link} to={`${match.url}/${cfgVo2Rule.id}`} color="link" size="sm">
                        {cfgVo2Rule.id}
                      </Button>
                    </td>
                    <td>{cfgVo2Rule.calType}</td>
                    <td>{cfgVo2Rule.fromDistance}</td>
                    <td>{cfgVo2Rule.toDistance}</td>
                    <td>{cfgVo2Rule.point}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${cfgVo2Rule.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${cfgVo2Rule.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${cfgVo2Rule.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !loading && <div className="alert alert-warning">No CFG VO2 Rules found</div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );

} 

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2Rule);

