import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
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
import parse from 'html-react-parser';

import { IRootState } from 'app/shared/reducers';
import { approveChallenge, getEntity, endChallenge } from './challenge.reducer';

import { APP_TIMESTAMP_FORMAT, ChallengeStatuses, WfProcessGroup } from 'app/config/constants';
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
  const [challengeDistance, setChallengeDistance] = useState([]);

  const { challengeEntity } = props;
  const history = useHistory();

  const compare = (a, b) => {
    return Number(a.orderId) - Number(b.orderId);
  };

  useEffect(() => {
    if (challengeEntity.challengeDistance) {
      const list = [];
      challengeEntity.challengeDistance.map((distance, index) => {
        list[index] = { value: distance.distance, orderId: distance.orderId };
      });
      list.sort(compare);
      setChallengeDistance(list);
    }
  }, [props.challengeEntity]);
  return (
    <Row>
      <Col md="12">
        {challengeEntity.status === ChallengeStatuses[0].id ? (
          <>
            <Button tag={Link} to={`/challenges/${challengeEntity.id}/edit`} replace color="primary">
              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {[ChallengeStatuses[1].id, ChallengeStatuses[2].id, ChallengeStatuses[3].id].includes(challengeEntity.status) && (
          <>
            <Button tag={Link} to={`/challenges/${challengeEntity.id}/participants`} replace color="primary">
              <span className="d-none d-md-inline">Danh sách thành viên</span>
            </Button>
            &nbsp;
          </>
        )}
        {challengeEntity.status === ChallengeStatuses[0].id ? (
          <>
            <Button
              onClick={() => {
                setShowApproveModal(true);
              }}
              replace
              color="success"
            >
              <span className="d-none d-md-inline">Duyệt</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {challengeEntity.status === ChallengeStatuses[0].id ? (
          <>
            <Button
              onClick={() => {
                setShowRejectModal(true);
              }}
              replace
              color="danger"
            >
              <span className="d-none d-md-inline">Từ chối</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {challengeEntity.status === ChallengeStatuses[1].id || challengeEntity.status === ChallengeStatuses[3].id ? (
          <>
            <Button
              onClick={() => {
                props.endChallenge(props.challengeEntity.id);
              }}
              replace
              color="secondary"
            >
              <span className="d-none d-md-inline">Kết thúc</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        &nbsp;
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
                  {challengeEntity.numOfRegis}/{challengeEntity.numOfParticipant}
                </div>
              </AvGroup>
            </Col>
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
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Ảnh đại diện TT(tỉ lệ 2x1): &nbsp; &nbsp;
                </Label>
                <img style={{ width: '240px', height: '180px' }} src={challengeEntity.imgUrl} />
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
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-dateStart">
                  Thời gian bắt đầu: &nbsp; &nbsp;
                </Label>
                <div>
                  <TextFormat type="date" value={challengeEntity.dateStart} format={APP_TIMESTAMP_FORMAT} />
                </div>
              </AvGroup>
            </Col>

            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-dateFinish">
                  Thời gian kết thúc: &nbsp; &nbsp;
                </Label>
                <div>
                  <TextFormat type="date" value={challengeEntity.dateFinish} format={APP_TIMESTAMP_FORMAT} />
                </div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-dateRegisDeadline">
                  Hạn đăng kí: &nbsp; &nbsp;
                </Label>
                <div>
                  <TextFormat type="date" value={challengeEntity.dateRegisDeadline} format={APP_TIMESTAMP_FORMAT} />
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
                <div>{challengeEntity.content && parse(challengeEntity.content)}</div>
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
                <div>{challengeEntity.sport && challengeEntity.sport.name}</div>
              </AvGroup>
              <AvGroup classname="form-inline">
                <AvRadioGroup name="calType" value={challengeEntity.calType}>
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

          {challengeDistance.map((distance, i) => (
            <Col xs="12" sm="6" key={i}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  Hạng mục {i + 1}: &nbsp; &nbsp;
                </Label>
                <div className="content">{distance.value / 1000}</div>
              </AvGroup>
            </Col>
          ))}

          <Row></Row>
          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hợp lệ:</text>

          <AvField
            type="checkbox"
            disabled
            check
            name="challengeValidity.checkTime"
            label=" Thời gian bắt đầu diễn ra thử thách từ thời gian bắt đầu tới thời gian kết thúc"
            value={true}
          />

          <AvGroup inline name="avgPace" className="form-group form-inline">
            <input
              type="checkbox"
              checked
              disabled
              className="mr-2"
              // onChange={() => setAvgPace({ from: avgPace.from, to: avgPace.to, required: !avgPace.required })}
            />
            <Label>Bài chạy có tốc độ trung bình(avg pace) &nbsp; &nbsp; Từ &nbsp;</Label>
            <div>{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.avgPaceFrom : ''}</div>
            <Label>&nbsp; - Đến &nbsp; </Label>
            <div>{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.avgPaceTo : ''}</div>
            <text> &nbsp; (phút/km)</text>
          </AvGroup>

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.minDistance === 0 ? null : (
              <AvGroup inline name="mínDistance" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>Bài chạy có quãng đường tối thiểu &nbsp; &nbsp; </Label>
                <div>{Number((challengeEntity.challengeValidity.minDistance / 1000).toFixed(1))}</div>
                <text> &nbsp; (km)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.elevationGain === 0 ? null : (
              <AvGroup inline name="elevationGain" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>Bài chạy có độ cao đạt được (elevation gain) tối thiểu &nbsp; &nbsp; </Label>
                <div>{Number(challengeEntity.challengeValidity.elevationGain)}</div>
                <text> &nbsp; (m)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.avgCadenceFrom === 0 ? null : (
              <AvGroup inline name="avgCadence" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>Bài chạy có nhịp chân trung bình(avg cadence) &nbsp; &nbsp; Từ &nbsp;</Label>
                <div>{challengeEntity.challengeValidity.avgCadenceFrom}</div>
                <Label>&nbsp; - Đến &nbsp; </Label>
                <div>{challengeEntity.challengeValidity.avgCadenceTo}</div>
                <text> &nbsp; (bước/phút)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.gps === 1 && (
            <AvGroup inline name="isGps" className="form-group form-inline">
              <input type="checkbox" className="mr-2" checked />
              <Label>Chỉ chấp nhận các bài tập ngoài trời dùng GPS </Label>
            </AvGroup>
          )}
          <Row></Row>
          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hoàn thành:</text>
          <Row></Row>

          {challengeEntity.calType === 1
            ? 'Có MỘT LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký'
            : challengeEntity.calType === 2
            ? 'Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký'
            : ''}
          <Row></Row>
          <text style={{ fontWeight: 'bold' }}>Thứ tự các tiêu chí xếp hạng:</text>

          <AvGroup>
            <text>1. &nbsp;</text>
            <input type="checkbox" disabled checked className="mr-2" />
            <text>
              {' '}
              &nbsp;{' '}
              {challengeEntity.challengeValidity
                ? challengeEntity.challengeValidity.rankCriteria1 === 1
                  ? 'Số km thực hiện nhiều nhất'
                  : challengeEntity.challengeValidity.rankCriteria1 === 2
                  ? 'Avg Pace thấp nhất'
                  : ''
                : ''}
            </text>
          </AvGroup>

          <AvGroup>
            <text>2. &nbsp;</text>
            <input type="checkbox" disabled checked className="mr-2" />
            <text>
              {' '}
              &nbsp;{' '}
              {challengeEntity.challengeValidity
                ? challengeEntity.challengeValidity.rankCriteria2 === 1
                  ? 'Số km thực hiện nhiều nhất'
                  : challengeEntity.challengeValidity.rankCriteria2 === 2
                  ? 'Avg Pace thấp nhất'
                  : ''
                : ''}
            </text>
          </AvGroup>

          <AvGroup>
            <text>3. &nbsp;</text>
            <input
              type="checkbox"
              disabled
              checked={challengeEntity.challengeValidity ? challengeEntity.challengeValidity.rankCriteria3 === 3 : false}
              className="mr-2"
            />
            <text> &nbsp; {'Avg HR thấp nhất'}</text>
          </AvGroup>

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

          <AvGroup className="form-group">
            <Label>Phạm vi :</Label>

            <AvRadioGroup name="objectType" value={challengeEntity.objectType}>
              <AvRadio style={{ textAlign: 'left' }} label="Công khai - Mọi thành viên đều có thể tham gia" value={Number('1')} />
              <AvRadio label="Nội bộ - Chỉ có thành viên có mã đăng ký, được mời, được duyệt mới có thể tham gia" value={Number('2')} />
            </AvRadioGroup>
          </AvGroup>

          {challengeEntity.objectType === 2 ? <div className="content">{challengeEntity.code}</div> : null}

          <input type="checkbox" checked={challengeEntity.teams ? challengeEntity.teams.length > 0 : false} className="mr-2" />
          <Label>Thi đấu theo nhóm</Label>
          <Row></Row>
          {challengeEntity.teams && challengeEntity.teams.length > 0 && (
            <AvGroup>
              &nbsp; &nbsp; <input type="checkbox" className="mr-2" />
              <Label>Giới hạn thành viên mỗi nhóm: </Label>
              <text> &nbsp; &nbsp; {challengeEntity.numPerTeam}</text>
              <Row></Row>
              <AvGroup>
                <Row></Row>
                &nbsp; &nbsp;
                <text style={{ fontWeight: 'bold' }}>Tên nhóm:</text>
                {challengeEntity.teams.map((team, index) => (
                  <AvGroup key={index}>
                    <Label>
                      &nbsp; &nbsp; &nbsp; Nhóm {index + 1}: &nbsp; {team.name}
                      <br />
                    </Label>
                  </AvGroup>
                ))}
              </AvGroup>
            </AvGroup>
          )}

          <hr color="lightblue" style={{ height: '3px' }} />
          <WfAction
            contentId={+props.match.params.id}
            groupId={WfProcessGroup.CHALLENGE}
            wfActionList={props.wfActionList}
            loading={props.wfActionLoading}
            getEntities={props.getActions}
          />
        </AvForm>
        <Button key="1" onClick={() => history.goBack()} color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
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
