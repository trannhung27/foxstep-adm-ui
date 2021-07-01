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
  AvInputContainer,
} from 'availity-reactstrap-validation';
import { translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './challenge.reducer';
import { IChallenge } from 'app/shared/model/challenge.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { render } from '@testing-library/react';
import moment from 'moment';
import DateTime from 'react-datetime';
import CreatableSelect from 'react-select/creatable';
import AvSelect from '@availity/reactstrap-validation-select';
import '@availity/reactstrap-validation-select/styles.scss';
export interface IChallengeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ChallengeUpdate = (props: IChallengeUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { challengeEntity, loading, updating } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);

  const [isGps, setIsGps] = useState(0);

  const setGps = () => setIsGps(1);

  const toggle = () => setIsOpen(!isOpen);
  const toggle2 = () => setIsOpen2(!isOpen2);
  const toggle3 = () => setIsOpen3(!isOpen3);

  const [objectType, setObjectType] = useState('0');

  const [localState, setLocalState] = useState({
    dateStart: null,
    dateFinish: null,
  });

  const [teamAllow, setTeamAllow] = useState(false);
  const changeTeamAllow = () => setTeamAllow(!teamAllow);

  const [teamList, setTeamList] = useState([{ name: '' }]);
  const [challengeDistanceList, setChallengeDistanceList] = useState([]);

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

  const [distanceValue, setDistanceValue] = useState({ label: '', value: '' });

  const handleChange = (newValue: any, actionMeta: any) => {
    setDistanceValue(newValue);
  };
  const handleCreate = (inputValue: any) => {
    const options = defaultOptions;
    const newOption = { label: inputValue, value: inputValue };
    setDefaultOptions([...options, newOption]);
    setDistanceValue(newOption);
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

  const saveEntity = (event, errors, values) => {
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
                  <Button tag={Link} id="cancel-save" to="/entity/challenge" replace color="info">
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
              <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>1. Thông tin chung</h4>
              <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>
                <FontAwesomeIcon icon="plus" swapOpacity />
              </Button>
              <Collapse isOpen={isOpen}>
                <Card>
                  <CardBody>
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
                              minLength: { value: 5, errorMessage: 'This field is required to be at least 5 characters.' },
                              maxLength: { value: 200, errorMessage: 'This field cannot be longer than 200 characters.' },
                            }}
                          />
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="5">
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
                      </Col>
                    </Row>

                    <Row>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label>
                            Thời gian bắt đầu
                            <RedAsterisk />
                          </Label>
                          <DateTime
                            data-cy="num_of_participant"
                            value={localState['dateStart']}
                            onChange={date => (localState['date_start'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                            initialValue={!isNew ? new Date(props.challengeEntity.date_start).toLocaleString() : null}
                            inputProps={{ name: 'dateStart', id: 'challenge-num_of_participant', required: true }}
                            dateFormat="DD/MM/YYYY"
                            timeFormat="HH:mm:ss"
                            closeOnSelect={true}
                          />
                        </AvGroup>
                      </Col>
                      <Col xs="12" sm="4">
                        <AvGroup>
                          <Label>
                            Thời gian kết thúc
                            <RedAsterisk />
                          </Label>
                          <DateTime
                            data-cy="num_of_participant"
                            value={localState['dateStart']}
                            onChange={date => (localState['date_start'] = moment(date).format('YYYY-MM-DDTHH:mm:ss.sss[Z]'))}
                            initialValue={!isNew ? new Date(props.challengeEntity.date_start).toLocaleString() : null}
                            inputProps={{ name: 'dateFinish', id: 'challenge-date_finíh', required: true }}
                            dateFormat="DD/MM/YYYY"
                            timeFormat="HH:mm:ss"
                            closeOnSelect={true}
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Collapse>

              <Row></Row>
              <div>
                <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>2. Cài đặt tiêu chí</h4>
              </div>

              <Button color="primary" onClick={toggle2} style={{ marginBottom: '1rem' }}>
                <FontAwesomeIcon icon="plus" />
              </Button>
              <Collapse isOpen={isOpen2}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6">
                        <AvGroup>
                          <AvField id="challenge_sport" type="select" name="sport.name" label="Bộ môn">
                            <option>Chay Bo</option>
                          </AvField>
                          <AvField hidden name="sport.id" type="text" value="1"></AvField>
                        </AvGroup>
                      </Col>
                    </Row>
                    <AvRadioGroup name="cal_type" label="Cách tính thành tích" required>
                      <AvRadio label="Có MỘT LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value="1" />
                      <AvRadio label="Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký" value="2" />
                    </AvRadioGroup>

                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                      Hạng mục(Cho phép nhập trực tiếp quãng đường với đơn vị là Km){' '}
                    </text>

                    <Row justify-content-left>
                      <Col xs="12" sm="4">
                        <Label style={{ marginRight: '10px' }} id="img_urlLabel" for="challenge-validity_checkTime">
                          Hạng mục 1<RedAsterisk />
                        </Label>

                        {/* <AvField type="select" id="challenge-validity_checkTime" name="challenge_validity.check_time" >
                        <option>100</option>
                            <option>200</option>
                          </AvField> */}
                        <CreatableSelect
                          isClearable
                          placeholder="Chọn hoặc tự nhập"
                          formatCreateLabel={input => input}
                          onChange={handleChange}
                          onCreateOption={handleCreate}
                          options={defaultOptions}
                          value={distanceValue}
                          // value={challengeDistanceList[challengeDistanceList.length-1].name}
                          isValidNewOption={inputValue => inputValue > 100}
                        />

                        <AvField type="text" name="challenge_distance" value={distanceValue} />
                      </Col>

                      <Col xs="12" sm="4">
                        <Label style={{ marginRight: '10px' }} id="img_urlLabel" for="challenge-validity_checkTime2">
                          Hạng mục 2
                        </Label>
                        <AvGroup>
                          <AvField id="challenge-validity_checkTime2" type="select" name="challenge_validity.check_time2" creatable>
                            <option>100</option>
                            <option>200</option>
                          </AvField>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row justify-content-left>
                      <Col xs="12" sm="4">
                        <Label style={{ marginRight: '10px' }} id="img_urlLabel" for="challenge-validity_checkTime3">
                          Hạng mục 3
                        </Label>
                        <AvGroup>
                          <AvField id="challenge-validity_checkTime3" type="select" name="challenge_validity.check_time3" disabled>
                            <option>100</option>
                            <option>200</option>
                          </AvField>
                        </AvGroup>
                      </Col>

                      <Col xs="12" sm="4">
                        <Label style={{ marginRight: '10px' }} id="img_urlLabel" for="challenge-validity_checkTime4">
                          Hạng mục 4
                        </Label>
                        <AvGroup>
                          <AvField id="challenge-validity_checkTime4" type="select" name="challenge_validity.check_time4" disabled>
                            <option>100</option>
                            <option>200</option>
                          </AvField>
                        </AvGroup>
                      </Col>
                    </Row>

                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hợp lệ</text>
                    <Row></Row>
                    <text style={{ color: 'blueviolet' }}>
                      Thời gian bắt đầu diễn ra thử thách từ thời gian bắt đầu tới thời gian kết thúc
                    </text>

                    <AvGroup>
                      <AvField
                        label="Nội dung thử thách"
                        id="challenge-content"
                        data-cy="content"
                        type="text"
                        className="form-control"
                        name="content"
                      />
                    </AvGroup>
                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="Bài chạy có tốc độ trung bình(avg pace) &nbsp; &nbsp;  Từ &nbsp;"
                            id="challenge-validity_avg_pace_from"
                            defaultValue="3.0"
                            data-cy="challenge_validity.avg_pace_from"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            className="form-control"
                            name="challenge_validity.avg_pace_from"
                          />
                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_pace_to"
                            defaultValue="12.0"
                            data-cy="challenge_validity.avg_pace_to"
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            className="form-control"
                            name="challenge_validity.avg_pace_to"
                          />
                          <text> &nbsp; (phút/km)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="Bài chạy có quãng đường tối thiểu &nbsp; &nbsp;"
                            id="challenge-validity_min_distance"
                            defaultValue="2.0"
                            data-cy="challenge_validity.min_distance"
                            type="number"
                            step="0.1"
                            min="1"
                            max="200"
                            className="form-control"
                            name="challenge_validity.min_distance"
                          />

                          <text> &nbsp; (km)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="Bài chạy có độ cao đạt được (elevation gain) tối thiểu: &nbsp; &nbsp;"
                            id="challenge-validity_elevation_gain"
                            defaultValue="2.0"
                            data-cy="challenge_validity.elevation_gain"
                            type="number"
                            step="0.1"
                            min="1"
                            max="20"
                            className="form-control"
                            name="challenge_validity.elevation_gain"
                          />

                          <text> &nbsp; (m)</text>
                        </AvGroup>
                      </Col>
                    </Row>

                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="Bài chạy có nhịp chân trung bình(avg pace) &nbsp; &nbsp;  Từ &nbsp;"
                            id="challenge-validity_avg_cadence_from"
                            defaultValue="50"
                            data-cy="validity.avg_cadence_from"
                            type="number"
                            step="1"
                            min="10"
                            max="300"
                            className="form-control"
                            name="challenge_validity.avg_cadence_from"
                          />
                          <AvField
                            label="&nbsp; - Đến &nbsp; "
                            id="challenge-validity_avg_cadence_to"
                            defaultValue="200"
                            data-cy="challenge_validity.avg_cadence_to"
                            type="number"
                            step="1"
                            min="10"
                            max="300"
                            className="form-control"
                            name="challenge_validity.avg_cadence_to"
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
                            onChange={setGps}
                          />
                          <AvField name="challenge_validity.gps" value={isGps} hidden />
                          <AvField name="challenge_validity.completion_criteria" value="3" hidden />
                        </AvGroup>
                      </Col>
                    </Row>
                    <text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Tiêu chí hoàn thành</text>
                    <Row></Row>
                    <text style={{ color: 'blueviolet' }}>Tổng tích lũy CÁC LẦN thực hiện hợp lệ đạt hạng mục đã đăng ký</text>
                    <Row style={{ paddingBottom: '10px' }}></Row>
                    <text style={{ fontWeight: 'bold' }}> Thứ tự các tiêu chí xếp hạng:</text>
                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="1. &nbsp; Số km thực hiện nhiều nhất &nbsp;"
                            id="challenge-validity_rank_criteria1"
                            defaultValue="10"
                            data-cy="challenge_validity.rank_criteria1"
                            type="number"
                            step="1"
                            min="10"
                            max="300"
                            className="form-control"
                            name="challenge_validity.rank_criteria1"
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="1. &nbsp; Avg Pace thấp nhất &nbsp;"
                            id="challenge-validity_rank_criteria2"
                            defaultValue="20"
                            data-cy="challenge_validity.rank_criteria2"
                            type="number"
                            step="1"
                            min="10"
                            max="100"
                            className="form-control"
                            name="challenge_validity.rank_criteria2"
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                    <Row className="justify-content-right">
                      <Col xs="12" sm="7">
                        <AvGroup className="form-group form-inline">
                          <AvField
                            label="1. &nbsp; AVG HR thấp nhất &nbsp;"
                            id="challenge-validity_rank_criteria3"
                            defaultValue="30"
                            data-cy="challenge_validity.rank_criteria3"
                            type="number"
                            step="1"
                            min="10"
                            max="100"
                            className="form-control"
                            name="challenge_validity.rank_criteria3"
                          />
                        </AvGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Collapse>

              <Row></Row>
              <div>
                <h4 style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>3. Cài đặt thành viên</h4>
              </div>
              <Button color="primary" onClick={toggle3} style={{ marginBottom: '1rem' }}>
                <FontAwesomeIcon icon="plus" />
              </Button>
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
                              name="num_of_participant"
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
                          <AvRadioGroup name="object_type" required>
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
                            <Label for="team_size">
                              Giới hạn thành viên:
                              <RedAsterisk />
                            </Label>
                          </Col>
                          <Col xs="12" sm="2">
                            <AvInput style={{ paddingLeft: '6px' }} type="number" name="team_size" step="1" min="1" />
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

                    {/* {inputList.map((x, i) => {
                        return (
                          <div className="box" key={i}>
                            <input
                             name="name"
                             type = "string"
                             value={x.name}
                             onChange={ event=> handleInputChange(event,i)}>
                            </input>
                             
                            <div className="btn-box">
                              {inputList.length !== 1 && <button className="mr10" onClick={() => handleRemoveClick(i)}>Remove index: {i}</button>}
                            </div>
                          </div>
                        );
                      })
                    }
                    </AvInput>
                    </AvGroup>
                    {<Button  onClick={handleAddClick}>Thêm</Button>}
                     <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
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
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUpdate);
