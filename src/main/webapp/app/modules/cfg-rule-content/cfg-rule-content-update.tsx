import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { createEntity, getEntity, reset, updateEntity } from './cfg-rule-content.reducer';
import { PageHeader } from 'antd';

export interface ICfgRuleContentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CfgRuleContentUpdate = (props: ICfgRuleContentUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { cfgRuleContentEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/cfg-rule-content');
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
        ...cfgRuleContentEntity,
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
            <AvForm model={isNew ? {} : cfgRuleContentEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="cfg-rule-content-id">ID</Label>
                  <AvInput id="cfg-rule-content-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="contentLabel" for="cfg-rule-content-content">
                  Nội dung
                </Label>
                <AvField
                  id="cfg-rule-content-content"
                  data-cy="content"
                  type="textarea"
                  rows = "8"
                  name="content"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="cfg-rule-content-content">
                  Kiểu
                </Label>
                <AvField
                  id="cfg-rule-content-type"
                  data-cy="type"
                  type="select"
                  name="type"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                  }}
                >
                  <option value="" key="0">
                    --Chọn kiểu--
                  </option>
                  <option value="1" key="1">
                    Điều khoản
                  </option>
                  <option value="2" key="1">
                    Chính sách bảo mật
                  </option>
                </AvField>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/cfg-rule-content" replace color="info">
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
  cfgRuleContentEntity: storeState.cfgRuleContent.entity,
  loading: storeState.cfgRuleContent.loading,
  updating: storeState.cfgRuleContent.updating,
  updateSuccess: storeState.cfgRuleContent.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CfgRuleContentUpdate);
