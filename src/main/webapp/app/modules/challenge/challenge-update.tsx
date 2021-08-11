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
import { reset as resetUploadImage } from '../upload-image/upload-image-reducer';
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
import { UploadImageInput } from '../upload-image/upload-image';
import { uploadImage } from '../upload-image/upload-image-reducer';
import challenge from 'app/modules/challenge/challenge';

export interface IChallengeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeUpdate = (props: IChallengeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const { challengeEntity, loading, updating } = props;

  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isGps, setIsGps] = useState(0);

  const [isOrganization, setIsOrganization] = useState(-1);

  const [userIdCreated, setUserIdCreated] = useState(0);
  const [emailUser, setEmailUser] = useState('');
  const [calValue, setCalValue] = useState(0);
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

  const [dateStart, setDateStart] = useState('');
  const [dateFinish, setDateFinish] = useState('');
  const [dateRegisDeadline, setDateRegisDeadline] = useState('');

  const [teamList, setTeamList] = useState([{ name: '' }]);
  const { state } = props.location;
  const [challengeDistanceList, setChallengeDistanceList] = useState([
    { distance: 0, isDisabled: false },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
    { distance: 0, isDisabled: true },
  ]);

  const compare = (a, b) => {
    return Number(a.orderId) - Number(b.orderId);
  };
  const [distanceInputCount, setDistanceInputCount] = useState(0);
  const [criteria3Checked, setCriteria3Checked] = useState(false);

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
  const [editorChanged, setEditorChanged] = useState(false);
  const [editorError, setEditorErrorState] = useState(false);
  const [updatedEntity, setUpdatedEntity] = useState(challengeEntity);

  const [avgPace, setAvgPace] = useState({ from: '4.0', to: '15.0', required: true });
  const [minDistance, setMinDistance] = useState({ value: '1.0', required: false });
  const [elevationGain, setElevationGain] = useState({ value: '100', required: false });
  const [avgCadence, setAvgCadence] = useState({ from: '50', to: '200', required: false });
  // const

  const onEditorStateChange = editor => {
    setEditorState(editor);
    setEditorChanged(true);
    setEditorErrorState(!editorState.getCurrentContent().hasText());
    setEditorState(editor);
  };

  const handleChallengeDistance = (e, i) => {
    const list = [...challengeDistanceList];
    list[i] = { distance: e.target.value, isDisabled: false };
    if (i < 4) list[i + 1] = { distance: challengeDistanceList[i + 1] ? challengeDistanceList[i + 1].distance : 0, isDisabled: false };
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
    props.history.goBack();
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
    if (challengeEntity.content && !isNew)
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(challengeEntity.content))));

    const entity = Object.assign({}, challengeEntity);
    if (entity.challengeDistance) {
      entity.challengeDistance.map((entityDistance, index) => {
        entityDistance.distance = entityDistance.distance / 1000;
      });
    }
    setUpdatedEntity(entity);

    if (challengeEntity.challengeDistance && !isNew) {
      const list = [{ distance: 0, isDisabled: false }];
      challengeEntity.challengeDistance.map((challengeDistance, i) => {
        list[i] = { distance: challengeDistance.distance, isDisabled: false };
      });
      list.sort(compare);
      setChallengeDistanceList(list);
    }

    if (challengeEntity.challengeValidity && !isNew) {
      setAvgPace({
        from: challengeEntity.challengeValidity.avgPaceFrom.toString(),
        to: challengeEntity.challengeValidity.avgPaceTo.toString(),
        required: avgPace.required,
      });

      setMinDistance({
        value: (challengeEntity.challengeValidity.minDistance / 1000).toString(),
        required: minDistance.required,
      });

      setElevationGain({
        value: challengeEntity.challengeValidity.elevationGain.toString(),
        required: elevationGain.required,
      });

      setAvgCadence({
        from: challengeEntity.challengeValidity.avgCadenceFrom.toString(),
        to: challengeEntity.challengeValidity.avgCadenceTo.toString(),
        required: avgCadence.required,
      });
    }

    if (challengeEntity.teams && challengeEntity.teams.length > 0 && !isNew) {
      setTeamAllow(true);
      const list = [{ name: '' }];
      challengeEntity.teams.map((team, index) => {
        list[index] = { name: team.name };
      });
      setTeamList(list);
    }
  }, [challengeEntity]);

  const saveEntity = (event, errors, values) => {
    values.challengeValidity.avgPaceFrom = Number(values.challengeValidity.avgPaceFrom);
    values.challengeValidity.avgPaceTo = Number(values.challengeValidity.avgPaceTo);

    if (avgCadence.required) {
      values.challengeValidity.avgCadenceFrom = Number(values.challengeValidity.avgCadenceFrom);
      values.challengeValidity.avgCadenceTo = Number(values.challengeValidity.avgCadenceTo);
    } else {
      values.challengeValidity.avgCadenceFrom = 0;
      values.challengeValidity.avgCadenceTo = 0;
    }

    if (elevationGain.required) {
      values.challengeValidity.elevationGain = Number(values.challengeValidity.elevationGain);
    } else {
      values.challengeValidity.elevationGain = 0;
    }
    values.challengeValidity.completionCriteria = Number(values.challengeValidity.completionCriteria);
    if (minDistance.required) {
      values.challengeValidity.minDistance = Number(values.challengeValidity.minDistance) * 1000;
    } else {
      values.challengeValidity.minDistance = 0;
    }

    values.challengeValidity.rankCriteria3 = Number(values.challengeValidity.rankCriteria3);
    values.challengeValidity.gps = Number(values.challengeValidity.gps);

    values.dateStart = convertDateTimeToServer(values.dateStart);
    values.dateRegisDeadline = convertDateTimeToServer(values.dateRegisDeadline);
    values.dateFinish = convertDateTimeToServer(values.dateFinish);
    values.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    values.challengeDistance.map((challengeDistance, i) => {
      challengeDistance.distance = challengeDistance.distance * 1000;
    });
    if (values.challengeValidity.checkTime === true) {
      values.challengeValidity.checkTime = 0;
    } else values.challengeValidity.checkTime = 1;

    if (!teamAllow) {
      values.teams = [];
      values.numPerTeam = undefined;
    }

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
        showModal={showModal}
        customers={props.customers}
        updateSuccess={props.updateWfSuccess}
        updateWorkflow={props.updateWorkflow}
        getCustomer={props.getCustomer}
        choose={(email, userId) => {
          setEmailUser(email);
          setUserIdCreated(userId);
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
            <AvForm model={isNew ? {} : updatedEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="challenge-id">ID</Label>
                  <AvInput id="challenge-id" type="text" className="form-control" name="id" value={challengeEntity.id} required readOnly />
                </AvGroup>
              ) : null}

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
                          <Label style={{ paddingRight: '10px' }}> Người tạo</Label>
                          <AvField
                            id="challenge_type"
                            type="select"
                            name="challengeType"
                            onChange={event => {
                              event.target.value === '1' ? setIsOrganization(1) : event.target.value === '0' ? setIsOrganization(0) : {};
                            }}
                            validate={{
                              required: { value: true, errorMessage: 'Không được bỏ trống' },
                            }}
                          >
                            <option></option>
                            <option value="1">Cá nhân</option>
                            <option value="0">Ban tổ chức</option>
                          </AvField>
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="6">
                        {isOrganization === 1 ? (
                          <AvGroup className="form-group form-inline">
                            <Label style={{ marginRight: '10px' }}>Cá nhân tổ chức</Label>
                            <AvField
                              disabled
                              id="challenge-userIdCreated"
                              data-cy="challenge_type"
                              type="string"
                              name="userEmail"
                              value={emailUser}
                            />
                            <AvInput hidden name="userIdCreated" value={userIdCreated} />
                            <Button onClick={() => setShowModal(true)} replace color="primary">
                              <span className="d-none d-md-inline">Tìm</span>
                            </Button>
                          </AvGroup>
                        ) : isOrganization === 0 ? (
                          <AvGroup className="form-group form-inline">
                            <Label style={{ marginRight: '10px' }}>Ban tổ chức</Label>
                            <AvInput defaultValue="Foxsteps" name="organizationName" />
                          </AvGroup>
                        ) : null}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="6">
                        <UploadImageInput
                          entity={props.uploadImageEntity}
                          upload={props.uploadImage}
                          loading={props.loading}
                          initImage={isNew ? null : challengeEntity.imgUrl}
                          label="Ảnh đại diện TT: "
                          reset={props.resetUploadImage}
                          required={isNew ? true : !challengeEntity.imgUrl}
                        />
                        <AvField
                          hidden
                          name="imgUrl"
                          value={isNew ? props.uploadImageEntity.url : challengeEntity.imgUrl}
                          validate={{
                            required: { value: true, errorMessage: 'Ảnh chưa cập nhật thành công' },
                          }}
                        />
                        {/*add feedback for not upload image*/}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="6">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ marginRight: '10px' }} id="titleLabel" for="challenge-title">
                            Tên thử thách <RedAsterisk />
                          </Label>
                          <AvField
                            id="challenge-title"
                            data-cy="title"
                            type="text"
                            name="title"
                            value={challengeEntity && !isNew ? challengeEntity.title : ''}
                            validate={{
                              required: { value: true, errorMessage: 'Không được bỏ trống' },
                              minLength: {
                                value: 5,
                                errorMessage: 'Cần ít nhất 5 kí tự',
                              },
                              maxLength: {
                                value: 200,
                                errorMessage: 'Không được nhiều hơn 200 kí tự',
                              },
                            }}
                          />
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="6">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ marginRight: '10px' }}>Gắn thẻ:</Label>
                          <AvInput name="challenge-tag" />
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label id="dateStartLabel" for="challenge-dateStart">
                            Từ ngày
                          </Label>
                          <AvInput
                            id="challenge-dateStart"
                            data-cy="dateStart"
                            type="datetime-local"
                            className="form-control"
                            name="dateStart"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            value={isNew ? displayDefaultTimeStamp() : convertDateTimeFromServer(props.challengeEntity.dateStart)}
                            onChange={event => {
                              setDateStart(event.target.value);
                            }}
                            validate={{
                              required: { value: true, errorMessage: 'Không được bỏ trống' },
                            }}
                          />
                        </AvGroup>
                      </Col>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label id="dateFinishLabel" for="challenge-dateFinish">
                            Đến ngày
                          </Label>
                          <AvInput
                            id="challenge-dateFinish"
                            data-cy="dateFinish"
                            type="datetime-local"
                            placeholder={'YYYY-MM-DD HH:mm'}
                            className="form-control"
                            name="dateFinish"
                            onChange={event => {
                              setDateFinish(event.target.value);
                            }}
                            value={isNew ? displayDefaultTimeStamp() : convertDateTimeFromServer(props.challengeEntity.dateFinish)}
                          />
                          {convertDateTimeFromServer(dateFinish) < convertDateTimeFromServer(dateStart) && (
                            <p className="invalid-feedback">Giá trị đến phải lớn hơn giá trị từ</p>
                          )}
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
                            onChange={event => {
                              setDateRegisDeadline(event.target.value);
                            }}
                            validate={{
                              required: { value: true, errorMessage: 'Không được bỏ trống' },
                            }}
                          />
                          {convertDateTimeFromServer(dateFinish) < convertDateTimeFromServer(dateRegisDeadline) && (
                            <p className="invalid-feedback">Hạn đăng kí phải nhỏ hơn ngày kết thúc</p>
                          )}
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
                      toolbar={{
                        options: [
                          'inline',
                          'blockType',
                          'fontSize',
                          'list',
                          'textAlign',
                          'colorPicker',
                          'link',
                          'embedded',
                          'emoji',
                          'image',
                          'remove',
                          'history',
                        ],
                      }}
                    />
                    {editorChanged && editorError && <p className="invalid-feedback">Không được để trống.</p>}
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
                          <AvField
                            id="challenge_sport"
                            type="select"
                            name="sport.name"
                            label="Bộ môn"
                            // disabled = {!isNew && ([1,12].includes(challengeEntity.status)) }
                          >
                            <option>Chạy bộ</option>
                          </AvField>
                          <AvField hidden name="sport.id" type="text" value="1"></AvField>
                          {isNew ? null : <AvField hidden name="challengeValidity.id" value={challengeEntity.id} />}
                        </AvGroup>
                      </Col>
                    </Row>
                    <AvRadioGroup
                      name="calType"
                      label="Cách tính thành tích"
                      // disabled = {!isNew && ([1,12].includes(challengeEntity.status)) }
                      onChange={event => {
                        setCalValue(Number(event.target.value));
                        if (Number(event.target.value) === 1 && !isNew) {
                          setChallengeDistanceList(challengeDistanceList.slice(0, 1));
                        }
                      }}
                      value={challengeEntity.calType}
                      validate={{
                        required: { value: true, errorMessage: 'Giá trị bắt buộc' },
                      }}
                    >
                      <AvRadio label="Có MỘT LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value={1} />
                      <AvRadio label="Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value={2} />
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
                              {i === 0 ? (
                                <div>
                                  Hạng mục {i + 1}: <RedAsterisk />
                                </div>
                              ) : (
                                <div>Hạng mục {i + 1}:</div>
                              )}
                            </Label>
                            <AvField
                              type="number"
                              step="1"
                              name={'distanceInput' + i}
                              onChange={e => {
                                handleChallengeDistance(e, i);
                              }}
                              // disabled = {!isNew && ([1,12].includes(challengeEntity.status)) }
                              value={challengeDistanceList[i].distance}
                              validate={{
                                required: {
                                  value:
                                    i === 0 || (i < 4 && challengeDistanceList[i + 1] && Number(challengeDistanceList[i + 1].distance) > 0),
                                  errorMessage: 'Không được để trống',
                                },
                                min: {
                                  value: challengeDistanceList[i - 1] ? Number(challengeDistanceList[i - 1].distance) + 1 : 0,
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
                            // onChange={() => setAvgPace({ from: avgPace.from, to: avgPace.to, required: !avgPace.required })}
                          />
                          <Label>Bài chạy có tốc độ trung bình(avg pace) &nbsp; &nbsp;</Label>
                          <AvField
                            id="challengeValidity.avgPaceFrom"
                            label=" Từ &nbsp;"
                            type="number"
                            step="0.1"
                            min="0.0"
                            max="99.0"
                            className="form-control"
                            value={avgPace.from}
                            onChange={event => {
                              const avgpace = {
                                from: event.target.value,
                                to: avgPace.to,
                                required: avgPace.required,
                              };
                              setAvgPace(avgpace);
                            }}
                            name="challengeValidity.avgPaceFrom"
                            validate={{
                              required: { value: avgPace.required, errorMessage: 'Không được để trống' },
                            }}
                          />

                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_pace_to"
                            type="number"
                            step="0.1"
                            min="0.0"
                            max="99.0"
                            className="form-control"
                            value={avgPace.to}
                            onChange={event => {
                              const avgpace = {
                                from: avgPace.from,
                                to: event.target.value,
                                required: avgPace.required,
                              };
                              setAvgPace(avgpace);
                            }}
                            name="challengeValidity.avgPaceTo"
                            validate={{
                              required: { value: true, errorMessage: 'Không được để trống' },
                              min: { value: avgPace.from, errorMessage: 'Giá trị từ không thể lớn hơn giá trị đến ' },
                            }}
                          />
                          <text> &nbsp; (phút/km)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <Label id="minDistanceLabel" for="challenge-validity_min_distance">
                            <input
                              type="checkbox"
                              className="mr-2"
                              onChange={() =>
                                setMinDistance({
                                  value: minDistance.value,
                                  required: !minDistance.required,
                                })
                              }
                            />
                            Bài chạy có quãng đường tối thiểu &nbsp; &nbsp;
                          </Label>
                          <AvField
                            label=""
                            id="challenge-validity_min_distance"
                            data-cy="challengeValidity.minDistance"
                            type="number"
                            disabled={calValue === 1 ? true : false}
                            value={calValue === 1 ? challengeDistanceList[0].distance : minDistance.value}
                            step="0.1"
                            min="0.0"
                            max="300.0"
                            className="form-control"
                            name="challengeValidity.minDistance"
                            validate={{
                              required: { value: minDistance.required, errorMessage: 'Không để trống' },
                            }}
                          ></AvField>
                          {/*<Label> &nbsp; (km)</Label>*/}
                          {minDistance.value === '' && <p className="invalid-feedback">Không được để trống.</p>}
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={() =>
                              setElevationGain({
                                value: elevationGain.value,
                                required: !elevationGain.required,
                              })
                            }
                          />
                          <AvField
                            label="Bài chạy có độ cao đạt được (elevation gain) tối thiểu: &nbsp; &nbsp;"
                            type="number"
                            step="0.1"
                            min="0.0"
                            max="300.0"
                            value={elevationGain.value}
                            className="form-control"
                            name="challengeValidity.elevationGain"
                            validate={{
                              required: { value: elevationGain.required, errorMessage: 'Không được để trống' },
                            }}
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
                            onChange={() =>
                              setAvgCadence({
                                from: avgCadence.from,
                                to: avgCadence.to,
                                required: !avgCadence.required,
                              })
                            }
                          />
                          <AvField
                            label="Bài chạy có nhịp chân trung bình(avg cadence) &nbsp; &nbsp;  Từ &nbsp;"
                            id="challenge-validity_avgCadenceFrom"
                            data-cy="validity.avgCadenceFrom"
                            type="number"
                            value={avgCadence.from}
                            step="1"
                            min="0"
                            max="300"
                            className="form-control"
                            name="challengeValidity.avgCadenceFrom"
                            validate={{
                              required: { value: avgCadence.required, errorMessage: 'Không được để trống' },
                            }}
                          />
                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_cadence_to"
                            data-cy="challenge_validity.avg_cadence_to"
                            value={avgCadence.to}
                            type="number"
                            step="1"
                            min="0"
                            max="300"
                            className="form-control"
                            name="challengeValidity.avgCadenceTo"
                            validate={{
                              required: { value: avgCadence.required, errorMessage: 'Không được để trống' },
                              min: { value: avgCadence.from, errorMessage: 'Giá trị đến không thể nhỏ hơn giá trị từ' },
                            }}
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
                            <input
                              type="checkbox"
                              disabled={criteria !== 3}
                              defaultChecked={criteria !== 3}
                              onChange={() => setCriteria3Checked(!criteria3Checked)}
                              className="mr-1"
                            />
                            <AvField
                              type="string"
                              name={'rankCriteria' + (index + 1)}
                              disabled={criteria !== 3}
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
                            <AvField
                              type="number"
                              hidden
                              name={'challengeValidity.rankCriteria' + (index + 1)}
                              value={criteria === 3 ? (!criteria3Checked ? '0' : '3') : Number(criteria)}
                            />
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
                              type="number"
                              step="1"
                              className="form-control"
                              name="numOfParticipant"
                              validate={{
                                required: {
                                  value: true,
                                  errorMessage: 'Không được bỏ trống ',
                                },
                                max: {
                                  value: 100,
                                  errorMessage:
                                    'Tối đa 100 thành viên đối với thử thách từ cá nhân. Để tạo thử thách với số lượng thành viên lớn hơn, vui lòng liên hệ 19006600',
                                },
                              }}
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

                          <AvRadioGroup
                            name="objectType"
                            onChange={event => {
                              setObjectType(event.target.value);
                            }}
                            defaultValue="1"
                            validate={{
                              required: {
                                value: true,
                                errorMessage: 'Không được bỏ trống ',
                              },
                            }}
                          >
                            <AvRadio style={{ textAlign: 'left' }} label="Công khai - Mọi thành viên đều có thể tham gia" value="1" />
                            <AvRadio label="Nội bộ - Chỉ có thành viên có mã đăng ký, được mời, được duyệt mới có thể tham gia" value="2" />
                          </AvRadioGroup>
                          {objectType === '2' ? (
                            <Col xs="12" sm="8">
                              <Row style={{ paddingTop: '6px' }}>
                                <label>
                                  Mã đăng kí
                                  <RedAsterisk /> &nbsp;
                                </label>
                                <AvField
                                  type="text"
                                  name="code"
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: 'Không được bỏ trống ',
                                    },
                                  }}
                                />
                              </Row>
                            </Col>
                          ) : null}
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <AvCheckboxGroup name="teamAllow">
                        <AvCheckbox label="Thi đấu theo nhóm" checked={teamAllow} onChange={changeTeamAllow}></AvCheckbox>
                      </AvCheckboxGroup>
                    </Row>

                    {teamAllow === true ? (
                      <AvGroup className="form-group">
                        <Row>
                          <Col xs="12" sm="2">
                            <Label>Giới hạn thành viên:</Label>
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
                                  validate={{
                                    required: { value: true, errorMessage: 'Không được bỏ trống' },
                                  }}
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
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  uploadImageEntity: storeState.uploadImage.entity,
  uploadImageLoading: storeState.uploadImage.loading,
  challengeEntity: storeState.challenge.entity,
  loading: storeState.challenge.loading,
  updating: storeState.challenge.updating,
  updateSuccess: storeState.challenge.updateSuccess,
  customers: storeState.users.entities,
  updateWfSuccess: storeState.wfRequest.updateSuccess,
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
  resetUploadImage,
  getUser,
  updateWorkflow,
  getCustomer,
  uploadImage,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUpdate);
