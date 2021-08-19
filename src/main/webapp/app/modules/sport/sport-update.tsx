import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './sport.reducer';
import { PageHeader } from 'antd';

export interface ISportUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const SportUpdate = (props: ISportUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { sportEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/sport');
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
        ...sportEntity,
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
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title={isNew ? 'Thêm bộ môn' : 'Sửa bộ môn'} />
      <hr />
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : sportEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="sport-id">ID</Label>
                  <AvInput id="sport-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="sport-name">
                  Tên bộ môn
                </Label>
                <AvField
                  id="sport-name"
                  data-cy="name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                    maxLength: { value: 100, errorMessage: 'Tối đa 100 kí tự.' },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/sport" replace color="info">
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
  sportEntity: storeState.sport.entity,
  loading: storeState.sport.loading,
  updating: storeState.sport.updating,
  updateSuccess: storeState.sport.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SportUpdate);
