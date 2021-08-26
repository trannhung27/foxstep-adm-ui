import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Badge, Button, Col, Label, Row, Table } from 'reactstrap';
import { JhiPagination, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import { AvFeedback, AvForm, AvGroup, AvField } from 'availity-reactstrap-validation';

// import { getEntities } from './news.reducer';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

export interface ICertificateProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Certificate = (props: ICertificateProps) => {
  const { newsList, match, loading, totalItems } = props;
  return (
    <div>
      <Row className="justify-content-right">
        <Col md="6">
          <h5 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
            Cài đặt mẫu Certificate thử thách từ cá nhân
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
          <AvForm
            // model={certificateEntity}
            readOnly
          >
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_name"
                    type="checkbox"
                    name="fullName"
                    // value={}
                  />
                  <Label> Tên KH</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_rank"
                    type="checkbox"
                    name="rank"
                    // value={}
                  />
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
                    // value={}
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
                    // value={}
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
                    // value={}
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
                    // value={}
                  />
                  <Label> Hạng mục</Label>
                </AvGroup>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_avgPace"
                    type="checkbox"
                    name="avgPace"
                    // value={}
                  />
                  <Label> Avg pace</Label>
                </AvGroup>
              </Col>
              <Col md={3}>
                <AvGroup className="form-group form-inline">
                  <AvField
                    id="certificate_textCompletion"
                    type="checkbox"
                    name="textCompletion"
                    // value={}
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
                    // value={}
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
          </AvForm>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({ news }: IRootState) => ({
  newsList: news.entities,
  loading: news.loading,
  totalItems: news.totalItems,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Certificate);
