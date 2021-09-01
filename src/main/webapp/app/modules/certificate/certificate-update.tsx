import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Col, Label, Row, Table } from 'reactstrap';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { AvFeedback, AvForm, AvGroup, AvField } from 'availity-reactstrap-validation';

export interface ICertificateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CertificateUpdate = (props: ICertificateUpdateProps) => {
  const { certificateEntity, match, loading, totalItems } = props;

  const saveEntity = (event, errors, values) => {};
  return (
    <div>
      <Row className="justify-content-right">
        <Col md="6">
          <h5 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
            Chỉnh sửa mẫu Certificate thử thách từ cá nhân
          </h5>
        </Col>
      </Row>

      <hr
        style={{
          backgroundColor: 'DodgerBlue',
          height: '2px',
        }}
      />

      <Row>
        <Col md={12}>
          <h6 style={{ fontWeight: 'bold' }}> Thông tin hiển thị &nbsp;</h6>
          <AvForm model={certificateEntity} onSubmit={saveEntity}>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField id="certificate_name" type="checkbox" name="fullName" value={certificateEntity.fullName === 1 ? true : false} />
                  <Label> Tên KH</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField id="certificate_rank" type="checkbox" name="rank" value={certificateEntity.rank === 1 ? true : false} />
                  <Label> Xếp hạng</Label>
                </AvGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_challengeName"
                    type="checkbox"
                    name="challengeName"
                    value={certificateEntity.challengeName === 1 ? true : false}
                  />
                  <Label> Tên thử thách</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_signature"
                    type="checkbox"
                    name="signature"
                    value={certificateEntity.signature === 1 ? true : false}
                  />
                  <Label> Chữ kí của FoxSteps</Label>
                </AvGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_timeChallenge"
                    type="checkbox"
                    name="timeChallenge"
                    value={certificateEntity.timeChallenge === 1 ? true : false}
                  />
                  <Label> Thời gian diễn ra</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_distance"
                    type="checkbox"
                    name="distance"
                    value={certificateEntity.distance === 1 ? true : false}
                  />
                  <Label> Hạng mục</Label>
                </AvGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField id="certificate_avgPace" type="checkbox" name="avgPace" value={certificateEntity.avgPace === 1 ? true : false} />
                  <Label> Avg pace</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_textCompletion"
                    type="checkbox"
                    name="textCompletion"
                    value={certificateEntity.textCompletion === 1 ? true : false}
                  />
                  <Label> Hoàn tất thành công</Label>
                </AvGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_timeChallenge"
                    type="checkbox"
                    name="timeFinish"
                    value={certificateEntity.timeFinish === 1 ? true : false}
                  />
                  <Label> Thời gian hoàn thành</Label>
                </AvGroup>
              </Col>
            </Row>

            <h6 style={{ fontWeight: 'bold' }}> Mẫu certificate &nbsp;</h6>
            <Row>
              <Col md={7}>
                <img />
              </Col>
            </Row>

            <Row style={{ paddingBottom: '40px' }}>
              <Col xs="12" sm="4">
                <Button tag={Link} id="cancel-save" to="/challenges" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Hủy</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={loading}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Lưu
                </Button>
              </Col>
            </Row>
          </AvForm>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ certificate }: IRootState) => ({
  certificateEntity: certificate.entity,
  loading: certificate.loading,
  totalItems: certificate.totalItems,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CertificateUpdate);
