import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NEWS_STATUSES } from 'app/config/constants';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IFaqFilterFormProps {
  faqCriteria: Record<string, unknown>;
  handleFilter: (faqCriteria: Record<string, unknown>) => void;
  updating: boolean;
}

class FaqFilterForm extends React.Component<IFaqFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, faqCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(faqCriteria);
  };

  cancelFilter = (event, fields) => {
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
              <AvInput
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
              </AvInput>
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="categoryLabel" for="faq-category">
                Loại
              </Label>
              <AvInput
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
                <option value="2" key="1">
                  FAQ
                </option>
                <option value="3" key="2">
                  Hướng dẫn
                </option>
              </AvInput>
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedFromLabel" for="faq-datePublishedFrom">
                Từ ngày
              </Label>
              <AvInput
                id="faq-datePublishedFrom"
                data-cy="datePublished.greaterThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.greaterThanOrEqual"
                value={convertDateTimeFromServer(faqCriteria['datePublished.greaterThanOrEqual'])}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedToLabel" for="faq-datePublishedTo">
                Đến ngày
              </Label>
              <AvInput
                id="faq-datePublishedTo"
                data-cy="datePublished.lessThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.lessThanOrEqual"
                value={convertDateTimeFromServer(faqCriteria['datePublished.lessThanOrEqual'])}
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
