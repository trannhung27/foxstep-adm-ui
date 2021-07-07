import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { getSortState, JhiItemCount, JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './users.reducer';
import { APP_USER_STATUS } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import UsersFilterForm from 'app/modules/users/users-filter';

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

    if (criteriaState['fullName.contains']) endURL += '&fullName.contains=' + criteriaState['fullName.contains'];
    if (criteriaState['email.contains']) endURL += '&email.contains=' + criteriaState['email.contains'];
    if (criteriaState['mobilePhone.contains']) endURL += '&mobilePhone.contains=' + criteriaState['mobilePhone.contains'];
    if (criteriaState['nationalIdNumber.contains']) endURL += '&nationalIdNumber.contains=' + criteriaState['nationalIdNumber.contains'];
    if (criteriaState['status.equals']) endURL += '&status.equals=' + criteriaState['status.equals'];
    if (criteriaState['bib.equals']) endURL += '&bib.equals=' + criteriaState['bib.equals'];

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

  const { usersList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="users-heading" data-cy="UsersHeading">
        Users
      </h2>
      <UsersFilterForm usersCriteria={criteriaState} handleFilter={handleFilter} updating={loading} />

      <div className="table-responsive">
        {usersList && usersList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand">STT</th>
                <th className="hand" onClick={sort('fullName')}>
                  Họ tên <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('id')}>
                  BIB <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  Email <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nationalIdNumber')}>
                  Số Giấy tờ <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('mobilePhone')}>
                  Số ĐT <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Trạng thái <FontAwesomeIcon icon="sort" />
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
                  <td>{APP_USER_STATUS.map(status => (users.status === status.id ? status.name : ''))}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${users.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Detail</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Users found</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={usersList && usersList.length > 0 ? '' : 'd-none'}>
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
