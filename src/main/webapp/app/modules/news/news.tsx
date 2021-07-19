import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Row, Table } from 'reactstrap';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './news.reducer';
import { APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import NewsFilterForm from 'app/modules/news/news-filter';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { PageHeader } from 'antd';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';

export interface INewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const News = (props: INewsProps) => {
  const overrideNewsCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'title.contains': params.get('title.contains'),
      'status.equals': params.get('status.equals'),
      'datePublished.greaterThanOrEqual': params.get('datePublished.greaterThanOrEqual'),
      'datePublished.lessThanOrEqual': params.get('datePublished.lessThanOrEqual'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideNewsCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'title.contains': criteria.title.contains,
      'status.equals': criteria.status.equals,
      'datePublished.greaterThanOrEqual': criteria.datePublished.greaterThanOrEqual
        ? convertDateTimeToServer(criteria.datePublished.greaterThanOrEqual).toISOString()
        : null,
      'datePublished.lessThanOrEqual': criteria.datePublished.lessThanOrEqual
        ? convertDateTimeToServer(criteria.datePublished.lessThanOrEqual).toISOString()
        : null,
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      getSortStateCustom(props.location, ITEMS_PER_PAGE, 'datePublished', 'desc'),
      props.location.search
    )
  );

  const getAllEntities = () => {
    props.getEntities(
      criteriaState,
      paginationState.activePage - 1,
      paginationState.itemsPerPage,
      `${paginationState.sort},${paginationState.order}`
    );
  };

  const sortEntities = () => {
    getAllEntities();
    let endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['title.contains']) endURL += '&title.contains=' + criteriaState['title.contains'];
    if (criteriaState['status.equals']) endURL += '&status.equals=' + criteriaState['status.equals'];
    if (criteriaState['datePublished.greaterThanOrEqual'])
      endURL += '&datePublished.greaterThanOrEqual=' + criteriaState['datePublished.greaterThanOrEqual'];
    if (criteriaState['datePublished.lessThanOrEqual'])
      endURL += '&datePublished.lessThanOrEqual=' + criteriaState['datePublished.lessThanOrEqual'];

    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [criteriaState, paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const { newsList, match, loading, totalItems } = props;
  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Quản lý tin tức"
        extra={
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Tạo mới
          </Link>
        }
      />
      <hr />
      <NewsFilterForm newsCriteria={criteriaState} handleFilter={handleFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {newsList && newsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand">STT</th>
                <th className="hand" onClick={sort('title')}>
                  Tiêu đề <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('user.email')}>
                  Người tạo <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Trạng thái <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('datePublished')}>
                  Thời gian đăng bài <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {newsList.map((news, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                      ? 1 + i
                      : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                  </td>
                  <td>{news.title}</td>
                  <td>{news.user ? news.user.email : ''}</td>
                  <td className="text-center">
                    {NEWS_STATUSES.map(status =>
                      status.id === news.status ? <Badge color={status.id === 1 ? 'success' : 'danger'}>{status.name}</Badge> : ''
                    )}
                  </td>
                  <td>{news.datePublished ? <TextFormat type="date" value={news.datePublished} format={APP_TIMESTAMP_FORMAT} /> : null}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${news.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-md-none d-lg-inline">Xem</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${news.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-md-none d-lg-inline">Sửa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Không tìm thấy dữ liệu</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={newsList && newsList.length > 0 ? 'px-4' : 'd-none'}>
          <Row className="justify-content-between">
            <PaginationItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  newsList: news.entities,
  loading: news.loading,
  totalItems: news.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(News);
