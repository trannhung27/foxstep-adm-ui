import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './wf-process-group.reducer';
import { PageHeader } from 'antd';

export interface IWfProcessGroupUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WfProcessGroupUpdate = (props: IWfProcessGroupUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { wfProcessGroupEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/wf-process-group');
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
        ...wfProcessGroupEntity,
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
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title={isNew ? 'Thêm nhóm duyệt' : 'Sửa nhóm duyệt'} />
      <hr />
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : wfProcessGroupEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="wf-process-group-id">ID</Label>
                  <AvInput id="wf-process-group-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="wf-process-group-name">
                  Tên
                </Label>
                <AvField
                  id="wf-process-group-name"
                  data-cy="name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="wf-process-group-status">
                  Trạng thái
                </Label>
                <AvField
                  id="wf-process-group-status"
                  data-cy="status"
                  type="string"
                  className="form-control"
                  name="status"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                    number: { value: true, errorMessage: 'Chỉ chấp nhận số.' },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/wf-process-group" replace color="info">
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
  wfProcessGroupEntity: storeState.wfProcessGroup.entity,
  loading: storeState.wfProcessGroup.loading,
  updating: storeState.wfProcessGroup.updating,
  updateSuccess: storeState.wfProcessGroup.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcessGroupUpdate);
