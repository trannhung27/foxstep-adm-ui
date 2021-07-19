import React from 'react';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NEWS_STATUSES } from 'app/config/constants';

export interface INewsFilterFormProps {
  newsCriteria: Record<string, unknown>;
  handleFilter: (newsCriteria: Record<string, unknown>) => void;
  updating: boolean;
}

class NewsFilterForm extends React.Component<INewsFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, newsCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(newsCriteria);
  };

  cancelFilter = (event, fields) => {
    this.form && this.form.reset();
  };

  render() {
    const { newsCriteria, updating } = this.props;

    return (
      <AvForm onValidSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="titleLabel" for="news-title">
                Tiêu đề
              </Label>
              <AvInput
                id="news-title"
                type="text"
                name="title.contains"
                value={newsCriteria['title.contains']}
                defaultValue=""
                validate={{
                  maxLength: { value: 500, errorMessage: 'Tối đa 500 ký tự.' },
                }}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="statusLabel" for="news-status">
                Trạng thái
              </Label>
              <AvInput
                id="news-status"
                data-cy="status"
                type="select"
                className="form-control"
                name="status.equals"
                value={newsCriteria['status.equals']}
              >
                <option value={''} key="0">
                  --Chọn trạng thái--
                </option>
                <option value={NEWS_STATUSES.ACTIVE} key="1">
                  Hoạt động
                </option>
                <option value={NEWS_STATUSES.INACTIVE} key="2">
                  Không Hoạt động
                </option>
              </AvInput>
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedFromLabel" for="news-datePublishedFrom">
                Thời gian đăng từ
              </Label>
              <AvInput
                id="news-datePublishedFrom"
                data-cy="datePublished.greaterThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.greaterThanOrEqual"
                placeholder={'YYYY-MM-DD HH:mm'}
                value={convertDateTimeFromServer(newsCriteria['datePublished.greaterThanOrEqual'])}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedToLabel" for="news-datePublishedTo">
                Thời gian đăng đến
              </Label>
              <AvInput
                id="news-datePublishedTo"
                data-cy="datePublished.lessThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.lessThanOrEqual"
                placeholder={'YYYY-MM-DD HH:mm'}
                value={convertDateTimeFromServer(newsCriteria['datePublished.lessThanOrEqual'])}
              />
            </AvGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <Button color="primary" id="filter-button" data-cy="entityFilterButton" type="submit" disabled={updating} block>
              <FontAwesomeIcon icon="search" />
              &nbsp; Tìm kiếm
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
              &nbsp; Huỷ
            </Button>
          </Col>
        </Row>
      </AvForm>
    );
  }
}

export default NewsFilterForm;
