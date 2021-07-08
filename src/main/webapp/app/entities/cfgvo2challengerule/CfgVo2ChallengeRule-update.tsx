import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity, updateEntity, createEntity, reset } from './CfgVo2ChallengeRule.reducer';

import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

export interface ICfgVo2ChallengeRuleUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const mapStateToProps = (storeState: IRootState) => ({
  cfgVo2ChallengeRuleEntity: storeState.cfgVo2ChallengeRule.entity,
  loading: storeState.cfgVo2ChallengeRule.loading,
  updating: storeState.cfgVo2ChallengeRule.updating,
  updateSuccess: storeState.cfgVo2ChallengeRule.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

export const CfgVo2ChallengeRuleUpdate = (props: ICfgVo2ChallengeRuleUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { cfgVo2ChallengeRuleEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/cfgvo2challengerule');
  };

  useEffect(() => {
    if (!isNew) {
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
        ...cfgVo2ChallengeRuleEntity,
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
          <h2 id="foxstep2AdminApp.cfgVo2ChallengeRule.home.createOrEditLabel" data-cy="CfgVo2ChallengeRuleCreateUpdateHeading">
            Create or edit a CFG VO2 Challenge Rule
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : cfgVo2ChallengeRuleEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="cfgVo2ChallengeRule-id">ID</Label>
                  <AvInput id="cfgVo2ChallengeRule-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="minParticipantLabel" for="cfgVo2ChallengeRule-minParticipant">
                  Min Participant
                </Label>
                <AvField
                  id="cfgVo2ChallengeRule-minParticipant"
                  data-cy="minParticipant"
                  type="text"
                  name="minParticipant"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="minCompleteLabel" for="cfgVo2ChallengeRule-minComplete">
                  Min Complete
                </Label>
                <AvField 
                  id="cfgVo2ChallengeRule-minComplete" 
                  data-cy="minComplete" 
                  type="text" 
                  name="minComplete" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="calTypeLabel" for="cfgVo2ChallengeRule-calType">
                  Cal Type
                </Label>
                <AvField 
                  id="cfgVo2ChallengeRule-calType" 
                  data-cy="calType" 
                  type="text" 
                  name="calType" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/cfgvo2challengerule" replace color="info">
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

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2ChallengeRuleUpdate);