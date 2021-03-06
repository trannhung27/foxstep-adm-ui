import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { Button, Row, Col, Label, Badge } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';

import { IRootState } from 'app/shared/reducers';
import { approveChallenge, getEntity, endChallenge, cancelChallenge } from './challenge.reducer';

import { APP_TIMESTAMP_FORMAT, ChallengeStatuses, WfProcessGroup } from 'app/config/constants';
import { getEntities as getActions } from '../workflow/wf-action/wf-action-reducer';
import { WfAction } from 'app/modules/workflow/wf-action/wf-action';
import { ChallengeApproveDialog } from 'app/modules/challenge/challenge-approve-dialog';
import { ChallengeRejectDialog } from 'app/modules/challenge/challenge-reject-dialog';
import { ChallengeEndDialog } from 'app/modules/challenge/challenge-end-dialog';
import { ChallengeCancelDialog } from 'app/modules/challenge/challenge-cancel-dialog';
import { IChallengeUpdateProps } from 'app/modules/challenge/challenge-update';

export interface IChallengeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

// eslint-disable-next-line complexity
export const ChallengeDetail = (props: IChallengeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [challengeDistance, setChallengeDistance] = useState([]);

  const { challengeEntity } = props;
  const history = useHistory();

  useEffect(() => {
    if (challengeEntity.challengeDistance) {
      const list = [];
      challengeEntity.challengeDistance.map((distance, index) => {
        list[index] = { value: distance.distance, orderId: distance.orderId };
      });
      setChallengeDistance(list);
    }
  }, [props.challengeEntity]);
  return (
    <Row>
      <Col md="12">
        {challengeEntity.status === ChallengeStatuses[0].id || challengeEntity.status === ChallengeStatuses[4].id ? (
          <>
            <Button tag={Link} to={`/challenges/${challengeEntity.id}/edit`} color="primary">
              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">S???a</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {[ChallengeStatuses[1].id, ChallengeStatuses[2].id, ChallengeStatuses[3].id].includes(challengeEntity.status) && (
          <>
            <Button tag={Link} to={`/challenges/${challengeEntity.id}/participants`} color="primary">
              <span className="d-none d-md-inline">Danh s??ch th??nh vi??n</span>
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
              <span className="d-none d-md-inline">Duy???t</span>
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
              <span className="d-none d-md-inline">T??? ch???i</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {challengeEntity.status === ChallengeStatuses[3].id ? (
          <>
            <Button
              onClick={() => {
                setShowEndModal(true);
              }}
              replace
              color="secondary"
            >
              <span className="d-none d-md-inline">K???t th??c</span>
            </Button>
            &nbsp;
          </>
        ) : null}
        {challengeEntity.status === ChallengeStatuses[4].id ? (
          <>
            <Button
              onClick={() => {
                setShowCancelModal(true);
              }}
              replace
              color="danger"
            >
              <span className="d-none d-md-inline">H???y</span>
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
      <ChallengeEndDialog
        onClose={() => {
          setShowEndModal(false);
        }}
        showModal={showEndModal}
        challengeEntity={props.challengeEntity}
        endChallenge={props.endChallenge}
        updateSuccess={props.updateSuccess}
        updating={props.updating}
      />
      <ChallengeCancelDialog
        onClose={() => {
          setShowCancelModal(false);
        }}
        showModal={showCancelModal}
        challengeEntity={props.challengeEntity}
        cancelChallenge={props.cancelChallenge}
        updateSuccess={props.updateSuccess}
        updating={props.updating}
      />
      <Col md="12">
        <AvForm model={challengeEntity} readOnly>
          <h4 style={{ fontWeight: 'bold' }}>1. Th??ng tin chung</h4>
          <Row>
            <Col md={4}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }}>Tr???ng th??i: &nbsp; &nbsp; &nbsp;</Label>
                {challengeEntity.status === 0 ? (
                  <Badge color="dark">{ChallengeStatuses[0].name}</Badge>
                ) : challengeEntity.status === 1 ? (
                  <Badge color="primary">{ChallengeStatuses[1].name}</Badge>
                ) : challengeEntity.status === 2 ? (
                  <Badge color="danger">{ChallengeStatuses[2].name}</Badge>
                ) : challengeEntity.status === 12 ? (
                  <Badge color="success">{ChallengeStatuses[3].name}</Badge>
                ) : challengeEntity.status === -1 ? (
                  <Badge color="secondary">{ChallengeStatuses[4].name}</Badge>
                ) : challengeEntity.status === -2 ? (
                  <Badge color="info">{ChallengeStatuses[5].name}</Badge>
                ) : (
                  <div></div>
                )}
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              {challengeEntity.challengeType === 0 ? (
                <AvGroup className="form-group form-inline">
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    T??n t??? ch???c: &nbsp; &nbsp;
                  </Label>
                  <div>{challengeEntity.organizationName}</div>
                </AvGroup>
              ) : (
                <AvGroup className="form-group form-inline">
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    C?? nh??n t??? ch???c: &nbsp; &nbsp;
                  </Label>
                  <div>{challengeEntity.userCreated ? challengeEntity.userCreated.name : ''}</div>
                </AvGroup>
              )}
            </Col>

            <Col md={3}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="img_urlLabel" for="challenge-img_url">
                  Th??nh vi??n: &nbsp; &nbsp;
                </Label>
                <div style={{ fontWeight: 'bold' }}>
                  {challengeEntity.numOfRegis}/{challengeEntity.numOfParticipant}
                </div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  ???nh ?????i di???n TT(t??? l??? 2x1): &nbsp; &nbsp;
                </Label>
                <img style={{ width: '240px', height: '180px' }} src={challengeEntity.imgUrl} />
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  T??n th??? th??ch: &nbsp; &nbsp;
                </Label>
                <div>{challengeEntity.title}</div>
              </AvGroup>
            </Col>

            <Col md={3}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  G???n th???: &nbsp; &nbsp;
                </Label>
                <div>Not done yet</div>
              </AvGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-dateStart">
                  Th???i gian b???t ?????u: &nbsp; &nbsp;
                </Label>
                <div>
                  <TextFormat type="date" value={challengeEntity.dateStart} format={APP_TIMESTAMP_FORMAT} />
                </div>
              </AvGroup>
            </Col>

            <Col md={3}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-dateFinish">
                  Th???i gian k???t th??c: &nbsp; &nbsp;
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
                  H???n ????ng k??: &nbsp; &nbsp;
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
                  N???i dung: &nbsp; &nbsp;
                </Label>
                <div>{challengeEntity.content && parse(challengeEntity.content)}</div>
              </AvGroup>
            </Col>
          </Row>

          <h4 style={{ fontWeight: 'bold' }}>2. C??i ?????t ti??u ch??:</h4>
          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  B??? m??n: &nbsp; &nbsp;
                </Label>
                <Badge>{challengeEntity.sport && challengeEntity.sport.name}</Badge>
              </AvGroup>
              <AvGroup classname="form-inline">
                <AvRadioGroup name="calType" value={challengeEntity.calType}>
                  <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                    C??ch t??nh th??nh t??ch: &nbsp; &nbsp;
                  </Label>
                  <AvRadio label="C?? M???T L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??" value={Number('1')} />
                  <AvRadio label="T???ng t??ch l??y C??C L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??" value={Number('2')} />
                </AvRadioGroup>
              </AvGroup>
            </Col>
          </Row>

          <text style={{ fontWeight: 'bold' }}>H???ng m???c(Cho ph??p nh???p tr???c ti???p qu??ng ???????ng v???i ????n v??? l?? Km) </text>

          {challengeDistance.map((distance, i) => (
            <Col xs="12" sm="6" key={i}>
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  H???ng m???c {i + 1}: &nbsp; &nbsp;
                </Label>
                <div className="content">{distance.value / 1000}</div>
              </AvGroup>
            </Col>
          ))}

          <Row></Row>
          <text style={{ fontWeight: 'bold' }}>Ti??u ch?? h???p l???:</text>

          <AvField
            type="checkbox"
            disabled
            check
            name="challengeValidity.checkTime"
            label=" Th???i gian b???t ?????u di???n ra th??? th??ch t??? th???i gian b???t ?????u t???i th???i gian k???t th??c"
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
            <Label>B??i ch???y c?? t???c ????? trung b??nh(avg pace) &nbsp; &nbsp; T??? &nbsp;</Label>
            <div>{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.avgPaceFrom : ''}</div>
            <Label>&nbsp; - ?????n &nbsp; </Label>
            <div>{challengeEntity.challengeValidity ? challengeEntity.challengeValidity.avgPaceTo : ''}</div>
            <text> &nbsp; (ph??t/km)</text>
          </AvGroup>

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.minDistance === 0 ? null : (
              <AvGroup inline name="m??nDistance" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>B??i ch???y c?? qu??ng ???????ng t???i thi???u &nbsp; &nbsp; </Label>
                <div>{Number((challengeEntity.challengeValidity.minDistance / 1000).toFixed(1))}</div>
                <text> &nbsp; (km)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.elevationGain === 0 ? null : (
              <AvGroup inline name="elevationGain" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>B??i ch???y c?? ????? cao ?????t ???????c (elevation gain) t???i thi???u &nbsp; &nbsp; </Label>
                <div>{Number(challengeEntity.challengeValidity.elevationGain)}</div>
                <text> &nbsp; (m)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.challengeValidity ? (
            challengeEntity.challengeValidity.avgCadenceFrom === 0 ? null : (
              <AvGroup inline name="avgCadence" className="form-group form-inline">
                <input type="checkbox" checked className="mr-2" />
                <Label>B??i ch???y c?? nh???p ch??n trung b??nh(avg cadence) &nbsp; &nbsp; T??? &nbsp;</Label>
                <div>{challengeEntity.challengeValidity.avgCadenceFrom}</div>
                <Label>&nbsp; - ?????n &nbsp; </Label>
                <div>{challengeEntity.challengeValidity.avgCadenceTo}</div>
                <text> &nbsp; (b?????c/ph??t)</text>
              </AvGroup>
            )
          ) : null}

          {challengeEntity.challengeValidity && challengeEntity.challengeValidity.gps === 1 && (
            <AvGroup inline name="isGps" className="form-group form-inline">
              <input type="checkbox" className="mr-2" checked />
              <Label>Ch??? ch???p nh???n c??c b??i t???p ngo??i tr???i d??ng GPS </Label>
            </AvGroup>
          )}
          <Row></Row>
          <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Ti??u ch?? ho??n th??nh:</text>
          <Row></Row>

          {challengeEntity.calType === 1
            ? 'C?? M???T L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??'
            : challengeEntity.calType === 2
            ? 'T???ng t??ch l??y C??C L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??'
            : ''}
          <Row></Row>
          <text style={{ fontWeight: 'bold' }}>Th??? t??? c??c ti??u ch?? x???p h???ng:</text>

          <AvGroup>
            <text>1. &nbsp;</text>
            <input type="checkbox" disabled checked className="mr-2" />
            <text>
              {' '}
              &nbsp;{' '}
              {challengeEntity.challengeValidity
                ? challengeEntity.challengeValidity.rankCriteria1 === 1
                  ? 'S??? km th???c hi???n nhi???u nh???t'
                  : challengeEntity.challengeValidity.rankCriteria1 === 2
                  ? 'Avg Pace th???p nh???t'
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
                  ? 'S??? km th???c hi???n nhi???u nh???t'
                  : challengeEntity.challengeValidity.rankCriteria2 === 2
                  ? 'Avg Pace th???p nh???t'
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
            <text> &nbsp; {'Avg HR th???p nh???t'}</text>
          </AvGroup>

          <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>3. C??i ?????t th??nh vi??n</h4>
          <Row>
            <Col xs="12" sm="6">
              <AvGroup className="form-group form-inline">
                <Label style={{ marginRight: '10px', fontWeight: 'bold' }} id="titleLabel" for="challenge-title">
                  S??? ng?????i tham gia: &nbsp; &nbsp;
                </Label>
                <div className="content">{challengeEntity.numOfParticipant}</div>
              </AvGroup>
            </Col>
          </Row>

          <AvGroup className="form-group">
            <Label>Ph???m vi :</Label>

            <AvRadioGroup name="objectType" value={challengeEntity.objectType}>
              <AvRadio style={{ textAlign: 'left' }} label="C??ng khai - M???i th??nh vi??n ?????u c?? th??? tham gia" value={Number('1')} />
              <AvRadio label="N???i b??? - Ch??? c?? th??nh vi??n c?? m?? ????ng k??, ???????c m???i, ???????c duy???t m???i c?? th??? tham gia" value={Number('2')} />
            </AvRadioGroup>
          </AvGroup>

          {challengeEntity.objectType === 2 ? <div className="content">{challengeEntity.code}</div> : null}

          <input type="checkbox" checked={challengeEntity.teams ? challengeEntity.teams.length > 0 : false} className="mr-2" />
          <Label>Thi ?????u theo nh??m</Label>
          <Row></Row>
          {challengeEntity.teams && challengeEntity.teams.length > 0 && (
            <AvGroup>
              &nbsp; &nbsp; <input type="checkbox" className="mr-2" />
              <Label>Gi???i h???n th??nh vi??n m???i nh??m: </Label>
              <text> &nbsp; &nbsp; {challengeEntity.numPerTeam}</text>
              <Row></Row>
              <AvGroup>
                <Row></Row>
                &nbsp; &nbsp;
                <text style={{ fontWeight: 'bold' }}>T??n nh??m:</text>
                {challengeEntity.teams.map((team, index) => (
                  <AvGroup key={index}>
                    <Label>
                      &nbsp; &nbsp; &nbsp; Nh??m {index + 1}: &nbsp; {team.name}
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
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay l???i</span>
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
  updating: challenge.updating,
});

const mapDispatchToProps = { getEntity, getActions, approveChallenge, endChallenge, cancelChallenge };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeDetail);
