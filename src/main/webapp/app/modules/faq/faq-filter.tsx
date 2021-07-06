import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NEWS_STATUSES } from 'app/config/constants';

export interface IFaqFilterFormProps {
  faqCriteria: Record<string, unknown>;
  handleFilter: (faqCriteria: Record<string, unknown>) => void;
  updating: boolean;
}

class FaqFilterForm extends React.Component<IFaqFilterFormProps> {
  handleSubmit = (even, errors, faqCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(faqCriteria);
  };

  render() {
    const { faqCriteria, updating } = this.props;

    return (
      <AvForm model={faqCriteria} onSubmit={this.handleSubmit}>
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
              <AvInput id="faq-status" data-cy="status.equals" type="select" className="form-control" name="status.equals">
                <option value="" key="0">
                  --Tất cả--
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
                Thời gian đăng từ
              </Label>
              <AvInput
                id="faq-datePublishedFrom"
                data-cy="datePublished.greaterThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.greaterThanOrEqual"
                placeholder={'YYYY-MM-DD HH:mm'}
                value={convertDateTimeFromServer(this.props.faqCriteria['datePublished.greaterThanOrEqual'])}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="datePublishedToLabel" for="faq-datePublishedTo">
                Thời gian đăng đến
              </Label>
              <AvInput
                id="faq-datePublishedTo"
                data-cy="datePublished.lessThanOrEqual"
                type="datetime-local"
                className="form-control"
                name="datePublished.lessThanOrEqual"
                placeholder={'YYYY-MM-DD HH:mm'}
                value={convertDateTimeFromServer(this.props.faqCriteria['datePublished.lessThanOrEqual'])}
              />
            </AvGroup>
          </Col>
        </Row>
        <Button color="primary" id="filter-button" data-cy="entityFilterButton" type="submit" disabled={updating}>
          <FontAwesomeIcon icon="search" />
          &nbsp; Tìm kiếm
        </Button>
      </AvForm>
    );
  }
}

export default FaqFilterForm;
