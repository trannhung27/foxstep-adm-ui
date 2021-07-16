import React from 'react';
import { AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';
import { Button, Col, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChallengeTypes } from 'app/config/constants';

export interface ICOUTFilterFormProps {
  couCriteria: Record<string, unknown>;
  handleFilter: (couCriteria: Record<string, unknown>) => void;
  updating: boolean;
}

class ChallengesOfUserFilterForm extends React.Component<ICOUTFilterFormProps> {
  handleSubmit = (even, errors, couCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(couCriteria);
  };

  render() {
    const { couCriteria, updating } = this.props;

    return (
      <AvForm model={couCriteria} onSubmit={this.handleSubmit} className="mb-2">
        <Row>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="titleLabel" for="title">
                Tên thử thách
              </Label>
              <AvField id="title" type="text" name="title" />
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="chalTypeLabel" for="chalType">
                Loại thử thách
              </Label>
              <AvField id="chalType" type="select" name="chalType">
                <option value="" key="0">
                  --Chọn loại thử thách--
                </option>
                <option value={ChallengeTypes.INDIVIDUAL} key="1">
                  Thử thách từ cá nhân
                </option>
                <option value={ChallengeTypes.ORGANIZATION} key="2">
                  Thử thách từ BTC
                </option>
              </AvField>
            </AvGroup>
          </Col>
          <Col xs="12" sm="4">
            <AvGroup>
              <Label id="chalTypeLabel" for="chalType">
                Bộ môn
              </Label>
              <AvField id="chalType" type="select" name="chalType">
                <option value="" key="0">
                  --Chọn bộ môn--
                </option>
              </AvField>
            </AvGroup>
          </Col>
        </Row>
        <Row>
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
        </Row>
        <Button color="primary" type="submit">
          <FontAwesomeIcon icon="search" />
          &nbsp; Tìm kiếm
        </Button>
      </AvForm>
    );
  }
}

export default ChallengesOfUserFilterForm;
