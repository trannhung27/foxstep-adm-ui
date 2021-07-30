import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table, Label, Badge } from 'reactstrap';
import { Translate, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './challenge.reducer';
import { IChallenge } from 'app/shared/model/challenge.model';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { height } from '@fortawesome/free-solid-svg-icons/faCogs';
import moment from 'moment';
import DateTime from 'react-datetime';
import {
  APP_DATE_FORMAT,
  APP_LOCAL_DATE_FORMAT,
  APP_LOCAL_DATETIME_FORMAT_Z,
  APP_TIMESTAMP_FORMAT,
  ChallengeStatuses,
} from 'app/config/constants';
import dayjs from 'dayjs';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { PageSizePicker } from 'app/shared/util/page-size-picker';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';

export interface IChallengeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Challenge = (props: IChallengeProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'id', 'desc'), props.location.search)
  );

  const [criteriaState, setCriteriaState] = useState({
    'title.contains': null,
    'userId.equals': null,
    'status.equals': null,
    'challengeType.equals': null,
    'dateStart.greaterThanOrEqual': null,
    'dateStart.lessThanOrEqual': null,
    'dateFinish.greaterThanOrEqual': null,
    'dateFinish.lessThanOrEqual': null,
    'dateRegisDeadline.greaterThanOrEqual': null,
    'dateRegisDeadline.lessThanOrEqual': null,
    'sport.name.equals': null,
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
    let endURL = `?size=${paginationState.itemsPerPage}&page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['title.contains']) endURL += '&title.contains=' + criteriaState['title.contains'];
    if (criteriaState['status.equals']) endURL += '&status.equals=' + criteriaState['status.equals'];
    // if (criteriaState['datePublished.greaterThanOrEqual'])
    //   endURL += '&datePublished.greaterThanOrEqual=' + criteriaState['datePublished.greaterThanOrEqual'];
    // if (criteriaState['datePublished.lessThanOrEqual'])
    //   endURL += '&datePublished.lessThanOrEqual=' + criteriaState['datePublished.lessThanOrEqual'];

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
        <div className="d-flex justify-content-end">
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Tạo thử thách
          </Link>
        </div>
      </h2>

      <AvForm onSubmit={getAllEntities}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <AvField
                type="text"
                name="title"
                label="Tên thử thách"
                placeholder="Điền tên thử thách"
                value={criteriaState['title.contains']}
                onChange={event => (criteriaState['title.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="status"
              label="Trạng thái"
              onChange={event => {
                criteriaState['status.equals'] = event.target.value;
              }}
            >
              <option value="" key="0">
                Tất cả
              </option>
              <option value={ChallengeStatuses[0].id}>{ChallengeStatuses[0].name}</option>
              <option value={ChallengeStatuses[1].id}>{ChallengeStatuses[1].name}</option>
              <option value={ChallengeStatuses[2].id}>{ChallengeStatuses[2].name}</option>
              <option value={ChallengeStatuses[3].id}>{ChallengeStatuses[3].name}</option>
              <option value={ChallengeStatuses[4].id}>{ChallengeStatuses[4].name}</option>
              <option value={ChallengeStatuses[5].id}>{ChallengeStatuses[5].name}</option>
            </AvField>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="challengeType"
              label="Loại thử thách"
              value={criteriaState['challengeType.equals']}
              onChange={event => (criteriaState['challengeType.equals'] = event.target.value)}
            >
              <option value="" key="0">
                Tất cả
              </option>
              <option value="1">Cá nhân</option>
              <option value="0">Ban tổ chức</option>
              {/* {categories
                ? categories.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.name}
                    </option>
                  ))
                : null} */}
            </AvField>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <AvField
                    type="select"
                    name="sportName"
                    label="Bộ môn"
                    value={criteriaState['sport.name.equals']}
                    onChange={event => (criteriaState['sport.name.equals'] = event.target.value)}
                  >
                    <option value="" key="0">
                      Tất cả
                    </option>
                    <option value="Run">Chạy bộ</option>
                    {/* {categories
                ? categories.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.name}
                    </option>
                  ))
                : null} */}
                  </AvField>
                </AvGroup>
              </Col>
            </Row>
          </Col>

          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <Label>Từ ngày</Label>
                  <DateTime
                    value={criteriaState['dateStart.greaterThanOrEqual']}
                    onChange={date => (criteriaState['dateStart.greaterThanOrEqual'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                    inputProps={{ placeholder: 'Chọn ngày bắt đầu' }}
                    dateFormat="DD/MM/YYYY"
                    timeFormat="HH:mm:ss"
                    closeOnSelect={true}
                  />
                </AvGroup>
              </Col>
            </Row>
          </Col>

          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <Label>Đến ngày</Label>
                  <DateTime
                    value={criteriaState['dateFinish.greaterThanOrEqual']}
                    onChange={date => (criteriaState['dateFinish.lessThanOrEqual'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                    inputProps={{ placeholder: 'Chọn ngày kết thúc' }}
                    dateFormat="DD/MM/YYYY"
                    timeFormat="HH:mm:ss"
                    closeOnSelect={true}
                  />
                </AvGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Button color="primary" id="filter-button" data-cy="entityFilterButton" type="submit" disabled={loading} block>
              <FontAwesomeIcon icon="search" />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Tìm kiếm</span>
            </Button>
          </Col>
          <Col sm={2}>
            <Button
              color="default"
              className="border-secondary"
              id="cancel-button"
              data-cy="cancelFilterButton"
              type="reset"
              value="Reset"
              block
            >
              <FontAwesomeIcon icon={faWindowClose} />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Hủy</span>
            </Button>
          </Col>
        </Row>
      </AvForm>

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
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
