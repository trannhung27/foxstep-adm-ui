import React from 'react';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { APP_USER_STATUS } from 'app/config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface INewsFilterFormProps {
  usersCriteria: Record<string, unknown>;
  handleFilter: (newsCriteria: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
}

class UsersFilterForm extends React.Component<INewsFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, usersCriteria) => {
    const { handleFilter } = this.props;
    if (errors.length === 0) handleFilter(usersCriteria);
  };

  cancelFilter = (event, fields) => {
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { usersCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="fullNameLabel" for="fullName">
                Tên khách hàng
              </Label>
              <AvField id="fullName" type="text" name="fullName.contains" placeholder="Aa" value={usersCriteria['fullName.contains']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="emailLabel" for="email">
                Email
              </Label>
              <AvField id="email" type="text" name="email.contains" placeholder="Aa" value={usersCriteria['email.contains']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="phoneLabel" for="phone">
                Số điện thoại
              </Label>
              <AvField id="phone" type="text" name="mobilePhone.contains" placeholder="123" value={usersCriteria['mobilePhone.contains']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="nationalIdNumberLabel" for="nationalIdNumber">
                Số giấy tờ
              </Label>
              <AvField
                id="nationalIdNumber"
                type="text"
                name="nationalIdNumber.contains"
                placeholder="123"
                value={usersCriteria['nationalIdNumber.contains']}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="bibLabel" for="bib">
                BIB
              </Label>
              <AvField id="bib" type="text" name="bib.equals" placeholder="123" value={usersCriteria['bib.equals']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="statusLabel" for="status">
                Trạng thái
              </Label>
              <AvField id="status" type="select" name="status.equals" value={usersCriteria['status.equals']}>
                <option value="" key="0">
                  --Chọn trạng thái--
                </option>
                <option value={APP_USER_STATUS[0].id} key="1">
                  {APP_USER_STATUS[0].name}
                </option>
                <option value={APP_USER_STATUS[1].id} key="2">
                  {APP_USER_STATUS[1].name}
                </option>
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

export default UsersFilterForm;
