import React from 'react';
import { AvField, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IParticipantsFilterFormProps {
  participantsCriteria: Record<string, unknown>;
  handleFilter: (participants: Record<string, unknown>) => void;
  updating: boolean;
  clear: () => void;
}

class ParticipantsFilterForm extends React.Component<IParticipantsFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, participantsCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(participantsCriteria);
  };

  cancelFilter = (event, fields) => {
    this.props.clear();
    this.form && this.form.reset();
  };

  render() {
    const { participantsCriteria, updating } = this.props;

    return (
      <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}>
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="nameLabel" for="name">
                Họ tên
              </Label>
              <AvField id="name" type="text" name="name" placeholder="Aa" value={participantsCriteria['name']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="emailLabel" for="email">
                Email
              </Label>
              <AvField id="email" type="text" name="email" placeholder="Aa" value={participantsCriteria['email']} />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <Label id="statusLabel" for="status">
              Trạng thái tham gia
            </Label>
            <AvField id="status" type="select" name="status" value={participantsCriteria['status']}>
              <option value="" key="0">
                --Chọn trạng thái--
              </option>
              <option value="0" key="1">
                Yêu cầu tham gia
              </option>
              <option value="1" key="2">
                Đã tham gia
              </option>
            </AvField>
          </Col>
          <Col xs="12" sm="2">
            <Button color="primary" type="submit" block>
              <FontAwesomeIcon icon="search" />
              <span className="d-sm-none d-md-none d-lg-inline">&nbsp; Tìm kiếm</span>
            </Button>
          </Col>
          <Col xs="12" sm="2">
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

export default ParticipantsFilterForm;
