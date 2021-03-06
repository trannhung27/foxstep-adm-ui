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
import 'app/app.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSyncAlt, faWindowClose } from '@fortawesome/free-solid-svg-icons';
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
import { DownOutlined, CaretDownOutlined } from '@ant-design/icons';
import { update as updateWorkflow } from '../workflow/workflow-request.reducer';
import { getCustomer } from '../users/users.reducer';
import { ChallengeUserDialog } from './challenge-search-user-dialog';
import { UploadImageInput } from '../upload-image/upload-image';
import { uploadImage } from '../upload-image/upload-image-reducer';
import challenge from 'app/modules/challenge/challenge';
import { uploadImageCallBack } from 'app/shared/util/editor-utils';

export interface IChallengeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeUpdate = (props: IChallengeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);
  const { challengeEntity, loading, updating } = props;

  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isGps, setIsGps] = useState(0);

  const [isOrganization, setIsOrganization] = useState(0);

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
      return <text style={{ color: 'red' }}> *</text>;
    }
  }

  const [defaultOptions, setDefaultOptions] = useState([
    { label: '100', value: '100' },
    { label: '200', value: '200' },
    { label: '300', value: '300' },
  ]);

  const [distanceValue, setDistanceValue] = useState([{ label: 'Ch???n ho???c t??? nh???p', value: 0 }]);

  const [validityCriteria, setValidityCriteria] = useState([1, 2, 3]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorChanged, setEditorChanged] = useState(false);
  const [editorError, setEditorErrorState] = useState(false);
  const [updatedEntity, setUpdatedEntity] = useState(challengeEntity);

  const [avgPace, setAvgPace] = useState({ from: '4.0', to: '15.0', required: true });
  const [minDistance, setMinDistance] = useState({ value: '1.0', required: false, checked: false });
  const [elevationGain, setElevationGain] = useState({ value: '100', required: false, checked: false });
  const [avgCadence, setAvgCadence] = useState({ from: '50', to: '200', required: false, checked: false });
  // const

  //upload image invalid file type error
  const [uploadInvalidType, setUploadInvalidType] = useState(false);

  const onEditorStateChange = editor => {
    setEditorState(editor);
    setEditorChanged(true);
    setEditorErrorState(!editorState.getCurrentContent().hasText());
    setEditorState(editor);
  };

  const handleChallengeDistance = (e, i) => {
    const list = [...challengeDistanceList];
    list[i] = { distance: e.target.value, isDisabled: false };
    if (i < 4) {
      list[i + 1] = {
        distance: challengeDistanceList[i + 1] ? challengeDistanceList[i + 1].distance : 0,
        isDisabled: false,
      };
    }
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
      const list = challengeDistanceList;
      challengeEntity.challengeDistance.map((challengeDistance, i) => {
        list[i] = { distance: challengeDistance.distance, isDisabled: false };
      });
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
        checked: challengeEntity.challengeValidity && Number(challengeEntity.challengeValidity.minDistance) > 0,
      });

      setElevationGain({
        value: challengeEntity.challengeValidity.elevationGain.toString(),
        required: elevationGain.required,
        checked: challengeEntity.challengeValidity && Number(challengeEntity.challengeValidity.elevationGain) > 0,
      });

      setAvgCadence({
        from: challengeEntity.challengeValidity.avgCadenceFrom.toString(),
        to: challengeEntity.challengeValidity.avgCadenceTo.toString(),
        required: avgCadence.required,
        checked:
          challengeEntity.challengeValidity &&
          Number(challengeEntity.challengeValidity.avgCadenceFrom) > 0 &&
          Number(challengeEntity.challengeValidity.avgCadenceTo) > 0,
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

    if (challengeEntity.challengeType && !isNew) {
      setIsOrganization(challengeEntity.challengeType);
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

      if (!uploadInvalidType) {
        if (isNew) {
          props.createEntity(entity);
        } else {
          props.updateEntity(entity);
        }
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
            <h5 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
              Thay ?????i th??? th??ch
            </h5>
          ) : (
            <h5 id="foxstep2AdminWebappApp.challenge.home.createOrEditLabel" data-cy="ChallengeCreateUpdateHeading">
              Th??m m???i th??? th??ch
            </h5>
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

              <Row form>
                <h6 style={{ fontWeight: 'bold' }}>1. Th??ng tin chung &nbsp;</h6>
                <CaretDownOutlined style={{ fontSize: '16px', paddingTop: '6px', color: 'blue' }} onClick={toggle} />
              </Row>
              <Collapse isOpen={isOpen}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6">
                        <AvGroup className="form-group form-inline">
                          <Label style={{ paddingRight: '10px' }}> Ng?????i t???o</Label>
                          <AvField
                            id="challenge_type"
                            type="select"
                            name="challengeType"
                            value={challengeEntity.challengeType ? challengeEntity.challengeType.toString() : '0'}
                            onChange={event => {
                              event.target.value === '1' ? setIsOrganization(1) : event.target.value === '0' ? setIsOrganization(0) : {};
                            }}
                            validate={{
                              required: { value: true, errorMessage: 'Kh??ng ???????c b??? tr???ng' },
                            }}
                          >
                            <option value="0">Ban t??? ch???c</option>
                            <option value="1">C?? nh??n</option>
                          </AvField>
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="6">
                        {isOrganization === 1 ? (
                          <AvGroup className="form-group form-inline">
                            <Label style={{ marginRight: '10px' }}>C?? nh??n t??? ch???c</Label>
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
                              <span className="d-none d-md-inline">T??m</span>
                            </Button>
                          </AvGroup>
                        ) : isOrganization === 0 ? (
                          <AvGroup className="form-group form-inline">
                            <Label style={{ marginRight: '10px' }}>Ban t??? ch???c</Label>
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
                          label="???nh ?????i di???n TT: "
                          reset={props.resetUploadImage}
                          required={isNew ? true : !challengeEntity.imgUrl}
                          onInvalidType={() => setUploadInvalidType(true)}
                          onValidType={() => setUploadInvalidType(false)}
                        />
                        <AvField
                          hidden
                          name="imgUrl"
                          value={isNew ? props.uploadImageEntity.url : challengeEntity.imgUrl}
                          validate={{
                            required: { value: true, errorMessage: '???nh ch??a c???p nh???t th??nh c??ng' },
                          }}
                        />
                        {/*add feedback for not upload image*/}
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={6}>
                        <Row>
                          <Col md={11}>
                            <AvGroup>
                              <Label id="titleLabel" for="challenge-title">
                                T??n th??? th??ch <RedAsterisk />
                              </Label>
                              <AvField
                                id="challenge-title"
                                data-cy="title"
                                type="text"
                                name="title"
                                value={challengeEntity && !isNew ? challengeEntity.title : ''}
                                validate={{
                                  required: { value: true, errorMessage: 'Kh??ng ???????c b??? tr???ng' },
                                  minLength: {
                                    value: 5,
                                    errorMessage: 'C???n ??t nh???t 5 k?? t???',
                                  },
                                  maxLength: {
                                    value: 200,
                                    errorMessage: 'Kh??ng ???????c nhi???u h??n 200 k?? t???',
                                  },
                                }}
                              />
                            </AvGroup>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={6}>
                        <Row className="justify-content-right">
                          <Col md={12}>
                            <AvGroup className="form-group">
                              <Label>G???n th???:</Label>
                              <AvInput name="challenge-tag" />
                            </AvGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={4}>
                        <AvGroup>
                          <Label id="dateStartLabel" for="challenge-dateStart">
                            T??? ng??y
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
                              required: { value: true, errorMessage: 'Kh??ng ???????c b??? tr???ng' },
                            }}
                          />
                        </AvGroup>
                      </Col>
                      <Col md={4}>
                        <AvGroup>
                          <Label id="dateFinishLabel" for="challenge-dateFinish">
                            ?????n ng??y
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
                            <p className="invalid-feedback">Gi?? tr??? ?????n ph???i l???n h??n gi?? tr??? t???</p>
                          )}
                        </AvGroup>
                      </Col>
                      <Col md={4}>
                        <AvGroup>
                          <Label id="dateFinishLabel" for="challenge-dateRegisDeadline">
                            H???n ????ng k??
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
                              required: { value: true, errorMessage: 'Kh??ng ???????c b??? tr???ng' },
                            }}
                          />
                          {convertDateTimeFromServer(dateFinish) < convertDateTimeFromServer(dateRegisDeadline) && (
                            <p className="invalid-feedback">H???n ????ng k?? ph???i nh??? h??n ng??y k???t th??c</p>
                          )}
                        </AvGroup>
                      </Col>
                    </Row>
                    <Label id="contentLabel" for="news-content">
                      N???i dung:
                    </Label>
                    <AvField hidden id="news-content" data-cy="content" type="text" name="content" />
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={onEditorStateChange}
                      handlePastedText={() => false}
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
                        image: {
                          uploadCallback: uploadImageCallBack,
                          previewImage: true,
                          inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                          alt: { present: true, mandatory: false },
                        },
                      }}
                    />
                    {editorChanged && editorError && <p className="invalid-feedback">Kh??ng ???????c ????? tr???ng.</p>}
                  </CardBody>
                </Card>
              </Collapse>
              <Row form>
                <h6 style={{ fontWeight: 'bold' }}>2. C??i ?????t ti??u ch??&nbsp;</h6>
                <CaretDownOutlined style={{ fontSize: '16px', paddingTop: '6px', color: 'blue' }} onClick={toggle2} />
              </Row>
              <Collapse isOpen={isOpen2}>
                <Card>
                  <CardBody>
                    <Row form>
                      <Col md={4}>
                        <AvGroup>
                          <AvField id="challenge_sport" type="select" name="sport.name" label="B??? m??n">
                            <option>Ch???y b???</option>
                          </AvField>
                          <AvField hidden name="sport.id" type="text" value="1"></AvField>
                          {isNew ? null : <AvField hidden name="challengeValidity.id" value={challengeEntity.id} />}
                        </AvGroup>
                      </Col>
                    </Row>
                    <AvRadioGroup
                      name="calType"
                      label="C??ch t??nh th??nh t??ch"
                      // disabled = {!isNew && ([1,12].includes(challengeEntity.status)) }
                      onChange={event => {
                        setCalValue(Number(event.target.value));
                        if (Number(event.target.value) === 1 && !isNew) {
                          setChallengeDistanceList(challengeDistanceList.slice(0, 1));
                        }
                      }}
                      value={challengeEntity.calType}
                      validate={{
                        required: { value: true, errorMessage: 'Gi?? tr??? b???t bu???c' },
                      }}
                    >
                      <AvRadio label="C?? M???T L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??" value={1} />
                      <AvRadio label="T???ng t??ch l??y C??C L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??" value={2} />
                    </AvRadioGroup>

                    <Row>
                      <Col xs="12" sm="6">
                        <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                          H???ng m???c(Cho ph??p nh???p tr???c ti???p qu??ng ???????ng v???i ????n v??? l?? Km){' '}
                        </text>
                      </Col>
                    </Row>

                    {challengeDistanceList.map((distance, i) => (
                      <Row form key={i}>
                        <Col md={4}>
                          <AvGroup>
                            <Label>
                              {i === 0 ? (
                                <div>
                                  H???ng m???c {i + 1}: <RedAsterisk />
                                </div>
                              ) : (
                                <div>H???ng m???c {i + 1}:</div>
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
                                  value: i === 0 || (i < 4 && challengeDistanceList[i + 1] && challengeDistanceList[i + 1].distance > 0),
                                  errorMessage: 'Kh??ng ???????c ????? tr???ng',
                                },
                                min: {
                                  value: isNew && challengeDistanceList[i - 1] ? Number(challengeDistanceList[i - 1].distance) + 1 : 0,
                                  errorMessage: 'Gi?? tr??? c???n l???n h??n h???ng m???c tr?????c',
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
                      </Row>
                    ))}

                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Ti??u ch?? h???p l???</text>
                    <Row></Row>
                    {/* <text style={{ color: 'blueviolet' }}>
                      Th???i gian b???t ?????u di???n ra th??? th??ch t??? th???i gian b???t ?????u t???i th???i gian k???t th??c
                    </text> */}

                    <AvField
                      type="checkbox"
                      disabled
                      name="challengeValidity.checkTime"
                      label=" Th???i gian b???t ?????u di???n ra th??? th??ch t??? th???i gian b???t ?????u t???i th???i gian k???t th??c"
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
                          <Label>B??i ch???y c?? t???c ????? trung b??nh(avg pace) &nbsp; &nbsp;</Label>
                          <AvField
                            id="challengeValidity.avgPaceFrom"
                            label=" T??? &nbsp;"
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
                              required: { value: avgPace.required, errorMessage: 'Kh??ng ???????c ????? tr???ng' },
                            }}
                          />

                          <AvField
                            label="&nbsp; - ?????n &nbsp; "
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
                              required: { value: true, errorMessage: 'Kh??ng ???????c ????? tr???ng' },
                              min: { value: avgPace.from, errorMessage: 'Gi?? tr??? t??? kh??ng th??? l???n h??n gi?? tr??? ?????n ' },
                            }}
                          />
                          <text> &nbsp; (ph??t/km)</text>
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
                              checked={minDistance.checked}
                              onChange={() =>
                                setMinDistance({
                                  value: minDistance.value,
                                  required: !minDistance.required,
                                  checked: !minDistance.checked,
                                })
                              }
                            />
                            B??i ch???y c?? qu??ng ???????ng t???i thi???u &nbsp; &nbsp;
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
                              required: { value: minDistance.required, errorMessage: 'Kh??ng ????? tr???ng' },
                            }}
                          ></AvField>
                          {/*<Label> &nbsp; (km)</Label>*/}
                          {minDistance.value === '' && <p className="invalid-feedback">Kh??ng ???????c ????? tr???ng.</p>}
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={elevationGain.checked}
                            onChange={() =>
                              setElevationGain({
                                value: elevationGain.value,
                                required: !elevationGain.required,
                                checked: !elevationGain.checked,
                              })
                            }
                          />
                          <AvField
                            label="B??i ch???y c?? ????? cao ?????t ???????c (elevation gain) t???i thi???u: &nbsp; &nbsp;"
                            type="number"
                            step="0.1"
                            min="0.0"
                            max="300.0"
                            value={elevationGain.value}
                            className="form-control"
                            name="challengeValidity.elevationGain"
                            validate={{
                              required: { value: elevationGain.required, errorMessage: 'Kh??ng ???????c ????? tr???ng' },
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
                            checked={avgCadence.checked}
                            onChange={() =>
                              setAvgCadence({
                                from: avgCadence.from,
                                to: avgCadence.to,
                                required: !avgCadence.required,
                                checked: !avgCadence.checked,
                              })
                            }
                          />
                          <AvField
                            label="B??i ch???y c?? nh???p ch??n trung b??nh(avg cadence) &nbsp; &nbsp;  T??? &nbsp;"
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
                              required: { value: avgCadence.required, errorMessage: 'Kh??ng ???????c ????? tr???ng' },
                            }}
                          />
                          <AvField
                            label="&nbsp; - ?????n &nbsp; "
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
                              required: { value: avgCadence.required, errorMessage: 'Kh??ng ???????c ????? tr???ng' },
                              min: { value: avgCadence.from, errorMessage: 'Gi?? tr??? ?????n kh??ng th??? nh??? h??n gi?? tr??? t???' },
                            }}
                          />
                          <text> &nbsp; (b?????c/ph??t)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            type="checkbox"
                            name="challenge_check"
                            label="Ch??? ch???p nh???n c??c b??i t???p ngo??i tr???i d??ng GPS"
                            className="mr-2"
                            onChange={setGps}
                          />
                          <AvField name="challengeValidity.gps" value={isGps} hidden />
                          <AvField name="challengeValidity.completionCriteria" value="3" hidden />
                        </AvGroup>
                      </Col>
                    </Row>
                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Ti??u ch?? ho??n th??nh</text>
                    <Row></Row>
                    <text style={{ color: 'blueviolet' }}>T???ng t??ch l??y C??C L???N th???c hi???n h???p l??? ?????t h???ng m???c ???? ????ng k??</text>
                    <Row style={{ paddingBottom: '10px' }}></Row>
                    <text style={{ fontWeight: 'bold' }}> Th??? t??? c??c ti??u ch?? x???p h???ng:</text>

                    {validityCriteria.map((criteria, index) => (
                      <Row key={index}>
                        <Col sm={7}>
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
                              disabled
                              style={{ width: '250px', border: 'hidden', fill: 'white' }}
                              value={
                                criteria === 1
                                  ? 'S??? km th???c hi???n nhi???u nh???t'
                                  : criteria === 2
                                  ? 'Avg Pace th???p nh???t'
                                  : criteria === 3
                                  ? 'Avg HR th???p nh???t'
                                  : ''
                              }
                            />
                            <AvField
                              type="number"
                              hidden
                              name={'challengeValidity.rankCriteria' + (index + 1)}
                              value={criteria === 3 ? (!criteria3Checked ? '0' : '3') : Number(criteria)}
                            />
                            &nbsp; &nbsp;
                            {index !== 2 ? (
                              <Button outline color="primary" onClick={swapPosition}>
                                {' '}
                                ?????i <FontAwesomeIcon icon={faSyncAlt} />{' '}
                              </Button>
                            ) : null}
                          </AvGroup>
                        </Col>
                      </Row>
                    ))}
                  </CardBody>
                </Card>
              </Collapse>

              <Row form>
                <h6 style={{ fontWeight: 'bold' }}>3. C??i ?????t th??nh vi??n&nbsp;</h6>
                <CaretDownOutlined style={{ fontSize: '16px', paddingTop: '6px', color: 'blue' }} onClick={toggle3} />
              </Row>
              <Collapse isOpen={isOpen3}>
                <Card>
                  <CardBody>
                    <Row form>
                      <Col md={5}>
                        <AvGroup className="form-group form-inline">
                          <Label id="titleLabel" for="challenge-title">
                            S??? ng?????i tham gia: <RedAsterisk /> &nbsp;
                          </Label>
                          <AvField
                            id="challenge-num_of_participant"
                            data-cy="num_of_participant"
                            type="number"
                            step="1"
                            className="form-control"
                            name="numOfParticipant"
                            value={!isNew && challengeEntity.numOfParticipant ? challengeEntity.numOfParticipant : undefined}
                            validate={{
                              required: {
                                value: true,
                                errorMessage: 'Kh??ng ???????c b??? tr???ng ',
                              },
                              max: {
                                value: 100,
                                errorMessage:
                                  'T???i ??a 100 th??nh vi??n ?????i v???i th??? th??ch t??? c?? nh??n. ????? t???o th??? th??ch v???i s??? l?????ng th??nh vi??n l???n h??n, vui l??ng li??n h??? 19006600',
                              },
                            }}
                          />
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col xs="12" sm="8">
                        <AvGroup className="form-group">
                          <Label>
                            Ph???m vi tham gia:
                            <RedAsterisk /> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                          </Label>

                          <AvRadioGroup
                            name="objectType"
                            onChange={event => {
                              setObjectType(event.target.value);
                            }}
                            defaultValue="1"
                            value={challengeEntity.objectType ? challengeEntity.objectType.toString() : '1'}
                            validate={{
                              required: {
                                value: true,
                                errorMessage: 'Kh??ng ???????c b??? tr???ng ',
                              },
                            }}
                          >
                            <AvRadio label="C??ng khai - M???i th??nh vi??n ?????u c?? th??? tham gia" value="1" />
                            <AvRadio label="N???i b??? - Ch??? c?? th??nh vi??n c?? m?? ????ng k??, ???????c m???i, ???????c duy???t m???i c?? th??? tham gia" value="2" />
                          </AvRadioGroup>
                          {objectType === '2' ? (
                            <Col xs="12" sm="8">
                              <Row style={{ paddingTop: '6px' }}>
                                <label>
                                  M?? ????ng k??
                                  <RedAsterisk /> &nbsp;
                                </label>
                                <AvField
                                  type="text"
                                  name="code"
                                  validate={{
                                    required: {
                                      value: true,
                                      errorMessage: 'Kh??ng ???????c b??? tr???ng ',
                                    },
                                  }}
                                />
                              </Row>
                            </Col>
                          ) : null}
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={4}>
                        <AvCheckboxGroup name="teamAllow">
                          <AvCheckbox label="Thi ?????u theo nh??m" checked={teamAllow} onChange={changeTeamAllow}></AvCheckbox>
                        </AvCheckboxGroup>
                      </Col>
                    </Row>

                    {teamAllow === true ? (
                      <AvGroup className="form-group">
                        <Row>
                          <Col xs="12" sm="2">
                            <Label>Gi???i h???n th??nh vi??n:</Label>
                          </Col>
                          <Col xs="12" sm="2">
                            <AvInput style={{ paddingLeft: '6px' }} type="number" name="numPerTeam" step="1" min="1" />
                          </Col>
                        </Row>

                        <Row style={{ marginTop: '30px' }}>
                          <Col xs="12" sm="2">
                            <Label for="teams">
                              T??n nh??m:
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
                                  placeholder={'Nh??m' + ' ' + (+i + +1)}
                                  value={team.name}
                                  validate={{
                                    required: { value: true, errorMessage: 'Kh??ng ???????c b??? tr???ng' },
                                  }}
                                  onChange={event => handleInputChange(event, i)}
                                >
                                  team.name{' '}
                                </AvInput>
                                &nbsp;
                                {teamList.length !== 1 && (
                                  <Button outline color="danger" onClick={() => handleRemoveClick(i)}>
                                    {' '}
                                    <FontAwesomeIcon icon={faTimes} />
                                  </Button>
                                )}
                              </AvGroup>
                            ))}
                            <Button outline color="primary" onClick={handleAddClick} style={{ fontSize: '16px' }}>
                              <FontAwesomeIcon icon="plus" size="1x" />
                              &nbsp; Th??m nh??m
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
                    <span className="d-none d-md-inline">H???y</span>
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp; L??u
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
