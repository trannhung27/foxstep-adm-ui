import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateFromServer, convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChallengeStatuses, NEWS_STATUSES } from 'app/config/constants';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import DateTime from 'react-datetime';
import moment from 'moment';

export interface IChallengeFilterFormProps {
  challengeCriteria: Record<string, unknown>;
  handleFilter: (challengeCriteria: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
}

class ChallengeFilterForm extends React.Component<IChallengeFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (event, errors, challengeCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(challengeCriteria);
  };

  cancelFilter = (event, fields) => {
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { challengeCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <AvField
                type="text"
                name="title.contains"
                label="Tên thử thách"
                placeholder="Điền tên thử thách"
                value={challengeCriteria['title.contains']}
                onChange={event => (challengeCriteria['title.contains'] = event.target.value)}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="status.equals"
              label="Trạng thái"
              onChange={event => {
                challengeCriteria['status.equals'] = event.target.value;
              }}
            >
              <option value="" key="0">
                Tất cả
              </option>
              <option value={ChallengeStatuses[0].id}>{ChallengeStatuses[0].name}</option>
              <option value={ChallengeStatuses[1].id}>{ChallengeStatuses[1].name}</option>
              <option value={ChallengeStatuses[2].id}>{ChallengeStatuses[2].name}</option>
              <option value={ChallengeStatuses[3].id}>{ChallengeStatuses[3].name}</option>
              <option value={ChallengeStatuses[4].id}>{ChallengeStatuses[4].name}</option>
              <option value={ChallengeStatuses[5].id}>{ChallengeStatuses[5].name}</option>
            </AvField>
          </Col>
          <Col xs="12" sm="4">
            <AvField
              type="select"
              name="challengeType.equals"
              label="Loại thử thách"
              value={challengeCriteria['challengeType.equals']}
              onChange={event => (challengeCriteria['challengeType.equals'] = event.target.value)}
            >
              <option value="" key="0">
                Tất cả
              </option>
              <option value="1">Cá nhân</option>
              <option value="0">Ban tổ chức</option>
              {/* {categories
                ? categories.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.name}
                    </option>
                  ))
                : null} */}
            </AvField>
          </Col>
        </Row>

        <Row>
          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <AvField
                    type="select"
                    name="sport.name.equals"
                    label="Bộ môn"
                    value={challengeCriteria['sport.name.equals']}
                    onChange={event => (challengeCriteria['sport.name.equals'] = event.target.value)}
                  >
                    <option value="" key="0">
                      Tất cả
                    </option>
                    <option value="Run">Chạy bộ</option>
                  </AvField>
                </AvGroup>
              </Col>
            </Row>
          </Col>

          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <Label>Từ ngày</Label>
                  <AvInput
                    id="news-datePublishedFrom"
                    data-cy="datePublished.greaterThanOrEqual"
                    type="date"
                    className="form-control"
                    name="dateStart.greaterThanOrEqual"
                    value={convertDateFromServer(challengeCriteria['datePublished.greaterThanOrEqual'])}
                  />
                </AvGroup>
              </Col>
            </Row>
          </Col>

          <Col xs="12" sm="4">
            <Row>
              <Col xs="12" sm="12">
                <AvGroup>
                  <Label>Đến ngày</Label>
                  <AvInput
                    id="news-datePublishedTo"
                    data-cy="dateFinish.lessThanOrEqual"
                    type="date"
                    className="form-control"
                    name="dateFinish.lessThanOrEqual"
                    value={convertDateFromServer(challengeCriteria['datePublished.lessThanOrEqual'])}
                  />
                </AvGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Button
              color="primary"
              id="filter-button"
              data-cy="entityFilterButton"
              type="submit"
              // disabled={loading}
              block
            >
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
              <FontAwesomeIcon icon={faWindowClose} />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Hủy</span>
            </Button>
          </Col>
        </Row>
      </AvForm>
    );
  }
}

export default ChallengeFilterForm;
