import { Link, RouteComponentProps } from 'react-router-dom';
import { IRootState } from 'app/shared/reducers';
import { getEntity, updateEntity, createEntity, reset } from './CfgLevelInfo.reducer';

import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';

export interface ICfgLevelInfoUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const mapStateToProps = (storeState: IRootState) => ({
  cfgLevelInfoEntity: storeState.cfgLevelInfo.entity,
  loading: storeState.cfgLevelInfo.loading,
  updating: storeState.cfgLevelInfo.updating,
  updateSuccess: storeState.cfgLevelInfo.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

export const CfgLevelInfoUpdate = (props: ICfgLevelInfoUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { cfgLevelInfoEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/entity/cfglevelinfo');
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
        ...cfgLevelInfoEntity,
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
          <h2 id="foxstep2AdminApp.cfgLevelInfo.home.createOrEditLabel" data-cy="CfgLevelInfoCreateUpdateHeading">
            Create or edit a CFG Level Info
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : cfgLevelInfoEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="cfgLevelInfo-id">ID</Label>
                  <AvInput id="cfgLevelInfo-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="minPointLabel" for="cfgLevelInfo-minPoint">
                  Min Point
                </Label>
                <AvField
                  id="cfgLevelInfo-minPoint"
                  data-cy="minPoint"
                  type="text"
                  name="minPoint"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    minLength: { value: 0, errorMessage: 'This field must not be left blank.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="maxPointLabel" for="cfgLevelInfo-maxPoint">
                  Max Point
                </Label>
                <AvField 
                  id="cfgLevelInfo-maxPoint" 
                  data-cy="maxPoint" 
                  type="text" 
                  name="maxPoint" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="levelLabel" for="cfgLevelInfo-level">
                  Level
                </Label>
                <AvField 
                  id="cfgLevelInfo-level" 
                  data-cy="level" 
                  type="text" 
                  name="level" 
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 5, errorMessage: 'This field cannot be longer than 5 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/entity/cfglevelinfo" replace color="info">
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

export default connect(mapStateToProps, mapDispatchToProps)(CfgLevelInfoUpdate);