import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, Collapse, CardBody, Card } from 'reactstrap';
import {
  AvFeedback,
  AvForm,
  AvGroup,
  AvInput,
  AvField,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
  AvInputContainer,
} from 'availity-reactstrap-validation';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { approveChallenge, getEntity, endChallenge } from './challenge.reducer';
import moment from 'moment';
import {
  APP_DATE_FORMAT,
  APP_LOCAL_DATE_FORMAT,
  APP_LOCAL_DATETIME_FORMAT_Z,
  APP_TIMESTAMP_FORMAT,
  ChallengeStatuses,
  WfProcessGroup,
} from 'app/config/constants';
import { getEntities as getActions } from '../workflow/wf-action/wf-action-reducer';
import { WfAction } from 'app/modules/workflow/wf-action/wf-action';
import { ChallengeApproveDialog } from 'app/modules/challenge/challenge-approve-dialog';
import { ChallengeRejectDialog } from 'app/modules/challenge/challenge-reject-dialog';

export interface IChallengeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeDetail = (props: IChallengeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { challengeEntity } = props;
  return (
    <Row>
      <Col md="12">
        <Button tag={Link} to={`/challenges/${challengeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
        </Button>
        &nbsp;
        <Button
          onClick={() => {
            setShowApproveModal(true);
          }}
          replace
          color="primary"
        >
          <span className="d-none d-md-inline">Duyệt</span>
        </Button>
        &nbsp;
        <Button
          onClick={() => {
            setShowRejectModal(true);
          }}
          replace
          color="primary"
        >
          <span className="d-none d-md-inline">Từ chối</span>
        </Button>
        &nbsp;
        <Button
          onClick={() => {
            props.endChallenge(props.challengeEntity.id);
          }}
          replace
          color="primary"
        >
          <span className="d-none d-md-inline">Kết thúc</span>
        </Button>
      </Col>
      <ChallengeApproveDialog
        showModal={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
        }}
        challengeEntity={props.challengeEntity}
        getEntity={props.getEntity}
        approve={props.approveChallenge}
        updateSuccess={props.updateSuccess}
      />
      <ChallengeRejectDialog
        onClose={() => {
          setShowRejectModal(false);
        }}
        showModal={showRejectModal}
        challengeEntity={props.challengeEntity}
        getEntity={props.getEntity}
        reject={props.approveChallenge}
        updateSuccess={props.updateSuccess}
      />
      <Col md="12">
        <AvForm model={challengeEntity} readOnly>
          <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>1. Thông tin chung</h4>
          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }}>Trạng thái: &nbsp; &nbsp; &nbsp;</Label>
                {challengeEntity.status === ChallengeStatuses[0].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[0].name}</div>
                ) : challengeEntity.status === ChallengeStatuses[1].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[1].name}</div>
                ) : challengeEntity.status === ChallengeStatuses[2].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[2].name}</div>
                ) : challengeEntity.status === ChallengeStatuses[3].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[3].name}</div>
                ) : challengeEntity.status === ChallengeStatuses[4].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[4].name}</div>
                ) : challengeEntity.status === ChallengeStatuses[5].id ? (
                  <div style={{ fontWeight: 'bold' }}>{ChallengeStatuses[5].name}</div>
                ) : (
                  <div style={{ fontWeight: 'bold' }}></div>
                )}
              </AvGroup>
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="img_urlLabel" for="challenge-img_url">
                  Thành viên: &nbsp; &nbsp;
                </Label>
                <div style={{ fontWeight: 'bold' }}>
                  {challengeEntity.numOfParticipant}/{challengeEntity.numOfRegis}
                </div>
              </AvGroup>
            </Col>

            {/* <Col xs="12" sm="5">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px' }} id="img_urlLabel" for="challenge-img_url">
                  Ban tổ chức khởi tạo
                </Label>
                <AvField
                  id="challenge-challenge_type"
                  data-cy="challenge_type"
                  type="radio"
                  name="challenge_type"
                  required
                  defaultChecked
                  disabled
                  value="0"
                />
              </AvGroup>
            </Col> */}
          </Row>

          <Row>
            <Col xs="12" sm="6">
              {challengeEntity.challengeType === 0 ? (
                <AvGroup className="form-group form-inline">
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    Tên tổ chức: &nbsp; &nbsp;
                  </Label>
                  <div>{challengeEntity.organizationName}</div>
                </AvGroup>
              ) : (
                <AvGroup className="form-group form-inline">
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    Cá nhân tổ chức: &nbsp; &nbsp;
                  </Label>
                  <div>{challengeEntity.userCreated ? challengeEntity.userCreated.name : ''}</div>
                </AvGroup>
              )}
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Cá nhân tổ chức: &nbsp; &nbsp;
                </Label>
                <div>{challengeEntity.userCreated ? challengeEntity.userCreated.name : ''}</div>
              </AvGroup>
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Ảnh đại diện TT(tỉ lệ 2x1): &nbsp; &nbsp;
                </Label>
                <div>Not done yet</div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Tên thử thách: &nbsp; &nbsp;
                </Label>
                <div>{challengeEntity.title}</div>
              </AvGroup>
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Gắn thẻ: &nbsp; &nbsp;
                </Label>
                <div>Not done yet</div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Thời gian bắt đầu: &nbsp; &nbsp;
                </Label>
                <div>
                  {challengeEntity.dateStart ? (
                    <TextFormat type="date" value={challengeEntity.dateStart} format={APP_TIMESTAMP_FORMAT} />
                  ) : null}
                </div>
              </AvGroup>
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Thời gian kết thúc: &nbsp; &nbsp;
                </Label>
                <div>
                  {challengeEntity.dateFinish ? (
                    <TextFormat type="date" value={challengeEntity.dateFinish} format={APP_TIMESTAMP_FORMAT} />
                  ) : null}
                </div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Nội dung: &nbsp; &nbsp;
                </Label>
                <div className="content" dangerouslySetInnerHTML={{ __html: challengeEntity.content }}></div>
              </AvGroup>
            </Col>
          </Row>

          <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>2. Cài đặt tiêu chí:</h4>
          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Bộ môn: &nbsp; &nbsp;
                </Label>
                <div className="content" dangerouslySetInnerHTML={{ __html: challengeEntity.content }}></div>
              </AvGroup>
              <AvGroup classname="form-inline">
                <AvRadioGroup name="cal_type">
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    Cách tính thành tích: &nbsp; &nbsp;
                  </Label>
                  <AvRadio label="Có MỘT LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value={Number('1')} />
                  <AvRadio label="Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value={Number('2')} />
                </AvRadioGroup>
              </AvGroup>
            </Col>
          </Row>

          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
            Hạng mục(Cho phép nhập trực tiếp quãng đường với đơn vị là Km){' '}
          </text>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Hạng mục 1: &nbsp; &nbsp;
                </Label>
                <div className="content">{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.rankCriteria1 : ''}</div>
              </AvGroup>
            </Col>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Hạng mục 2: &nbsp; &nbsp;
                </Label>
                <div className="content">{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.rankCriteria2 : ''}</div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Hạng mục 3: &nbsp; &nbsp;
                </Label>
                <div className="content">Not done yet</div>
              </AvGroup>
            </Col>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Hạng mục 4: &nbsp; &nbsp;
                </Label>
                <div className="content">Not done yet</div>
              </AvGroup>
            </Col>
          </Row>
          <Row></Row>
          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hợp lệ:</text>

          <Row></Row>
          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hoàn thành:</text>
          <Row></Row>

          <text style={{ fontWeight: 'bold' }}>Thứ tự các tiêu chí xếp hạng:</text>

          <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>3. Cài đặt thành viên</h4>
          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Số người tham gia: &nbsp; &nbsp;
                </Label>
                <div className="content">{challengeEntity.numOfParticipant}</div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Phạm vi: &nbsp; &nbsp;
                </Label>
                <div className="content">{challengeEntity.numOfParticipant}</div>
              </AvGroup>
            </Col>
          </Row>

          <hr color="lightblue" style={{ height: '3px' }} />
          <WfAction
            contentId={+props.match.params.id}
            groupId={WfProcessGroup.CHALLENGE}
            wfActionList={props.wfActionList}
            loading={props.wfActionLoading}
            getEntities={props.getActions}
          />
        </AvForm>
        <Button tag={Link} to="/challenges" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Trở lại</span>
        </Button>
        &nbsp;
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ challenge, wfAction }: IRootState) => ({
  challengeEntity: challenge.entity,
  wfActionList: wfAction.entities,
  wfActionLoading: wfAction.loading,
  updateSuccess: challenge.updateSuccess,
});

const mapDispatchToProps = { getEntity, getActions, approveChallenge, endChallenge };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDetail);
