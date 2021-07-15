import React, { useState, useEffect } from 'react';
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
} from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from 'app/shared/reducers';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { getEntity, updateEntity, createEntity, reset } from './challenge.reducer';
import { getEntity as getUser } from 'app/modules/users/users.reducer';
import {
  convertDateTimeFromServer,
  convertDateTimeToServer,
  displayDefaultDateTime,
  displayDefaultTimeStamp,
} from 'app/shared/util/date-utils';
import CreatableSelect from 'react-select/creatable';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { DownOutlined, DownSquareOutlined } from '@ant-design/icons';
import { update as updateWorkflow } from '../workflow/workflow-request.reducer';
import { getCustomer } from '../users/users.reducer';
import { ChallengeUserDialog } from './challenge-search-user-dialog';

export interface IChallengeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeUpdate = (props: IChallengeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const { challengeEntity, loading, updating } = props;

  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isGps, setIsGps] = useState(0);

  const [personal, setPersonal] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const setGps = () => {
    if (isGps === 0) {
      setIsGps(1);
    } else setIsGps(0);
  };

  const toggle = () => setIsOpen(!isOpen);
  const toggle2 = () => setIsOpen2(!isOpen2);
  const toggle3 = () => setIsOpen3(!isOpen3);

  const [objectType, setObjectType] = useState('0');

  const [teamAllow, setTeamAllow] = useState(false);
  const changeTeamAllow = () => setTeamAllow(!teamAllow);

  const [teamList, setTeamList] = useState([{ name: '' }]);
  const { state } = props.location;
  const [challengeDistanceList, setChallengeDistanceList] = useState([
    { distance: 0, isDisabled: false },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
  ]);
  const [distanceInputCount, setDistanceInputCount] = useState(0);

  class RedAsterisk extends React.Component {
    render() {
      return <text style={{ color: 'red' }}>&nbsp; *</text>;
    }
  }

  const [defaultOptions, setDefaultOptions] = useState([
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '300', value: '300' },
  ]);

  const [distanceValue, setDistanceValue] = useState([{ label: 'Chọn hoặc tự nhập', value: 0 }]);

  const [validityCriteria, setValidityCriteria] = useState([1, 2, 3]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [avgPace, setAvgPace] = useState({ from: 0, to: 0, isDisabled: false });
  const [minDistance, setMinDistance] = useState({ value: 0, isDisabled: false });
  const [elevationGain, setElevationGain] = useState({ value: 0, isDisabled: false });
  const [avgCadence, setAvgCadence] = useState({ from: 0, to: 0, isDisabled: false });
  // const

  const onEditorStateChange = editor => {
    setEditorState(editor);
  };

  const handleChallengeDistance = (e, i) => {
    const list = [...challengeDistanceList];
    list[i] = { distance: e.target.value, isDisabled: false };
    if (i < 4) list[i + 1] = { distance: 0, isDisabled: false };
    setChallengeDistanceList(list);
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...teamList];
    list[index][name] = value;
    setTeamList(list);
  };

  const handleRemoveClick = index => {
    const list = [...teamList];
    list.splice(index, 1);
    setTeamList(list);
  };

  const swapPosition = () => {
    const temp = [0, 0, 3];
    temp[0] = validityCriteria[1];
    temp[1] = validityCriteria[0];
    setValidityCriteria(temp);
  };

  const handleAddClick = () => {
    setTeamList([...teamList, { name: '' }]);
  };

  const handleClose = () => {
    props.history.push('entity/challenge' + props.location.search);
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

  useEffect(() => {
    if (challengeEntity.content)
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(challengeEntity.content))));

    if (challengeEntity.challengeDistance) {
      const list = [{ distance: 0, isDisabled: false }];
      challengeEntity.challengeDistance.map((challengeDistance, i) => {
        list[i] = { distance: challengeDistance.distance, isDisabled: false };
      });
      setChallengeDistanceList(list);
    }
    // if (challengeEntity.challengeDistance) {
    //   setChallengeDistanceList(challengeEntity.challengeDistance);
    //   challengeEntity.challengeDistance.map((distance, index) => {
    //     const distanceVar = {label: distance['distance'], value: Number(distance['distance'])};
    //     const list = [...distanceValue];
    //     list[index] = distanceVar;
    //     setDistanceValue(list);
    //   })
    // }
  }, [challengeEntity]);

  const saveEntity = (event, errors, values) => {
    values.challengeValidity.avgCadenceFrom = Number(values.challengeValidity.avgCadenceFrom);
    values.challengeValidity.avgCadenceTo = Number(values.challengeValidity.avgCadenceTo);
    values.challengeValidity.avgPaceFrom = Number(values.challengeValidity.avgPaceFrom);
    values.challengeValidity.avgPaceTo = Number(values.challengeValidity.avgPaceTo);
    values.challengeValidity.elevationGain = Number(values.challengeValidity.elevationGain);
    values.challengeValidity.completionCriteria = Number(values.challengeValidity.completionCriteria);
    values.challengeValidity.minDistance = Number(values.challengeValidity.minDistance);
    values.challengeValidity.gps = Number(values.challengeValidity.gps);
    values.dateStart = convertDateTimeToServer(values.dateStart);
    values.dateRegisDeadline = convertDateTimeToServer(values.dateRegisDeadline);
    values.dateFinish = convertDateTimeToServer(values.dateFinish);
    values.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // let availableDistance = 0;
    // values.challengeDistance.splice(availableDistance,values.challengeDistance.length - availableDistance -1);
    if (values.challengeValidity.checkTime === true) {
      values.challengeValidity.checkTime = 0;
    } else values.challengeValidity.checkTime = 1;
    if (errors.length === 0) {
      const entity = {
        ...challengeEntity,
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
      <ChallengeUserDialog
        onClose={() => {
          setShowModal(false);
        }}
        onChangeInput={event => setPersonal(event.target.value)}
        showModal={showModal}
        customer={props.customer}
        updateSuccess={props.updateWfSuccess}
        updateWorkflow={props.updateWorkflow}
        getCustomer={props.getCustomer}
        choose={email => {
          setEmailUser(email);
        }}
      />
      <Row className="justify-content-right">
        <Col md="6">
          {!isNew ? (
            <h2 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
              Thay đổi thử thách
            </h2>
          ) : (
            <h2 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
              Thêm mới thử thách
            </h2>
          )}
        </Col>
      </Row>

      <hr
        style={{
          backgroundColor: 'DodgerBlue',
          height: '2px',
        }}
      />

      <Row className="justify-content-right">
        <Col md="12">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : challengeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="challenge-id">ID</Label>
                  <AvInput id="challenge-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <Row style={{ paddingBottom: '40px' }}>
                <Col xs="12" sm="4">
                  <Button tag={Link} id="cancel-save" to="/challenges" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">Hủy</span>
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp; Lưu
                  </Button>
                </Col>
              </Row>

              <Row>
                <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>1. Thông tin chung</h4>
                <DownOutlined style={{ fontSize: '20px', paddingTop: '10px' }} onClick={toggle} />
              </Row>
              <Collapse isOpen={isOpen}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ marginRight: '10px' }}>Cá nhân tổ chức</Label>
                          <AvField id="challenge-userIdCreated" data-cy="challenge_type" type="string" name="userEmail" value={emailUser} />
                          <AvInput hidden name="userIdCreated" value={state ? state['userId'] : ''} />
                          <Button onClick={() => setShowModal(true)} replace color="primary">
                            <span className="d-none d-md-inline">Tìm</span>
                          </Button>
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="6">
                        <AvGroup className="form-group form-inline">
                          <Label>
                            Ảnh đại diện TT: <RedAsterisk />
                          </Label>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="5">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ marginRight: '10px' }} id="titleLabel" for="challenge-title">
                            Tên thử thách <RedAsterisk />
                          </Label>
                          <AvField
                            id="challenge-title"
                            data-cy="title"
                            type="text"
                            name="title"
                            validate={{
                              required: { value: true, errorMessage: 'This field is required.' },
                              minLength: {
                                value: 5,
                                errorMessage: 'This field is required to be at least 5 characters.',
                              },
                              maxLength: {
                                value: 200,
                                errorMessage: 'This field cannot be longer than 200 characters.',
                              },
                            }}
                          />
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="5">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ marginRight: '10px' }}>Gắn thẻ:</Label>
                          <AvInput name="challenge-tag" />
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="3">
                        <AvGroup className="form-group form-inline">
                          <Label hidden style={{ marginRight: '10px' }}>
                            Ban tổ chức khởi tạo
                          </Label>
                          <AvField
                            id="challenge-challengeType"
                            data-cy="challengeType"
                            hidden
                            type="radio"
                            name="challengeType"
                            required
                            defaultChecked
                            disabled
                            value="0"
                          />
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="4">
                        {/* <AvGroup>
                          <Label>
                            Thời gian bắt đầu
                            <RedAsterisk />
                          </Label>
                          <DateTime
                            data-cy="num_of_participant"
                            value={localState['dateStart']}
                            onChange={date => (localState['date_start'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                            initialValue={!isNew ? moment.utc(props.challengeEntity.dateStart).format(APP_TIMESTAMP_FORMAT) : null}
                            inputProps={{ name: 'dateStart', id: 'challenge-numOfParticipant', required: true }}
                            dateFormat="DD/MM/YYYY"
                            timeFormat="HH:mm:ss"
                            closeOnSelect={true}
                          />
                        </AvGroup> */}
                        <AvGroup>
                          <Label id="dateStartLabel" for="challenge-dateStart">
                            Thời gian bắt đầu
                          </Label>
                          <AvInput
                            id="challenge-dateStart"
                            data-cy="dateStart"
                            type="datetime-local"
                            className="form-control"
                            name="dateStart"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            value={isNew ? displayDefaultTimeStamp() : convertDateTimeFromServer(props.challengeEntity.dateStart)}
                            validate={{
                              required: { value: true, errorMessage: 'This field is required.' },
                            }}
                          />
                        </AvGroup>
                      </Col>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label id="dateFinishLabel" for="challenge-dateFinish">
                            Thời gian kết thúc
                          </Label>
                          <AvInput
                            id="challenge-dateFinish"
                            data-cy="dateFinish"
                            type="datetime-local"
                            className="form-control"
                            name="dateFinish"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            value={isNew ? displayDefaultTimeStamp() : convertDateTimeFromServer(props.challengeEntity.dateFinish)}
                            validate={{
                              required: { value: true, errorMessage: 'This field is required.' },
                            }}
                          />
                        </AvGroup>
                      </Col>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label id="dateFinishLabel" for="challenge-dateRegisDeadline">
                            Hạn đăng kí
                          </Label>
                          <AvInput
                            id="challenge-dateRegisDeadline"
                            data-cy="dateRegisDeadline"
                            type="datetime-local"
                            className="form-control"
                            name="dateRegisDeadline"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            value={isNew ? displayDefaultTimeStamp() : convertDateTimeFromServer(props.challengeEntity.dateRegisDeadline)}
                            validate={{
                              required: { value: true, errorMessage: 'This field is required.' },
                            }}
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                    <Label id="contentLabel" for="news-content">
                      Nội dung:
                    </Label>
                    <AvField hidden id="news-content" data-cy="content" type="text" name="content" />
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={onEditorStateChange}
                      wrapperStyle={{ textDecoration: 'none !important' }}
                      editorStyle={{ border: '1px gainsboro solid', borderRadius: '2px', height: '250px' }}
                    />
                    {!editorState.getCurrentContent().hasText() && <p className="invalid-feedback">Không được để trống.</p>}
                  </CardBody>
                </Card>
              </Collapse>

              <Row>
                <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>2. Cài đặt tiêu chí</h4>
                <DownOutlined style={{ fontSize: '20px', paddingTop: '10px' }} onClick={toggle2} />
              </Row>
              <Collapse isOpen={isOpen2}>
                <Card>
                  <CardBody>
                    <Row className="justify-content-left">
                      <Col xs="12" sm="6">
                        <AvGroup>
                          <AvField id="challenge_sport" type="select" name="sport.name" label="Bộ môn">
                            <option>Run</option>
                            <option>Ride</option>
                          </AvField>
                          <AvField hidden name="sport.id" type="text" value="1"></AvField>
                          {isNew ? null : <AvField hidden name="challengeValidity.id" value={challengeEntity.id} />}
                        </AvGroup>
                      </Col>
                    </Row>
                    <AvRadioGroup name="calType" label="Cách tính thành tích" required>
                      <AvRadio label="Có MỘT LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value="1" />
                      <AvRadio label="Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value="2" />
                    </AvRadioGroup>

                    <Row>
                      <Col xs="12" sm="6">
                        <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                          Hạng mục(Cho phép nhập trực tiếp quãng đường với đơn vị là Km){' '}
                        </text>
                      </Col>
                    </Row>

                    <Row>
                      {challengeDistanceList.map((distance, i) => (
                        <Col xs="12" sm="6" key={i}>
                          <AvGroup className="form-group">
                            <Label style={{ marginRight: '10px' }}>
                              Hạng mục {i + 1}:<RedAsterisk />
                            </Label>
                            <AvField
                              type="number"
                              name={'distanceInput' + i}
                              disabled={false}
                              // disabled={challengeDistanceList[i].isDisabled}
                              onChange={e => {
                                handleChallengeDistance(e, i);
                              }}
                              value={challengeDistanceList[i] ? challengeDistanceList[i].distance : 0}
                              validate={{
                                required: {
                                  value: i === 0,
                                  errorMessage: 'Không được để trống',
                                },
                                min: {
                                  value: challengeDistanceList[i - 1] ? challengeDistanceList[i - 1].distance : 0,
                                  errorMessage: 'Giá trị cần lớn hơn hạng mục trước',
                                },
                              }}
                            />
                          </AvGroup>
                          {challengeDistanceList[i] && Number(challengeDistanceList[i].distance) > 0 ? (
                            <AvGroup>
                              <AvField
                                type="input"
                                hidden
                                name={'challengeDistance[' + i + '].distance'}
                                value={challengeDistanceList[i] ? challengeDistanceList[i].distance : 0}
                              />
                              <AvField type="input" hidden name={'challengeDistance[' + i + '].orderId'} value={i + 1} />
                            </AvGroup>
                          ) : null}
                        </Col>
                      ))}
                    </Row>

                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hợp lệ</text>
                    <Row></Row>
                    {/* <text style={{ color: 'blueviolet' }}>
                      Thời gian bắt đầu diễn ra thử thách từ thời gian bắt đầu tới thời gian kết thúc
                    </text> */}

                    <AvField
                      type="checkbox"
                      disabled
                      check
                      name="challengeValidity.checkTime"
                      label=" Thời gian bắt đầu diễn ra thử thách từ thời gian bắt đầu tới thời gian kết thúc"
                      value={true}
                    />

                    <AvGroup></AvGroup>
                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup inline name="validation_list" className="form-group form-inline">
                          <input
                            type="checkbox"
                            checked
                            disabled
                            className="mr-2"
                            onChange={() => setAvgPace({ from: 0, to: 0, isDisabled: !avgPace.isDisabled })}
                          />
                          <AvField
                            label="Bài chạy có tốc độ trung bình(avg pace) &nbsp; &nbsp;  Từ &nbsp;"
                            id="challengeValidity.avgPaceFrom"
                            // defaultValue="3.0"
                            data-cy="challengeValidity.avgPaceFrom"
                            type="number"
                            step="1"
                            min="0"
                            max="20"
                            className="form-control"
                            value={avgPace.from}
                            disabled={avgPace.isDisabled}
                            onChange={event => {
                              const avgpace = {
                                from: event.target.value,
                                to: avgPace.to,
                                isDisabled: avgPace.isDisabled,
                              };
                              setAvgPace(avgpace);
                            }}
                            name="challengeValidity.avgPaceFrom"
                          />

                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_pace_to"
                            // defaultValue="12.0"
                            data-cy="challengeValidity.avg_pace_to"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            className="form-control"
                            value={avgPace.to}
                            disabled={avgPace.isDisabled}
                            onChange={event => {
                              const avgpace = {
                                from: avgPace.from,
                                to: event.target.value,
                                isDisabled: avgPace.isDisabled,
                              };
                              setAvgPace(avgpace);
                            }}
                            name="challengeValidity.avgPaceTo"
                          />
                          <text> &nbsp; (phút/km)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={!minDistance.isDisabled}
                            onChange={() => setMinDistance({ value: 0, isDisabled: !minDistance.isDisabled })}
                          />
                          <AvField
                            label="Bài chạy có quãng đường tối thiểu &nbsp; &nbsp;"
                            id="challenge-validity_min_distance"
                            data-cy="challengeValidity.minDistance"
                            type="number"
                            disabled={minDistance.isDisabled}
                            step="0.1"
                            min="1"
                            max="50"
                            className="form-control"
                            name="challengeValidity.minDistance"
                          />

                          <text> &nbsp; (km)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={!elevationGain.isDisabled}
                            onChange={() => setElevationGain({ value: 0, isDisabled: !elevationGain.isDisabled })}
                          />
                          <AvField
                            label="Bài chạy có độ cao đạt được (elevation gain) tối thiểu: &nbsp; &nbsp;"
                            id="challenge-validity_elevation_gain"
                            data-cy="challengeValidity.elevationGain"
                            disabled={elevationGain.isDisabled}
                            type="number"
                            step="0.1"
                            min="1"
                            max="50"
                            className="form-control"
                            name="challengeValidity.elevationGain"
                          />

                          <text> &nbsp; (m)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={!avgCadence.isDisabled}
                            onChange={() => setAvgCadence({ from: 0, to: 0, isDisabled: !avgCadence.isDisabled })}
                          />
                          <AvField
                            label="Bài chạy có nhịp chân trung bình(avg cadence) &nbsp; &nbsp;  Từ &nbsp;"
                            id="challenge-validity_avgCadenceFrom"
                            // defaultValue="50"
                            data-cy="validity.avgCadenceFrom"
                            type="number"
                            disabled={avgCadence.isDisabled}
                            step="1"
                            min="10"
                            max="300"
                            className="form-control"
                            name="challengeValidity.avgCadenceFrom"
                          />
                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_cadence_to"
                            disabled={avgCadence.isDisabled}
                            data-cy="challenge_validity.avg_cadence_to"
                            type="number"
                            step="1"
                            min="10"
                            max="300"
                            className="form-control"
                            name="challengeValidity.avgCadenceTo"
                          />
                          <text> &nbsp; (bước/phút)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            type="checkbox"
                            name="challenge_check"
                            label="Chỉ chấp nhận các bài tập ngoài trời dùng GPS"
                            className="mr-2"
                            onChange={setGps}
                          />
                          <AvField name="challengeValidity.gps" value={isGps} hidden />
                          <AvField name="challengeValidity.completionCriteria" value="3" hidden />
                        </AvGroup>
                      </Col>
                    </Row>
                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hoàn thành</text>
                    <Row></Row>
                    <text style={{ color: 'blueviolet' }}>Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký</text>
                    <Row style={{ paddingBottom: '10px' }}></Row>
                    <text style={{ fontWeight: 'bold' }}> Thứ tự các tiêu chí xếp hạng:</text>

                    {validityCriteria.map((criteria, index) => (
                      <Row className="justify-content-right" key={index}>
                        <Col xs="12" sm="7">
                          <AvGroup className="form-group form-inline">
                            <input type="checkbox" disabled defaultChecked={criteria !== 3} className="mr-1" />
                            <AvField
                              type="string"
                              name={'challengeValidity.rankCriteria' + (index + 1)}
                              disabled
                              style={{ width: '250px' }}
                              value={
                                criteria === 1
                                  ? 'Số km thực hiện nhiều nhất'
                                  : criteria === 2
                                  ? 'Avg Pace thấp nhất'
                                  : criteria === 3
                                  ? 'Avg HR thấp nhất'
                                  : ''
                              }
                            />
                            <AvInput hidden name={'challengeValidity.rankCriteria' + (index + 1)} value={criteria} />
                            {index !== 2 ? <Button onClick={swapPosition}> Đổi </Button> : null}
                          </AvGroup>
                        </Col>
                      </Row>
                    ))}
                  </CardBody>
                </Card>
              </Collapse>

              <Row>
                <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>3. Cài đặt thành viên</h4>
                <DownOutlined style={{ fontSize: '20px', paddingTop: '10px' }} onClick={toggle3} />
              </Row>
              <Collapse isOpen={isOpen3}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="5">
                        <Row>
                          <AvGroup className="form-group">
                            <Label id="titleLabel" for="challenge-title">
                              Số người tham gia <RedAsterisk />
                            </Label>
                            <AvField
                              id="challenge-num_of_participant"
                              data-cy="num_of_participant"
                              type="string"
                              className="form-control"
                              name="numOfParticipant"
                            />
                          </AvGroup>
                        </Row>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="8">
                        <Row className="form-group">
                          <Label>
                            Phạm vi tham gia:
                            <RedAsterisk /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                          </Label>
                          <AvRadioGroup name="objectType" required>
                            <AvRadio style={{ textAlign: 'left' }} label="Công khai - Mọi thành viên đều có thể tham gia" value="1" />
                            <AvRadio
                              label="Nội bộ - Chỉ có thành viên có mã đăng ký, được mời, được duyệt mới có thể tham gia"
                              value="2"
                              onChange={event => {
                                setObjectType(event.target.value);
                              }}
                            />
                            {objectType === '2' ? (
                              <Col xs="12" sm="8">
                                <Row style={{ paddingTop: '6px' }}>
                                  <label>
                                    Mã đăng kí
                                    <RedAsterisk /> &nbsp;
                                  </label>
                                  <AvField type="text" name="code" />
                                </Row>
                              </Col>
                            ) : null}
                          </AvRadioGroup>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <AvCheckboxGroup name="teamAllow">
                        <AvCheckbox label="Thi đấu theo nhóm" onChange={changeTeamAllow}></AvCheckbox>
                      </AvCheckboxGroup>
                    </Row>

                    {/* {teamAllow === true
                        ?

                        : null
                      } */}

                    {/* <AvGroup>
                      <Label id="datePublishedLabel" for="news-datePublished">
                        Date Published
                      </Label>
                      <AvInput
                        id="news-datePublished"
                        data-cy="datePublished"
                        type="datetime-local"
                        className="form-control"
                        name="datePublished"
                        placeholder={'YYYY-MM-DD HH:mm'}
                        value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.newsEntity.datePublished)}
                        validate={{
                          required: { value: true, errorMessage: 'This field is required.' },
                        }}
                      />
                    </AvGroup> */}

                    {teamAllow === true ? (
                      <AvGroup className="form-group">
                        <Row>
                          <Col xs="12" sm="2">
                            <Label>
                              Giới hạn thành viên:
                              <RedAsterisk />
                            </Label>
                          </Col>
                          <Col xs="12" sm="2">
                            <AvInput style={{ paddingLeft: '6px' }} type="number" name="numPerTeam" step="1" min="1" />
                          </Col>
                        </Row>

                        <Row style={{ marginTop: '30px' }}>
                          <Col xs="12" sm="2">
                            <Label for="teams">
                              Tên nhóm:
                              <RedAsterisk />
                            </Label>
                          </Col>
                          <Col xs="12" sm="4">
                            {teamList.map((team, i) => (
                              <AvGroup key={i} className="form-inline">
                                <AvInput
                                  type="string"
                                  className="form-control"
                                  name={'teams' + '[' + i + ']' + '.name'}
                                  placeholder={'Nhóm' + ' ' + (+i + +1)}
                                  value={team.name}
                                  required
                                  onChange={event => handleInputChange(event, i)}
                                >
                                  team.name{' '}
                                </AvInput>
                                {teamList.length !== 1 && (
                                  <Button onClick={() => handleRemoveClick(i)}>
                                    {' '}
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </AvGroup>
                            ))}
                            <Button onClick={handleAddClick} style={{ fontSize: '16px' }}>
                              <FontAwesomeIcon icon="plus" size="1x" />
                              &nbsp; Thêm nhóm
                            </Button>
                          </Col>
                        </Row>
                      </AvGroup>
                    ) : null}
                  </CardBody>
                </Card>
              </Collapse>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  challengeEntity: storeState.challenge.entity,
  loading: storeState.challenge.loading,
  updating: storeState.challenge.updating,
  updateSuccess: storeState.challenge.updateSuccess,
  customer: storeState.users.entity,
  updateWfSuccess: storeState.wfRequest.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  getUser,
  updateWorkflow,
  getCustomer,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUpdate);
