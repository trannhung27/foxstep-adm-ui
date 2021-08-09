import React from 'react';
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NEWS_STATUSES } from 'app/config/constants';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { fromDateSmallerThanToDate_DatePublished } from 'app/shared/util/form-validate-utils';

export interface INewsFilterFormProps {
  newsCriteria: Record<string, unknown>;
  handleFilter: (newsCriteria: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
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

  validateDates = () => {
    this.form.validateInput('datePublished.greaterThanOrEqual');
    this.form.validateInput('datePublished.lessThanOrEqual');
  };

  cancelFilter = (event, fields) => {
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { newsCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="titleLabel" for="news-title">
                Tiêu đề
              </Label>
              <AvField
                id="news-title"
                type="text"
                name="title.contains"
                placeholder="Aa"
                value={newsCriteria['title.contains']}
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
              <AvField
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
                <option value={NEWS_STATUSES[0].id} key="1">
                  {NEWS_STATUSES[0].name}
                </option>
                <option value={NEWS_STATUSES[1].id} key="2">
                  {NEWS_STATUSES[1].name}
                </option>
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedFromLabel" for="news-datePublishedFrom">
                Từ ngày
              </Label>
              <AvField
                id="news-datePublishedFrom"
                data-cy="datePublished.greaterThanOrEqual"
                type="date"
                className="form-control"
                name="datePublished.greaterThanOrEqual"
                value={convertDateFromServer(newsCriteria['datePublished.greaterThanOrEqual'])}
                onChange={() => this.validateDates()}
                validate={{ myValidation: fromDateSmallerThanToDate_DatePublished }}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedToLabel" for="news-datePublishedTo">
                Đến ngày
              </Label>
              <AvField
                id="news-datePublishedTo"
                data-cy="datePublished.lessThanOrEqual"
                type="date"
                className="form-control"
                name="datePublished.lessThanOrEqual"
                value={convertDateFromServer(newsCriteria['datePublished.lessThanOrEqual'])}
                onChange={() => this.validateDates()}
                validate={{ myValidation: fromDateSmallerThanToDate_DatePublished }}
              />
            </AvGroup>
          </Col>
        </Row>
        <div></div>
        <Row>
          <Col sm={2}>
            <Button color="primary" id="filter-button" data-cy="entityFilterButton" type="submit" disabled={updating} block>
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

export default NewsFilterForm;
