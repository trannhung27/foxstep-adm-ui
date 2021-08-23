import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IWfProcessGroup } from 'app/shared/model/workflow/wf-process-group.model';
import { getEntities as getWfProcessGroups } from 'app/modules/workflow/wf-process-group/wf-process-group.reducer';
import { getEntity, updateEntity, createEntity, reset } from './wf-process.reducer';
import { IWfProcess } from 'app/shared/model/workflow/wf-process.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { AUTHORITIES } from 'app/config/constants';

export interface IWfProcessUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WfProcessUpdate = (props: IWfProcessUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { wfProcessEntity, wfProcessGroups, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/wf-process');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getWfProcessGroups();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...wfProcessEntity,
        ...values,
        wfProcessGroup: wfProcessGroups.find(it => it.id.toString() === values.wfProcessGroupId.toString()),
        authority: values.authorityId === AUTHORITIES.ADMIN.id ? AUTHORITIES.ADMIN : AUTHORITIES.USER,
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
          <h2 id="foxstep2AdminServiceApp.wfProcess.home.createOrEditLabel" data-cy="WfProcessCreateUpdateHeading">
            Create or edit a WfProcess
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : wfProcessEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="wf-process-id">ID</Label>
                  <AvInput id="wf-process-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="typeLabel" for="wf-process-type">
                  Type
                </Label>
                <AvField
                  id="wf-process-type"
                  data-cy="type"
                  type="string"
                  className="form-control"
                  name="type"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="wf-process-status">
                  Status
                </Label>
                <AvField
                  id="wf-process-status"
                  data-cy="status"
                  type="string"
                  className="form-control"
                  name="status"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="wf-process-wfProcessGroup">Wf Process Group</Label>
                <AvInput
                  id="wf-process-wfProcessGroup"
                  data-cy="wfProcessGroup"
                  type="select"
                  className="form-control"
                  name="wfProcessGroupId"
                  value={isNew ? 0 : wfProcessEntity.wfProcessGroup ? wfProcessEntity.wfProcessGroup.id : 0}
                  required
                >
                  <option value="" key="0" />
                  {wfProcessGroups
                    ? wfProcessGroups.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="process-authority">Process Authority</Label>
                <AvInput
                  id="process-authority"
                  data-cy="authority"
                  type="select"
                  className="form-control"
                  name="authorityId"
                  value={isNew ? 0 : wfProcessEntity.authority ? wfProcessEntity.authority.id : 0}
                  required
                >
                  <option value="" key="0" />
                  <option value={AUTHORITIES.ADMIN.id} key={AUTHORITIES.ADMIN.id}>
                    {AUTHORITIES.ADMIN.name}
                  </option>
                  <option value={AUTHORITIES.USER.id} key={AUTHORITIES.USER.id}>
                    {AUTHORITIES.USER.name}
                  </option>
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/wf-process" replace color="info">
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
  wfProcessGroups: storeState.wfProcessGroup.entities,
  wfProcessEntity: storeState.wfProcess.entity,
  loading: storeState.wfProcess.loading,
  updating: storeState.wfProcess.updating,
  updateSuccess: storeState.wfProcess.updateSuccess,
});

const mapDispatchToProps = {
  getWfProcessGroups,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcessUpdate);
