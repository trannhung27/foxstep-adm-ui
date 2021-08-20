import React from 'react';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvForm, AvGroup, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

export interface IUserManagementFilterFormProps {
  userManagementCriteria: Record<string, unknown>;
  handleFilter: (newsCriteria: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
}

class UserManangementFilterForm extends React.Component<IUserManagementFilterFormProps> {
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
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { userManagementCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="emailLabel" for="email">
                Email
              </Label>
              <AvField
                id="email"
                type="text"
                name="email.contains"
                placeholder="Aa"
                value={userManagementCriteria['email.contains']}
                validate={{
                  maxLength: { value: 500, errorMessage: 'Tối đa 500 kí tự.' },
                }}
              />
            </AvGroup>
          </Col>
          <Col xs="12" sm="6">
            <AvGroup>
              <Label id="firstNameLabel" for="firstName">
                Họ tên
              </Label>
              <AvField
                id="firstName"
                type="text"
                name="firstName.contains"
                placeholder="Aa"
                value={userManagementCriteria['firstName.contains']}
                validate={{
                  maxLength: { value: 500, errorMessage: 'Tối đa 500 kí tự.' },
                }}
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

export default UserManangementFilterForm;
