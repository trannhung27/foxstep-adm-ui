import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Col, Row, Table } from 'reactstrap';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './faq.reducer';
import { APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import FaqFilterForm from 'app/modules/faq/faq-filter';
import { PageHeader } from 'antd';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { SortIcon } from 'app/shared/util/sort-icon-util';
import { PageSizePicker } from 'app/shared/util/page-size-picker';

export interface IFaqsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Faq = (props: IFaqsProps) => {
  const overrideFaqsCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'title.contains': params.get('title.contains'),
      'status.equals': params.get('status.equals'),
      'newsCategoryId.equals': params.get('newsCategoryId.equals'),
      'datePublished.greaterThanOrEqual': params.get('datePublished.greaterThanOrEqual'),
      'datePublished.lessThanOrEqual': params.get('datePublished.lessThanOrEqual'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideFaqsCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'title.contains': criteria.title.contains,
      'status.equals': criteria.status.equals,
      'newsCategoryId.equals': criteria.newsCategoryId.equals,
      'datePublished.greaterThanOrEqual': criteria.datePublished.greaterThanOrEqual
        ? convertDateTimeToServer(criteria.datePublished.greaterThanOrEqual).toISOString()
        : null,
      'datePublished.lessThanOrEqual': criteria.datePublished.lessThanOrEqual
        ? convertDateTimeToServer(criteria.datePublished.lessThanOrEqual).toISOString()
        : null,
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'datePublished', 'desc'), props.location.search)
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
    let endURL = `?size=${paginationState.itemsPerPage}&page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['title.contains']) endURL += '&title.contains=' + criteriaState['title.contains'];
    if (criteriaState['status.equals']) endURL += '&status.equals=' + criteriaState['status.equals'];
    if (criteriaState['newsCategoryId.equals']) endURL += '&newsCategoryId.equals=' + criteriaState['newsCategoryId.equals'];
    if (criteriaState['datePublished.greaterThanOrEqual'])
      endURL += '&datePublished.greaterThanOrEqual=' + criteriaState['datePublished.greaterThanOrEqual'];
    if (criteriaState['datePublished.lessThanOrEqual'])
      endURL += '&datePublished.lessThanOrEqual=' + criteriaState['datePublished.lessThanOrEqual'];

    if (props.location.search !== endURL) {
      props.history.replace(`${props.location.pathname}${endURL}`);
    }
  };

  const resetFilter = () => {
    setCriteriaState({
      'title.contains': null,
      'status.equals': null,
      'newsCategoryId.equals': null,
      'datePublished.greaterThanOrEqual': null,
      'datePublished.lessThanOrEqual': null,
    });
  };

  useEffect(() => {
    sortEntities();
  }, [criteriaState, paginationState.itemsPerPage, paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    const size = params.get('size');
    if (page && sort && size) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        itemsPerPage: parseInt(size, 10),
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

  const handlePageSize = size => {
    setPaginationState({
      ...paginationState,
      itemsPerPage: size,
      activePage: Math.min(Math.ceil(props.totalItems / size), paginationState.activePage),
    });
  };

  const { faqsList, match, loading, totalItems } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Qu???n l?? C??u h???i th?????ng g???p/H?????ng d???n" />
      <hr />
      <FaqFilterForm faqCriteria={criteriaState} handleFilter={handleFilter} clear={resetFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {faqsList && faqsList.length > 0 ? (
          <div>
            <PageSizePicker pageSize={paginationState.itemsPerPage} handleSelect={handlePageSize}>
              <Col sm="2">
                <Button id="jh-create-entity" tag={Link} to={`${match.url}/new`} color="primary" block>
                  <FontAwesomeIcon icon="plus" />
                  <span className="d-sm-none d-md-none d-lg-inline">&nbsp; T???o m???i</span>
                </Button>
              </Col>
            </PageSizePicker>
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand" onClick={sort('title')}>
                    Ti??u ????? <SortIcon sortBy="title" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('user.firstName')}>
                    Ng?????i t???o <SortIcon sortBy="user.email" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('status')}>
                    Tr???ng th??i <SortIcon sortBy="status" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('datePublished')}>
                    Th???i gian ????ng b??i <SortIcon sortBy="datePublished" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('newsCategory.name')}>
                    Lo???i <SortIcon sortBy="newsCategory.name" paginationState={paginationState} />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {faqsList.map((faq, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                        ? 1 + i
                        : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                    </td>
                    <td>{faq.title}</td>
                    <td>{faq.newsCategory ? faq.user.firstName : ''}</td>
                    <td className="text-center">
                      {NEWS_STATUSES.map((status, j) =>
                        status.id === faq.status ? (
                          <Badge key={j} color={status.id === 1 ? 'success' : 'danger'}>
                            {status.name}
                          </Badge>
                        ) : (
                          ''
                        )
                      )}
                    </td>
                    <td>{faq.datePublished ? <TextFormat type="date" value={faq.datePublished} format={APP_TIMESTAMP_FORMAT} /> : null}</td>
                    <td>{faq.newsCategory ? <p>{faq.newsCategory.name}</p> : ''}</td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${faq.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                          <FontAwesomeIcon icon="eye" /> <span className="d-sm-none d-md-none d-lg-inline">Xem</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${faq.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-sm-none d-md-none d-lg-inline">S???a</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          !loading && (
            <>
              <div className="alert alert-warning">Kh??ng c?? d??? li???u!</div>
              <Button id="jh-create-entity" tag={Link} to={`${match.url}/new`} color="primary" block>
                <FontAwesomeIcon icon="plus" />
                <span className="d-sm-none d-md-none d-lg-inline">&nbsp; T???o m???i</span>
              </Button>
            </>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={faqsList && faqsList.length > 0 ? 'px-4' : 'd-none'}>
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

const mapStateToProps = ({ faqs }: IRootState) => ({
  faqsList: faqs.entities,
  loading: faqs.loading,
  totalItems: faqs.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Faq);
