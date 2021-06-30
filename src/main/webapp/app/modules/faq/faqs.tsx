import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { getSortState, JhiItemCount, JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './faq.reducer';
import { APP_DATE_FORMAT, APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import FaqFilterForm from 'app/modules/faq/faq-filter';

export interface INewsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Faq = (props: INewsProps) => {
  const overrideNewsCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'title.contains': params.get('title.contains'),
      'status.equals': params.get('status.equals'),
      'newsCategoryId.equals': params.get('newsCategoryId.equals'),
      'datePublished.greaterThanOrEqual': params.get('datePublished.greaterThanOrEqual'),
      'datePublished.lessThanOrEqual': params.get('datePublished.lessThanOrEqual'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideNewsCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'title.contains': criteria.title.contains,
      'status.equals': criteria.status.equals,
      'newsCategoryId.equals': criteria.newsCategoryId.equals,
      'datePublished.greaterThanOrEqual': convertDateTimeToServer(criteria.datePublished.greaterThanOrEqual).toISOString(),
      'datePublished.lessThanOrEqual': convertDateTimeToServer(criteria.datePublished.lessThanOrEqual).toISOString(),
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
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

  const handleSyncList = () => {
    sortEntities();
  };

  const { faqsList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="news-heading" data-cy="NewsHeading">
        Quản lý FAQ, Hướng dẫn
      </h2>

      <FaqFilterForm faqCriteria={criteriaState} handleFilter={handleFilter} updating={loading} />

      <div className="d-flex justify-content-end">
        <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} /> Làm mới
        </Button>
        <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Tạo mới
        </Link>
      </div>

      <div className="table-responsive">
        {faqsList && faqsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('title')}>
                  Tiêu đề <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Loại <FontAwesomeIcon icon="sort" />
                </th>
                <th>
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
              {faqsList.map((faq, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${faq.id}`} color="link" size="sm">
                      {faq.id}
                    </Button>
                  </td>
                  <td>{faq.title}</td>
                  <td>{faq.newsCategory ? <Link to={`news-category/${faq.newsCategory.id}`}>{faq.newsCategory.name}</Link> : ''}</td>
                  <td>{faq.newsCategory ? faq.user.email : ''}</td>
                  <td>{faq.status}</td>
                  <td>{faq.datePublished ? <TextFormat type="date" value={faq.datePublished} format={APP_TIMESTAMP_FORMAT} /> : null}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${faq.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Chi tiết</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${faq.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${faq.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Không tìm thấy</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={faqsList && faqsList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
          </Row>
          <Row className="justify-content-center">
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
  faqsList: news.entities,
  loading: news.loading,
  totalItems: news.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Faq);
