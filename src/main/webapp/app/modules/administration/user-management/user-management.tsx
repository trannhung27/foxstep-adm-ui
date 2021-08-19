import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Row, Table } from 'reactstrap';
import { getSortState, JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, USER_STATUS } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getUsersAsAdmin, updateUser } from './user-management.reducer';
import { IRootState } from 'app/shared/reducers';
import { SortIcon } from 'app/shared/util/sort-icon-util';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { PageHeader } from 'antd';
import UserManangementFilterForm from 'app/modules/administration/user-management/user-management-filter';

export interface IUserManagementProps extends StateProps, DispatchProps, RouteComponentProps<any> {}

export const UserManagement = (props: IUserManagementProps) => {
  const overrideCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      'email.contains': params.get('email.contains'),
      'firstName.contains': params.get('firstName.contains'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      'email.contains': criteria.email.contains,
      'firstName.contains': criteria.firstName.contains,
    });
  };

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const getUsersFromProps = () => {
    props.getUsersAsAdmin(criteriaState, pagination.activePage - 1, pagination.itemsPerPage, `${pagination.sort},${pagination.order}`);

    let endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (criteriaState['email.contains']) endURL += '&email.contains=' + criteriaState['email.contains'];
    if (criteriaState['firstName.contains']) endURL += '&firstName.contains=' + criteriaState['firstName.contains'];

    if (props.location.search !== endURL) {
      props.history.replace(`${props.location.pathname}${endURL}`);
    }
  };

  const resetFilter = () => {
    setCriteriaState({
      'email.contains': null,
      'firstName.contains': null,
    });
  };

  useEffect(() => {
    getUsersFromProps();
  }, [criteriaState, pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sortParam = params.get('sort');
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const toggleActive = (user, status) => () =>
    props.updateUser({
      ...user,
      status,
    });

  const { users, account, match, totalItems, loading } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Quản lý người dùng" />
      <hr />
      <UserManangementFilterForm
        userManagementCriteria={criteriaState}
        handleFilter={handleFilter}
        clear={resetFilter}
        updating={loading}
      />

      <div className="d-flex justify-content-end p-1">
        <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity">
          <FontAwesomeIcon icon="plus" /> Tạo mới
        </Link>
      </div>

      <Table responsive striped hover>
        <thead>
          <tr>
            <th className="hand">STT</th>
            <th className="hand" onClick={sort('email')}>
              Email <SortIcon sortBy="email" paginationState={pagination} />
            </th>
            <th className="hand" onClick={sort('firstName')}>
              Họ tên <SortIcon sortBy="firstName" paginationState={pagination} />
            </th>
            <th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
              Ngày sửa <SortIcon sortBy="lastModifiedDate" paginationState={pagination} />
            </th>
            <th className="hand" onClick={sort('lastModifiedBy')}>
              Người sửa <SortIcon sortBy="lastModifiedBy" paginationState={pagination} />
            </th>
            <th className="hand">Nhóm quyền</th>
            <th className="hand">Trạng thái</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr id={user.login} key={`user-${i}`}>
              <td>
                {(pagination.activePage - 1) * pagination.itemsPerPage === 0
                  ? 1 + i
                  : (pagination.activePage - 1) * pagination.itemsPerPage + 1 + i}
              </td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>
                {user.lastModifiedDate ? (
                  <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                ) : null}
              </td>
              <td>{user.lastModifiedBy}</td>
              <td>
                {user.authorities
                  ? user.authorities.map((authority, j) => (
                      <div key={`user-auth-${i}-${j}`}>
                        <Badge color="info">{authority}</Badge>
                      </div>
                    ))
                  : null}
              </td>
              <td>
                {user.status === USER_STATUS.ACTIVATED ? (
                  <Button color="success" size="sm" onClick={toggleActive(user, USER_STATUS.INACTIVE)} block>
                    Hoạt động
                  </Button>
                ) : (
                  <Button color="danger" size="sm" onClick={toggleActive(user, USER_STATUS.ACTIVATED)} block>
                    Không hoạt động
                  </Button>
                )}
              </td>
              <td className="text-right">
                <div className="btn-group flex-btn-group-container">
                  <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
                    <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Xem</span>
                  </Button>
                  <Button tag={Link} to={`${match.url}/${user.login}/edit`} color="primary" size="sm">
                    <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                  </Button>
                  <Button
                    tag={Link}
                    to={`${match.url}/${user.login}/delete`}
                    color="danger"
                    size="sm"
                    disabled={account.login === user.login}
                  >
                    <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {props.totalItems ? (
        <div className={users && users.length > 0 ? 'px-4' : 'd-none'}>
          <Row className="justify-content-between">
            <PaginationItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} />
            <JhiPagination
              activePage={pagination.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={pagination.itemsPerPage}
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

const mapStateToProps = (storeState: IRootState) => ({
  loading: storeState.userManagement.loading,
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account,
});

const mapDispatchToProps = { getUsersAsAdmin, updateUser };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
