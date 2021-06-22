import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './challenge.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IChallengeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeDetail = (props: IChallengeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { challengeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="challengeDetailsHeading">Challenge</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{challengeEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{challengeEntity.title}</dd>
          <dt>
            <span id="content">Content</span>
          </dt>
          <dd>{challengeEntity.content}</dd>
          <dt>
            <span id="img_url">Img Url</span>
          </dt>
          <dd>{challengeEntity.img_url}</dd>
          <dt>
            <span id="date_regis">Date Regis</span>
          </dt>
          <dd>{challengeEntity.date_regis}</dd>
          <dt>
            <span id="date_start">Date Start</span>
          </dt>
          <dd>{challengeEntity.date_start}</dd>
          <dt>
            <span id="date_finish">Date Finish</span>
          </dt>
          <dd>{challengeEntity.date_finish}</dd>
          <dt>
            <span id="num_of_participant">Num Of Participant</span>
          </dt>
          <dd>{challengeEntity.num_of_participant}</dd>
          <dt>
            <span id="num_of_regis">Num Of Regis</span>
          </dt>
          <dd>{challengeEntity.num_of_regis}</dd>
          <dt>
            <span id="user_id_created">User Id Created</span>
          </dt>
          <dd>{challengeEntity.user_id_created}</dd>
        </dl>
        <Button tag={Link} to="/entity/challenge" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entity/challenge/${challengeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ challenge }: IRootState) => ({
  challengeEntity: challenge.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDetail);
