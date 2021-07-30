import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChallengeStatuses, ChallengeTypes, ChallengeUserStatuses } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { getEntities as getSportList } from 'app/modules/sport/sport.reducer';
import { connect } from 'react-redux';
import { ISport } from 'app/shared/model/sport.model';
import { convertDateFromServer } from 'app/shared/util/date-utils';

export interface ICOUTFilterFormProps {
  couCriteria: Record<string, unknown>;
  handleFilter: (couCriteria: Record<string, unknown>) => void;
  updating: boolean;
  sportList: ReadonlyArray<ISport>;
  clear: () => void;
}

class ChallengesOfUserFilterForm extends React.Component<ICOUTFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, couCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(couCriteria);
  };

  cancelFilter = (event, fields) => {
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { couCriteria, sportList, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="titleLabel" for="title">
                Tên thử thách
              </Label>
              <AvField id="title" type="text" name="title" placeholder="Aa" value={couCriteria['title']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="chalTypeLabel" for="chalType">
                Loại thử thách
              </Label>
              <AvField id="chalType" type="select" name="chalType" value={couCriteria['chalType']}>
                <option value="" key="0">
                  --Chọn loại thử thách--
                </option>
                <option value={ChallengeTypes.INDIVIDUAL} key="1">
                  Thử thách từ cá nhân
                </option>
                <option value={ChallengeTypes.ORGANIZATION} key="2">
                  Thử thách từ BTC
                </option>
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="sportIdLabel" for="sportId">
                Bộ môn
              </Label>
              <AvField id="sportId" type="select" name="sportId" value={couCriteria['sportId']}>
                <option value="" key="0">
                  --Chọn bộ môn--
                </option>
                {sportList
                  ? sportList.map(sport => (
                      <option value={sport.id} key={sport.id}>
                        {sport.name}
                      </option>
                    ))
                  : null}
              </AvField>
            </AvGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="3">
            <AvGroup>
              <Label id="fromDateLabel" for="fromDate">
                Từ ngày
              </Label>
              <AvInput
                id="fromDate"
                data-cy="fromDate"
                type="date"
                className="form-control"
                name="fromDate"
                value={convertDateFromServer(couCriteria['fromDate'])}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="3">
            <AvGroup>
              <Label id="toDateLabel" for="toDate">
                Từ ngày
              </Label>
              <AvInput
                id="toDate"
                data-cy="toDate"
                type="date"
                className="form-control"
                name="toDate"
                value={convertDateFromServer(couCriteria['toDate'])}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="3">
            <AvGroup>
              <Label id="chalStatusLabel" for="chalStatus">
                Trạng thái thử thách
              </Label>
              <AvField id="chalStatus" type="select" name="chalStatus" value={couCriteria['chalStatus']}>
                <option value="" key="0">
                  --Chọn trạng thái--
                </option>
                {ChallengeStatuses.map(status => (
                  <option value={status.id} key={status.id}>
                    {status.name}
                  </option>
                ))}
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="3">
            <AvGroup>
              <Label id="chalUserStatusLabel" for="chalUserStatus">
                Trạng thái tham gia thử thách
              </Label>
              <AvField id="chalUserStatus" type="select" name="chalUserStatus" value={couCriteria['chalUserStatus']}>
                <option value="" key="0">
                  --Chọn trạng thái tham gia--
                </option>
                {ChallengeUserStatuses.map(status => (
                  <option value={status.id} key={status.id}>
                    {status.name}
                  </option>
                ))}
              </AvField>
            </AvGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Button color="primary" type="submit" block>
              <FontAwesomeIcon icon="search" />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Tìm kiếm</span>
            </Button>
          </Col>
          <Col sm={2}>
            <Button
              color="default"
              className="border-secondary"
              id="cancel-button"
              data-cy="cancelFilterButton"
              type="reset"
              value="Reset"
              block
            >
              <FontAwesomeIcon icon="ban" />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Hủy</span>
            </Button>
          </Col>
        </Row>
      </AvForm>
    );
  }
}

function mapStateToProps({ sport }: IRootState) {
  return {
    sportList: sport.entities,
  };
}

function mapDispatchToProps() {
  return {
    getSportList,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChallengesOfUserFilterForm);
