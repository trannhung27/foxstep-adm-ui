import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row, Table } from 'reactstrap';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { getSortState, JhiItemCount, JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './users.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT_Z, USER_STATUS } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import DateTime from 'react-datetime';
import moment from 'moment';

export interface IUsersProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Users = (props: IUsersProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const [criteriaState, setCriteriaState] = useState({
    'fullName.contains': null,
    'email.contains': null,
    'mobilePhone.contains': null,
    'nationalIdNumber.contains': null,
    'status.equals': null,
    'dateCreated.greaterOrEqualThan': null,
    'dateCreated.lessOrEqualThan': null,
  });

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
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

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

      <AvForm onSubmit={getAllEntities}>
        <Row>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <AvField
                type="text"
                name="fullName"
                label={'Họ tên'}
                placeholder={'Nhập họ tên'}
                value={criteriaState['fullName.contains']}
                onChange={event => (criteriaState['fullName.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <AvField
                type="text"
                name="email"
                label={'Email'}
                placeholder={'Nhập email'}
                value={criteriaState['email.contains']}
                onChange={event => (criteriaState['email.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <AvField
                type="text"
                name="mobilePhone"
                label={'Số điện thoại'}
                placeholder={'Nhập số điện thoại'}
                value={criteriaState['mobilePhone.contains']}
                onChange={event => (criteriaState['mobilePhone.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <AvField
                type="text"
                name="nationalIdNumber"
                label={'Số GTTT'}
                placeholder={'Nhập số GTTT'}
                value={criteriaState['nationalIdNumber.contains']}
                onChange={event => (criteriaState['nationalIdNumber.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <AvField
                type="select"
                name="status"
                label="Trạng thái"
                value={criteriaState['status.equals']}
                onChange={event => (criteriaState['status.equals'] = event.target.value)}
              >
                <option value="" key="0">
                  --Chọn trạng thái--
                </option>
                <option value={USER_STATUS.ACTIVATED} key="1">
                  Đã kích hoạt
                </option>
                <option value={USER_STATUS.NOT_ACTIVATE} key="2">
                  Chưa kích hoạt
                </option>
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <Label>Ngày tạo từ</Label>
              <DateTime
                value={criteriaState['dateCreated.greaterOrEqualThan']}
                onChange={date => (criteriaState['dateCreated.greaterOrEqualThan'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                inputProps={{ placeholder: 'Chọn ngày tạo tài khoản' }}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm:ss"
                closeOnSelect={true}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <AvGroup>
              <Label>Ngày tạo đến</Label>
              <DateTime
                value={criteriaState['dateCreated.lessOrEqualThan']}
                onChange={date => (criteriaState['dateCreated.lessOrEqualThan'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                inputProps={{ placeholder: 'Chọn ngày tạo tài khoản' }}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm:ss"
                closeOnSelect={true}
              />
            </AvGroup>
          </Col>
        </Row>
        <Button color="primary" type="submit">
          <FontAwesomeIcon icon="search" />
          &nbsp; Tìm kiếm
        </Button>
      </AvForm>

      <div className="d-flex justify-content-end mb-1">
        <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} /> Làm mới danh sách
        </Button>
      </div>

      <div className="table-responsive">
        {usersList && usersList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  Email <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fullName')}>
                  Họ tên <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nickName')}>
                  Nickname <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('nationalIdNumber')}>
                  Số GTTT <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('mobilePhone')}>
                  Số ĐT <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('gender')}>
                  Giới tính <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('birthday')}>
                  Ngày sinh <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('shirtSize')}>
                  Cỡ áo <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('height')}>
                  Chiều cao <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('weight')}>
                  Cân nặng <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('strAddress')}>
                  Địa chỉ <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Trạng thái <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateCreated')}>
                  Ngày tạo <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateUpdated')}>
                  Ngày cập nhật <FontAwesomeIcon icon="sort" />
                </th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((users, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${users.id}`} color="link" size="sm" style={{ textDecoration: 'none' }}>
                      {users.id}
                    </Button>
                  </td>
                  <td>{users.email}</td>
                  <td>{users.fullName}</td>
                  <td>{users.nickName}</td>
                  <td>{users.nationalIdNumber}</td>
                  <td>{users.mobilePhone}</td>
                  <td>{users.gender}</td>
                  <td>{users.birthday ? <TextFormat type="date" value={users.birthday} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{users.shirtSize}</td>
                  <td>{users.height}</td>
                  <td>{users.weight}</td>
                  <td>{users.strAddress}</td>
                  <td>{users.status}</td>
                  <td>{users.dateCreated ? <TextFormat type="date" value={users.dateCreated} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{users.dateUpdated ? <TextFormat type="date" value={users.dateUpdated} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
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
