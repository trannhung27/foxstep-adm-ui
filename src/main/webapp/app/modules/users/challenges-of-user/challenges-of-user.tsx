import React, { useEffect, useState } from 'react';
import { RouteComponentProps, NavLink as Link } from 'react-router-dom';
import { getChallengesOfUser } from 'app/modules/users/users.reducer';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { PageHeader } from 'antd';
import ChallengesOfUserFilterForm from 'app/modules/users/challenges-of-user/cou-filter';
import { Button, Row, Table } from 'reactstrap';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { SortIcon } from 'app/shared/util/sort-icon-util';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { PageSizePicker } from 'app/shared/util/page-size-picker';
import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';

export interface ICOUProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengesOfUser = (props: ICOUProps) => {
  const overrideNewsCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      userId: props.match.params.id,
      title: params.get('title'),
      chalType: params.get('chalType'),
      sportId: params.get('sportId'),
      fromDate: params.get('fromDate'),
      toDate: params.get('toDate'),
      chalUserStatus: params.get('chalUserStatus'),
      chalStatus: params.get('chalStatus'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideNewsCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      ...criteriaState,
      title: criteria.title,
      chalType: criteria.chalType,
      sportId: criteria.sportId,
      fromDate: criteria.fromDate ? convertDateTimeToServer(criteria.fromDate).toISOString() : null,
      toDate: criteria.toDate ? convertDateTimeToServer(criteria.toDate).toISOString() : null,
      chalUserStatus: criteria.chalUserStatus,
      chalStatus: criteria.chalStatus,
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'dateStart', 'desc'), props.location.search)
  );

  const getAllEntities = () => {
    props.getChallengesOfUser(
      criteriaState,
      paginationState.activePage - 1,
      paginationState.itemsPerPage,
      `${paginationState.sort},${paginationState.order}`
    );
  };

  const sortEntities = () => {
    getAllEntities();
    let endURL = `?size=${paginationState.itemsPerPage}&page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['title']) endURL += '&title=' + criteriaState['title'];
    if (criteriaState['chalType']) endURL += '&chalType=' + criteriaState['chalType'];
    if (criteriaState['sportId']) endURL += '&sportId=' + criteriaState['sportId'];
    if (criteriaState['fromDate']) endURL += '&fromDate=' + criteriaState['fromDate'];
    if (criteriaState['toDate']) endURL += '&toDate=' + criteriaState['toDate'];
    if (criteriaState['chalUserStatus']) endURL += '&chalUserStatus=' + criteriaState['chalUserStatus'];
    if (criteriaState['chalStatus']) endURL += '&chalStatus=' + criteriaState['chalStatus'];

    if (props.location.search !== endURL) {
      props.history.replace(`${props.location.pathname}${endURL}`);
    }
  };

  const resetFilter = () => {
    setCriteriaState({
      ...criteriaState,
      title: null,
      chalType: null,
      sportId: null,
      fromDate: null,
      toDate: null,
      chalUserStatus: null,
      chalStatus: null,
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

  const { couList, match, loading, totalItems } = props;
  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Th??ng tin kh??ch h??ng - Danh s??ch th??? th??ch"
        extra={
          <>
            <Button onClick={() => props.history.goBack()} color="info">
              <span className="d-none d-md-inline">Quay l???i</span>
            </Button>
          </>
        }
      />
      <hr />
      <ChallengesOfUserFilterForm couCriteria={criteriaState} handleFilter={handleFilter} clear={resetFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {couList && couList.length > 0 ? (
          <div>
            <PageSizePicker pageSize={paginationState.itemsPerPage} handleSelect={handlePageSize} />
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand" onClick={sort('chalTitle')}>
                    T??n th??? th??ch <SortIcon sortBy="chalTitle" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('sportName')}>
                    B??? m??n <SortIcon sortBy="sportName" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('chalType')}>
                    Lo???i th??? th??ch <SortIcon sortBy="chalType" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('chalStatus')}>
                    Tr???ng th??i <SortIcon sortBy="chalStatus" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('chalUserStatus')}>
                    Tr???ng th??i tham gia
                    <SortIcon sortBy="chalUserStatus" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('dateStart')}>
                    Th???i gian b???t ?????u
                    <SortIcon sortBy="dateStart" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('dateFinish')}>
                    Th???i gian k???t th??c
                    <SortIcon sortBy="dateFinish" paginationState={paginationState} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {couList.map((challenge, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                        ? 1 + i
                        : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                    </td>
                    <td>
                      <Link to={'/challenges/' + challenge.chalId}>{challenge.chalTitle}</Link>
                    </td>
                    <td>{challenge.sportName}</td>
                    <td>{challenge.chalType}</td>
                    <td>{challenge.chalStatus}</td>
                    <td>{challenge.chalUserStatus}</td>
                    <td>
                      {challenge.dateStart ? <TextFormat value={challenge.dateStart} type="date" format={APP_TIMESTAMP_FORMAT} /> : null}
                    </td>
                    <td>
                      {challenge.dateFinish ? <TextFormat value={challenge.dateFinish} type="date" format={APP_TIMESTAMP_FORMAT} /> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          !loading && <div className="alert alert-warning">Kh??ng c?? d??? li???u!</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={couList && couList.length > 0 ? 'px-4' : 'd-none'}>
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

const mapStateToProps = ({ users }: IRootState) => ({
  couList: users.challengesOfUser,
  loading: users.loading,
  totalItems: users.totalItems,
});

const mapDispatchToProps = {
  getChallengesOfUser,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengesOfUser);
