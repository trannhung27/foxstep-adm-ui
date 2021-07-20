import React, { useEffect, useState } from 'react';
import { RouteComponentProps, NavLink as Link } from 'react-router-dom';
import { getChallengesOfUser } from 'app/modules/users/users.reducer';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { PageHeader } from 'antd';
import ChallengesOfUserFilterForm from 'app/modules/users/challenges-of-user/cou-filter';
import { Button, Row, Table } from 'reactstrap';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { SortIcon } from 'app/shared/util/sort-icon-util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { APP_LOCAL_DATE_FORMAT, APP_TIMESTAMP_FORMAT } from 'app/config/constants';

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
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, ITEMS_PER_PAGE, 'dateStart', 'desc'), props.location.search)
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
    let endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['title']) endURL += '&title=' + criteriaState['title'];
    if (criteriaState['chalType']) endURL += '&chalType=' + criteriaState['chalType'];
    if (criteriaState['sportId']) endURL += '&sportId=' + criteriaState['sportId'];
    if (criteriaState['fromDate']) endURL += '&fromDate=' + criteriaState['fromDate'];
    if (criteriaState['toDate']) endURL += '&toDate=' + criteriaState['toDate'];
    if (criteriaState['chalUserStatus']) endURL += '&chalUserStatus=' + criteriaState['chalUserStatus'];
    if (criteriaState['chalStatus']) endURL += '&chalStatus=' + criteriaState['chalStatus'];

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

  const { couList, match, loading, totalItems } = props;
  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Thông tin khách hàng - Danh sách thử thách"
        extra={
          <>
            <Button tag={Link} to={'/users/' + props.match.params.id} color="info">
              <span className="d-none d-md-inline">Quay lại</span>
            </Button>
          </>
        }
      />
      <hr />
      <ChallengesOfUserFilterForm couCriteria={criteriaState} handleFilter={handleFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {couList && couList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand">STT</th>
                <th className="hand" onClick={sort('chalTitle')}>
                  Tên thử thách <SortIcon sortBy="chalTitle" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('sportName')}>
                  Bộ môn <SortIcon sortBy="sportName" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('chalType')}>
                  Loại thử thách <SortIcon sortBy="chalType" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('chalStatus')}>
                  Trạng thái <SortIcon sortBy="chalStatus" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('chalUserStatus')}>
                  Trạng thái tham gia
                  <SortIcon sortBy="chalUserStatus" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('dateStart')}>
                  Thời gian bắt đầu
                  <SortIcon sortBy="dateStart" paginationState={paginationState} />
                </th>
                <th className="hand" onClick={sort('dateFinish')}>
                  Thời gian kết thúc
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
        ) : (
          !loading && <div className="alert alert-warning">Không tìm thấy dữ liệu</div>
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
