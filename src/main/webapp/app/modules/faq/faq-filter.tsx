import React from 'react';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NEWS_CATEGORY_TYPES, NEWS_STATUSES } from 'app/config/constants';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { fromDateSmallerThanToDate_DatePublished } from 'app/shared/util/form-validate-utils';

export interface IFaqFilterFormProps {
  faqCriteria: Record<string, unknown>;
  handleFilter: (faqCriteria: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
}

class FaqFilterForm extends React.Component<IFaqFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, faqCriteria) => {
    const { handleFilter } = this.props;
    if (errors.length === 0) handleFilter(faqCriteria);
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
    const { faqCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="titleLabel" for="faq-title">
                Tiêu đề
              </Label>
              <AvField
                id="faq-title"
                data-cy="title.contains"
                type="text"
                name="title.contains"
                placeholder="Aa"
                value={faqCriteria['title.contains']}
                validate={{
                  maxLength: { value: 500, errorMessage: 'Tối đa 500 ký tự.' },
                }}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="statusLabel" for="faq-status">
                Trạng thái
              </Label>
              <AvField
                id="faq-status"
                data-cy="status.equals"
                type="select"
                className="form-control"
                name="status.equals"
                value={faqCriteria['status.equals']}
              >
                <option value="" key="0">
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
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="categoryLabel" for="faq-category">
                Loại
              </Label>
              <AvField
                id="faq-category"
                data-cy="newsCategoryId.equals"
                type="select"
                className="form-control"
                name="newsCategoryId.equals"
                value={faqCriteria['newsCategoryId.equals']}
              >
                <option value="" key="0">
                  --Tất cả--
                </option>
                <option value={NEWS_CATEGORY_TYPES.FAQ.id} key="1">
                  {NEWS_CATEGORY_TYPES.FAQ.name}
                </option>
                <option value={NEWS_CATEGORY_TYPES.TUTORIAL.id} key="2">
                  {NEWS_CATEGORY_TYPES.TUTORIAL.name}
                </option>
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedFromLabel" for="faq-datePublishedFrom">
                Từ ngày
              </Label>
              <AvField
                id="faq-datePublishedFrom"
                data-cy="datePublished.greaterThanOrEqual"
                type="date"
                className="form-control"
                name="datePublished.greaterThanOrEqual"
                value={convertDateFromServer(faqCriteria['datePublished.greaterThanOrEqual'])}
                onChange={() => this.validateDates()}
                validate={{ myValidation: fromDateSmallerThanToDate_DatePublished }}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedToLabel" for="faq-datePublishedTo">
                Đến ngày
              </Label>
              <AvField
                id="faq-datePublishedTo"
                data-cy="datePublished.lessThanOrEqual"
                type="date"
                className="form-control"
                name="datePublished.lessThanOrEqual"
                value={convertDateFromServer(faqCriteria['datePublished.lessThanOrEqual'])}
                onChange={() => this.validateDates()}
                validate={{ myValidation: fromDateSmallerThanToDate_DatePublished }}
              />
            </AvGroup>
          </Col>
        </Row>
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

export default FaqFilterForm;
