import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity, updateEntity, createEntity, reset } from './CfgVo2Rule.reducer';

import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

export interface ICfgVo2RuleUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const mapStateToProps = (storeState: IRootState) => ({
  cfgVo2RuleEntity: storeState.cfgVo2Rule.entity,
  loading: storeState.cfgVo2Rule.loading,
  updating: storeState.cfgVo2Rule.updating,
  updateSuccess: storeState.cfgVo2Rule.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

export const CfgVo2RuleUpdate = (props: ICfgVo2RuleUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { cfgVo2RuleEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/cfgvo2rule');
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
        ...cfgVo2RuleEntity,
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
          <h2 id="foxstep2AdminApp.cfgVo2Rule.home.createOrEditLabel" data-cy="CfgVo2RuleCreateUpdateHeading">
            Create or edit a CFG VO2 Rule
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : cfgVo2RuleEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="cfgVo2Rule-id">ID</Label>
                  <AvInput id="cfgVo2Rule-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="calTypeLabel" for="cfgVo2Rule-calType">
                  Cal Type
                </Label>
                <AvField
                  id="cfgVo2Rule-calType"
                  data-cy="calType"
                  type="text"
                  name="calType"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fromDistanceLabel" for="cfgVo2Rule-fromDistance">
                  From Distance
                </Label>
                <AvField 
                  id="cfgVo2Rule-fromDistance" 
                  data-cy="fromDistance" 
                  type="text" 
                  name="fromDistance" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="toDistanceLabel" for="cfgVo2Rule-toDistance">
                  To Distance
                </Label>
                <AvField 
                  id="cfgVo2Rule-toDistance" 
                  data-cy="toDistance" 
                  type="text" 
                  name="toDistance" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="pointLabel" for="cfgVo2Rule-point">
                  Point
                </Label>
                <AvField 
                  id="cfgVo2Rule-point" 
                  data-cy="point" 
                  type="text" 
                  name="point" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/cfgvo2rule" replace color="info">
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

export default connect(mapStateToProps, mapDispatchToProps)(CfgVo2RuleUpdate);