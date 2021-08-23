import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Row, Table } from 'reactstrap';
import { JhiPagination } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './users.reducer';
import { APP_USER_STATUS } from 'app/config/constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import UsersFilterForm from 'app/modules/users/users-filter';
import { PageHeader } from 'antd';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { SortIcon } from 'app/shared/util/sort-icon-util';
import { PageSizePicker } from 'app/shared/util/page-size-picker';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';

export interface IUsersProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Users = (props: IUsersProps) => {
  const overrideNewsCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'fullName.contains': params.get('fullName.contains'),
      'email.contains': params.get('email.contains'),
      'mobilePhone.contains': params.get('mobilePhone.contains'),
      'nationalIdNumber.contains': params.get('nationalIdNumber.contains'),
      'status.equals': params.get('status.equals'),
      'bib.equals': params.get('bib.equals'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideNewsCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'fullName.contains': criteria.fullName.contains,
      'email.contains': criteria.email.contains,
      'mobilePhone.contains': criteria.mobilePhone.contains,
      'nationalIdNumber.contains': criteria.nationalIdNumber.contains,
      'status.equals': criteria.status.equals,
      'bib.equals': criteria.bib.equals,
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'fullName', 'asc'), props.location.search)
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

    if (criteriaState['fullName.contains']) endURL += '&fullName.contains=' + criteriaState['fullName.contains'];
    if (criteriaState['email.contains']) endURL += '&email.contains=' + criteriaState['email.contains'];
    if (criteriaState['mobilePhone.contains']) endURL += '&mobilePhone.contains=' + criteriaState['mobilePhone.contains'];
    if (criteriaState['nationalIdNumber.contains']) endURL += '&nationalIdNumber.contains=' + criteriaState['nationalIdNumber.contains'];
    if (criteriaState['status.equals']) endURL += '&status.equals=' + criteriaState['status.equals'];
    if (criteriaState['bib.equals']) endURL += '&bib.equals=' + criteriaState['bib.equals'];

    if (props.location.search !== endURL) {
      props.history.replace(`${props.location.pathname}${endURL}`);
    }
  };

  const resetFilter = () => {
    setCriteriaState({
      'fullName.contains': null,
      'email.contains': null,
      'mobilePhone.contains': null,
      'nationalIdNumber.contains': null,
      'status.equals': null,
      'bib.equals': null,
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

  const { usersList, match, loading, totalItems } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Quản lý khách hàng" />
      <hr />
      <UsersFilterForm usersCriteria={criteriaState} handleFilter={handleFilter} clear={resetFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {usersList && usersList.length > 0 ? (
          <div>
            <PageSizePicker pageSize={paginationState.itemsPerPage} handleSelect={handlePageSize} />
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand" onClick={sort('fullName')}>
                    Họ tên <SortIcon sortBy="fullName" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('bib')}>
                    BIB <SortIcon sortBy="bib" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('email')}>
                    Email <SortIcon sortBy="email" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('nationalIdNumber')}>
                    Số Giấy tờ <SortIcon sortBy="nationalIdNumber" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('mobilePhone')}>
                    Số ĐT <SortIcon sortBy="mobilePhone" paginationState={paginationState} />
                  </th>
                  <th className="hand" onClick={sort('status')}>
                    Trạng thái <SortIcon sortBy="status" paginationState={paginationState} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((users, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                        ? 1 + i
                        : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                    </td>
                    <td>{users.fullName}</td>
                    <td>{users.bib}</td>
                    <td>{users.email}</td>
                    <td>{users.nationalIdNumber}</td>
                    <td>{users.mobilePhone}</td>
                    <td className="text-center">
                      {APP_USER_STATUS.map((status, j) =>
                        users.status === status.id ? (
                          <Badge key={j} color={status.id === 1 ? 'success' : 'danger'}>
                            {status.name}
                          </Badge>
                        ) : (
                          ''
                        )
                      )}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${users.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                          <FontAwesomeIcon icon="eye" /> <span className="d-sm-none d-md-none d-lg-inline">Xem</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          !loading && <div className="alert alert-warning">Không có dữ liệu!</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={usersList && usersList.length > 0 ? 'px-4' : 'd-none'}>
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
  usersList: users.entities,
  loading: users.loading,
  totalItems: users.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Users);
