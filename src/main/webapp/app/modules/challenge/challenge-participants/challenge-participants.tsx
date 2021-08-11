import React, { useEffect, useState } from 'react';
import { NavLink as Link, RouteComponentProps } from 'react-router-dom';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getSortStateCustom } from 'app/shared/util/pagination-utils-custom';
import { PageHeader } from 'antd';
import { Badge, Button, Col, Row, Table } from 'reactstrap';
import ParticipantsFilterForm from 'app/modules/challenge/challenge-participants/cp-filter';
import { PageSizePicker } from 'app/shared/util/page-size-picker';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/modules/challenge/challenge-participants/cp-reducer';
import { connect } from 'react-redux';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PaginationItemCount } from 'app/shared/util/pagination-item-count';
import { matchPath } from 'react-router';
import { getEntity } from 'app/modules/challenge/challenge.reducer';

export interface IChallengeParticipantsProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeParticipants = (props: IChallengeParticipantsProps) => {
  const currentMatch = matchPath<{ challengesId: string }>(props.location.pathname, {
    path: '/challenges/:challengesId/participants',
    exact: false,
    strict: false,
  });

  const overrideCriteriaWithQueryParams = () => {
    const params = new URLSearchParams(props.location.search);
    return {
      challengeId: currentMatch.params.challengesId,
      status: params.get('status'),
      name: params.get('name'),
      email: params.get('email'),
    };
  };
  const [criteriaState, setCriteriaState] = useState(overrideCriteriaWithQueryParams());

  const handleFilter = criteria => {
    setCriteriaState({
      ...criteriaState,
      status: criteria.status,
      name: criteria.name,
      email: criteria.email,
    });
  };

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortStateCustom(props.location, 'updatedAt', 'desc'), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(criteriaState, paginationState.activePage - 1, paginationState.itemsPerPage, null);
  };

  const sortEntities = () => {
    getAllEntities();
    let endURL = `?size=${paginationState.itemsPerPage}&page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;

    if (criteriaState['status']) endURL += '&status=' + criteriaState['status'];
    if (criteriaState['name']) endURL += '&name=' + criteriaState['name'];
    if (criteriaState['email']) endURL += '&email=' + criteriaState['email'];

    if (props.location.search !== endURL) {
      props.history.replace(`${props.location.pathname}${endURL}`);
    }
  };

  const resetFilter = () => {
    setCriteriaState({
      ...criteriaState,
      status: null,
      name: null,
      email: null,
    });
  };

  useEffect(() => {
    props.getEntity(currentMatch.params.challengesId);
    sortEntities();
  }, []);

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
    });
  };

  const { participants, challenge, match, loading, totalItems } = props;

  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        className="site-page-header"
        title="Danh sách thành viên (Thử thách)"
        extra={
          <>
            <Button onClick={() => props.history.goBack()} color="info">
              <span className="d-none d-md-inline">Quay lại</span>
            </Button>
          </>
        }
      />
      <hr />
      <ParticipantsFilterForm participantsCriteria={criteriaState} handleFilter={handleFilter} clear={resetFilter} updating={loading} />

      <div className="table-responsive pt-2">
        {participants && participants.length > 0 ? (
          <div>
            <PageSizePicker pageSize={paginationState.itemsPerPage} handleSelect={handlePageSize}>
              {[1, 12].includes(challenge.status) && new Date(challenge.dateRegisDeadline) > new Date() && (
                <Col sm="3">
                  <Button id="jh-create-entity" tag={Link} to={`${match.url}/new`} color="primary" block>
                    <FontAwesomeIcon icon="plus" />
                    <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Thêm thành viên</span>
                  </Button>
                </Col>
              )}
            </PageSizePicker>
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th className="hand">STT</th>
                  <th className="hand">Tên thành viên</th>
                  <th className="hand">Số km</th>
                  <th className="hand">Nhóm</th>
                  <th className="hand">VO2 Max</th>
                  <th className="hand">Email</th>
                  <th className="hand">Trạng thái tham gia</th>
                  <th className="hand">Thời gian tham gia</th>
                  <th className="hand"></th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {(paginationState.activePage - 1) * paginationState.itemsPerPage === 0
                        ? 1 + i
                        : (paginationState.activePage - 1) * paginationState.itemsPerPage + 1 + i}
                    </td>
                    <td>{participant.name}</td>
                    <td>{participant.distanceTarget / 1000}</td>
                    <td>{challenge.teams && challenge.teams.map(t => (t.id === participant.teamId ? t.name : ''))}</td>
                    <td>{participant.vo2Max}</td>
                    <td>{participant.email}</td>
                    <td>
                      {participant.status === 1 ? <Badge color="success">Đã tham gia</Badge> : <Badge color="info">Yêu cầu tham gia</Badge>}
                    </td>
                    <td>
                      {participant.dateUpdated ? (
                        <TextFormat value={participant.dateUpdated * 1000} type="date" format={APP_TIMESTAMP_FORMAT} />
                      ) : null}
                    </td>
                    <td>
                      {[1, 12].includes(challenge.status) &&
                        new Date(challenge.dateRegisDeadline) > new Date() &&
                        (participant.status === 1 ? (
                          <Button
                            tag={Link}
                            to={`/challenges/${currentMatch.params.challengesId}/participants/${participant.challengeUserId}/remove`}
                            replace
                            color="danger"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        ) : (
                          <Row className="p-0 m-0">
                            <Col xs="6" className="py-0 pl-0 pr-1">
                              <Button
                                tag={Link}
                                to={`/challenges/${currentMatch.params.challengesId}/participants/${participant.challengeUserId}/reject`}
                                replace
                                color="secondary"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </Button>
                            </Col>
                            <Col xs="6" className="py-0 pl-1 pr-0">
                              <Button
                                tag={Link}
                                to={`/challenges/${currentMatch.params.challengesId}/participants/${participant.challengeUserId}/approve`}
                                replace
                                color="danger"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          !loading && (
            <>
              <div className="alert alert-warning">Không có dữ liệu!</div>
              {[1, 12].includes(challenge.status) && new Date(challenge.dateRegisDeadline) > new Date() && (
                <Button id="jh-create-entity" tag={Link} to={`${match.url}/new`} color="primary" block>
                  <FontAwesomeIcon icon="plus" />
                  <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Thêm thành viên</span>
                </Button>
              )}
            </>
          )
        )}
      </div>
      {props.totalItems ? (
        <div className={participants && participants.length > 0 ? 'px-4' : 'd-none'}>
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

const mapStateToProps = ({ challengeParticipant, challenge }: IRootState) => ({
  participants: challengeParticipant.entities,
  loading: challengeParticipant.loading,
  totalItems: challengeParticipant.totalItems,
  challenge: challenge.entity,
});

const mapDispatchToProps = {
  getEntities,
  getEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeParticipants);
