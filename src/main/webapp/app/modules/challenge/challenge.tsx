import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table, Badge } from 'reactstrap';
import { JhiPagination, JhiItemCount, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './challenge.reducer';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { APP_TIMESTAMP_FORMAT, ChallengeStatuses } from 'app/config/constants';

import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { PageSizePicker } from 'app/shared/util/page-size-picker';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import ChallengeFilterForm from 'app/modules/challenge/challenge-filter';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';

export interface IChallengeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Challenge = (props: IChallengeProps) => {
  const overrideChallengeCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'title.contains': params.get('title.contains'),
      'status.equals': params.get('status.equals'),
      'dateStart.greaterThanOrEqual': params.get('dateStart.greaterThanOrEqual'),
      'dateStart.lessThanOrEqual': params.get('dateStart.lessThanOrEqual'),
      'challengeType.equals': params.get('challengeType.equals'),
      'sport.name.equals': params.get('sport.name.equals'),
    };
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'id', 'desc'), props.location.search)
  );

  const [criteriaState, setCriteriaState] = useState(overrideChallengeCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'title.contains': criteria.title.contains,
      'status.equals': criteria.status.equals,
      'challengeType.equals': criteria.challengeType.equals,
      'sport.name.equals': criteria.sport.name.equals,
      'dateStart.greaterThanOrEqual': criteria.dateStart.greaterThanOrEqual
        ? convertDateTimeToServer(criteria.dateStart.greaterThanOrEqual).toISOString()
        : null,
      'dateStart.lessThanOrEqual': criteria.dateStart.lessThanOrEqual
        ? convertDateTimeToServer(criteria.dateStart.lessThanOrEqual).toISOString()
        : null,
    });
  };

  const resetFilter = () => {
    setCriteriaState({
      'title.contains': null,
      'status.equals': null,
      'dateStart.greaterThanOrEqual': null,
      'dateStart.lessThanOrEqual': null,
      'challengeType.equals': null,
      'sport.name.equals': null,
    });
  };

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
    if (criteriaState['challengeType.equals']) endURL += '&challengeType.equals=' + criteriaState['challengeType.equals'];
    if (criteriaState['sport.name.equals']) endURL += '&sport.name.equals' + criteriaState['sport.name.equals'];
    if (criteriaState['dateStart.greaterThanOrEqual'])
      endURL += '&dateStart.greaterThanOrEqual=' + criteriaState['dateStart.greaterThanOrEqual'];
    if (criteriaState['dateStart.lessThanOrEqual']) endURL += '&dateStart.lessThanOrEqual=' + criteriaState['dateStart.lessThanOrEqual'];

    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [criteriaState, paginationState.itemsPerPage, paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    const size = params.get('size');
    if (page && sort) {
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
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  const { challengeList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="challenge-heading" data-cy="ChallengeHeading">
        Quản lý thử thách
        {/*<div className="d-flex justify-content-end">*/}
        {/*  <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">*/}
        {/*    <FontAwesomeIcon icon="plus" />*/}
        {/*    &nbsp; Tạo thử thách*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </h2>

      <ChallengeFilterForm challengeCriteria={criteriaState} handleFilter={handleFilter} updating={loading} clear={resetFilter} />

      <hr style={{ backgroundColor: 'DodgerBlue', height: '2px' }} />
      <div className="table-responsive">
        {challengeList && challengeList.length > 0 ? (
          <div>
            <PageSizePicker pageSize={paginationState.itemsPerPage} handleSelect={handlePageSize}>
              <Col sm="2">
                <Button id="jh-create-entity" tag={Link} to={`${match.url}/new`} color="primary" block>
                  <FontAwesomeIcon icon="plus" />
                  <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Tạo mới</span>
                </Button>
              </Col>
            </PageSizePicker>
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand" onClick={sort('title')}>
                    Tên thử thách <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('sport.name')}>
                    Bộ môn <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('challengeType')}>
                    Loại thử thách <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">Người tạo</th>
                  <th className="hand">Trạng thái</th>
                  <th className="hand" onClick={sort('dateStart')}>
                    Ngày bắt đầu <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('dateFinish')}>
                    Ngày kết thúc <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={sort('dateCreated')}>
                    Ngày tạo <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {challengeList.map((challenge, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                        ? 1 + i
                        : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                    </td>
                    <td>
                      <Button tag={Link} to={`${match.url}/${challenge.id}`} color="link" size="sm">
                        {challenge.title}
                      </Button>
                    </td>
                    <td>{challenge.sport.name === 'Run' ? 'Chạy bộ' : ''}</td>
                    <td>
                      {challenge.challengeType === 0 && <div>Ban tổ chức</div>}
                      {challenge.challengeType === 1 && <div>Cá nhân</div>}
                    </td>
                    <td>{challenge.userCreated ? challenge.userCreated.name : ''}</td>
                    <td>
                      {challenge.status === 0 ? (
                        <Badge color="dark">{ChallengeStatuses[0].name}</Badge>
                      ) : challenge.status === 1 ? (
                        <Badge color="primary">{ChallengeStatuses[1].name}</Badge>
                      ) : challenge.status === 2 ? (
                        <Badge color="danger">{ChallengeStatuses[2].name}</Badge>
                      ) : challenge.status === 12 ? (
                        <Badge color="success">{ChallengeStatuses[3].name}</Badge>
                      ) : challenge.status === -1 ? (
                        <Badge color="secondary">{ChallengeStatuses[4].name}</Badge>
                      ) : challenge.status === -2 ? (
                        <Badge color="info">{ChallengeStatuses[5].name}</Badge>
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td>
                      {challenge.dateStart ? <TextFormat type="date" value={challenge.dateStart} format={APP_TIMESTAMP_FORMAT} /> : null}
                    </td>
                    <td>
                      {challenge.dateFinish ? <TextFormat type="date" value={challenge.dateFinish} format={APP_TIMESTAMP_FORMAT} /> : null}
                    </td>
                    <td>
                      {challenge.dateCreated ? (
                        <TextFormat type="date" value={challenge.dateCreated} format={APP_TIMESTAMP_FORMAT} />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          !loading && <div className="alert alert-warning">No Challenges found</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={challengeList && challengeList.length > 0 ? 'px-4' : 'd-none'}>
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

const mapStateToProps = ({ challenge }: IRootState) => ({
  challengeList: challenge.entities,
  loading: challenge.loading,
  totalItems: challenge.totalItems,
});

const mapDispatchToProps = {
  getEntities,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
