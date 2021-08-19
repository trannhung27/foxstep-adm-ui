import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './wf-action-type.reducer';
import { PageHeader } from 'antd';

export interface IWfActionTypeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WfActionTypeUpdate = (props: IWfActionTypeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { wfActionTypeEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/wf-action-type');
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
        ...wfActionTypeEntity,
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
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title={isNew ? 'Thêm loại hành động' : 'Sửa loại hành động'} />
      <hr />
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : wfActionTypeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="wf-action-type-id">ID</Label>
                  <AvInput id="wf-action-type-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="codeLabel" for="wf-action-type-code">
                  Mã
                </Label>
                <AvField
                  id="wf-action-type-code"
                  data-cy="code"
                  type="text"
                  name="code"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="wf-action-type-name">
                  Tên
                </Label>
                <AvField
                  id="wf-action-type-name"
                  data-cy="name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/wf-action-type" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Quay lại</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Lưu
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  wfActionTypeEntity: storeState.wfActionType.entity,
  loading: storeState.wfActionType.loading,
  updating: storeState.wfActionType.updating,
  updateSuccess: storeState.wfActionType.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfActionTypeUpdate);
