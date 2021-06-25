import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './challenge.reducer';
import { IChallenge } from 'app/shared/model/challenge.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { height } from '@fortawesome/free-solid-svg-icons/faCogs';
import moment from 'moment';

export interface IChallengeProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Challenge = (props: IChallengeProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const [criteriaState, setCriteriaState] = useState({
    'title.equals': null,
    'userId.equals': null,
    'status.equals': null,
    'challengeType.equals': null,
    dateStart: null,
    dateStartCompare: null,
    'dateStart.greaterThanOrEqual': null,
    'dateStart.lessThanOrEqual': null,
    'dateFinish.greaterThanOrEqual': null,
    'dateFinish.lessThanOrEqual': null,
    'dateRegisDeadline.greaterThanOrEqual': null,
    'dateRegisDeadline.lessThanOrEqual': null,
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

  const { challengeList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="challenge-heading" data-cy="ChallengeHeading">
        Quản lý thử thách
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh
          </Button>
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
                label={'Title'}
                placeholder={'Enter title'}
                value={criteriaState['title.equals']}
                onChange={event => (criteriaState['title.equals'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="status"
              label="Status"
              value={criteriaState['status.equals']}
              onChange={event => (criteriaState['status.equals'] = event.target.value)}
            >
              <option value="" key="0">
                --Choose a status--
              </option>
              <option value="0">Không hoạt động</option>
              <option value="0">Đang hoạt động</option>
              {/* {users
                ? users.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.login}
                    </option>
                  ))
                : null} */}
            </AvField>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="challengeType"
              label="ChallengeType"
              value={criteriaState['challengeType.equals']}
              onChange={event => (criteriaState['challengeType.equals'] = event.target.value)}
            >
              <option value="" key="0">
                --Choose a type--
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
              <Col xs="12" sm="4">
                <AvField
                  type="date"
                  name="dateStart"
                  label={'DateStart'}
                  value={criteriaState['dateStart']}
                  onChange={event => (criteriaState['dateStart'] = event.target.value + 'T00:00:00Z')}
                ></AvField>
              </Col>
              <Col xs="12" sm="4">
                <AvField
                  type="select"
                  name="compareType"
                  label="CompareType"
                  value={criteriaState['dateStartCompare']}
                  onChange={event => {
                    criteriaState['dateStartCompare'] = event.target.value;
                    if (criteriaState['dateStartCompare'] === '0') {
                      criteriaState['dateStart.lessThanOrEqual'] = criteriaState['dateStart'];
                      criteriaState['dateStart.greaterThanOrEqual'] = null;
                      criteriaState['dateStart'] = null;
                      criteriaState['dateStartCompare'] = null;
                    } else if (criteriaState['dateStartCompare'] === '1') {
                      criteriaState['dateStart.greaterThanOrEqual'] = criteriaState['dateStart'];
                      criteriaState['dateStart.lessThanOrEqual'] = null;
                      criteriaState['dateStart'] = null;
                      criteriaState['dateStartCompare'] = null;
                    }
                  }}
                >
                  <option value="" key="0">
                    Compare type
                  </option>
                  <option value="1">gte</option>
                  <option value="0">lte</option>
                </AvField>
              </Col>
            </Row>
          </Col>

          <Col xs="12" sm="4">
            <AvGroup>
              <AvField
                type="text"
                name="title"
                label={'Title'}
                placeholder={'Enter title'}
                value={criteriaState['title.equals']}
                onChange={event => (criteriaState['title.equals'] = event.target.value)}
              />
            </AvGroup>
          </Col>
        </Row>
        <Button color="primary" type="submit">
          <FontAwesomeIcon icon="search" />
          &nbsp; Search
        </Button>
      </AvForm>

      <hr style={{ backgroundColor: 'DodgerBlue', height: '2px' }} />
      <div className="table-responsive">
        {challengeList && challengeList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('title')}>
                  Tên thử thách <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('sport.name')}>
                  Bộ môn <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('challenge_type')}>
                  Loại thử thách <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateStart')}>
                  Date Start <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('date_finish')}>
                  Date Finish <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('num_of_participant')}>
                  Num Of Participant <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand">
                  <div></div>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {challengeList.map((challenge, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${challenge.id}`} color="link" size="sm">
                      {challenge.id}
                    </Button>
                  </td>
                  <td>{challenge.title}</td>
                  <td>{challenge.sport.name}</td>
                  <td>
                    {challenge.challenge_type === 0 && <div>Đang diễn ra</div>}
                    {challenge.challenge_type === 1 && <div>Sắp diễn ra</div>}
                  </td>
                  <td>{new Date(challenge.date_start).toLocaleString()}</td>
                  <td>{new Date(challenge.date_finish).toLocaleString()}</td>
                  <td>{challenge.num_of_participant}</td>
                  <td>
                    <Button tag={Link} to={`${match.url}/${challenge.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                      <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                    </Button>
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${challenge.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${challenge.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${challenge.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Challenges found</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={challengeList && challengeList.length > 0 ? '' : 'd-none'}>
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
