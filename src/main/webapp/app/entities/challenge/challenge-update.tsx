import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './challenge.reducer';
import { IChallenge } from 'app/shared/model/challenge.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IChallengeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeUpdate = (props: IChallengeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { challengeEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/challenge' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...challengeEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
            Create or edit a Challenge
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : challengeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="challenge-id">ID</Label>
                  <AvInput id="challenge-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="challenge-title">
                  Title
                </Label>
                <AvField
                  id="challenge-title"
                  data-cy="title"
                  type="text"
                  name="title"
                  validate={{
                    maxLength: { value: 200, errorMessage: 'This field cannot be longer than 200 characters.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="challenge-content">
                  Content
                </Label>
                <AvField id="challenge-content" data-cy="content" type="text" name="content" />
              </AvGroup>
              <AvGroup>
                <Label id="img_urlLabel" for="challenge-img_url">
                  Img Url
                </Label>
                <AvField
                  id="challenge-img_url"
                  data-cy="img_url"
                  type="text"
                  name="img_url"
                  validate={{
                    maxLength: { value: 200, errorMessage: 'This field cannot be longer than 200 characters.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="date_regisLabel" for="challenge-date_regis">
                  Date Regis
                </Label>
                <AvField id="challenge-date_regis" data-cy="date_regis" type="text" name="date_regis" />
              </AvGroup>
              <AvGroup>
                <Label id="date_startLabel" for="challenge-date_start">
                  Date Start
                </Label>
                <AvField id="challenge-date_start" data-cy="date_start" type="text" name="date_start" />
              </AvGroup>
              <AvGroup>
                <Label id="date_finishLabel" for="challenge-date_finish">
                  Date Finish
                </Label>
                <AvField id="challenge-date_finish" data-cy="date_finish" type="text" name="date_finish" />
              </AvGroup>
              <AvGroup>
                <Label id="num_of_participantLabel" for="challenge-num_of_participant">
                  Num Of Participant
                </Label>
                <AvField
                  id="challenge-num_of_participant"
                  data-cy="num_of_participant"
                  type="string"
                  className="form-control"
                  name="num_of_participant"
                />
              </AvGroup>
              <AvGroup>
                <Label id="num_of_regisLabel" for="challenge-num_of_regis">
                  Num Of Regis
                </Label>
                <AvField id="challenge-num_of_regis" data-cy="num_of_regis" type="string" className="form-control" name="num_of_regis" />
              </AvGroup>
              <AvGroup>
                <Label id="user_id_createdLabel" for="challenge-user_id_created">
                  User Id Created
                </Label>
                <AvField
                  id="challenge-user_id_created"
                  data-cy="user_id_created"
                  type="string"
                  className="form-control"
                  name="user_id_created"
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/challenge" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  challengeEntity: storeState.challenge.entity,
  loading: storeState.challenge.loading,
  updating: storeState.challenge.updating,
  updateSuccess: storeState.challenge.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUpdate);
