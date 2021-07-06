import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { USER_STATUS } from 'app/config/constants';
import DateTime from 'react-datetime';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewsFilterForm from 'app/modules/news/news-filter';

export interface INewsFilterFormProps {
  usersCriteria: Record<string, unknown>;
  handleFilter: (newsCriteria: Record<string, unknown>) => void;
  updating: boolean;
}

class UsersFilterForm extends React.Component<INewsFilterFormProps> {
  handleSubmit = (even, errors, usersCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(usersCriteria);
  };

  render() {
    const { usersCriteria, updating } = this.props;

    return (
      <AvForm model={usersCriteria} onSubmit={this.handleSubmit} className="mb-2">
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="fullNameLabel" for="fullName">
                Tên khách hàng
              </Label>
              <AvField id="fullName" type="text" name="fullName.contains" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="emailLabel" for="email">
                Email
              </Label>
              <AvField id="email" type="text" name="email.contains" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="phoneLabel" for="phone">
                Số điện thoại
              </Label>
              <AvField id="phone" type="text" name="mobilePhone.contains" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="nationalIdNumberLabel" for="nationalIdNumber">
                Số giấy tờ
              </Label>
              <AvField id="nationalIdNumber" type="text" name="nationalIdNumber.contains" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="bibLabel" for="bib">
                BIB
              </Label>
              <AvField id="bib" type="text" name="bib.equals" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="statusLabel" for="status">
                Trạng thái
              </Label>
              <AvField id="status" type="select" name="status.equals">
                <option value="" key="0">
                  --Chọn trạng thái--
                </option>
                <option value={USER_STATUS.ACTIVATED} key="1">
                  Đã kích hoạt
                </option>
                <option value={USER_STATUS.INACTIVE} key="2">
                  Chưa kích hoạt
                </option>
              </AvField>
            </AvGroup>
          </Col>
        </Row>
        <Button color="primary" type="submit">
          <FontAwesomeIcon icon="search" />
          &nbsp; Tìm kiếm
        </Button>
      </AvForm>
    );
  }
}

export default UsersFilterForm;
