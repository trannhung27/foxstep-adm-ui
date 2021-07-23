import * as React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IPageSizePickerProps {
  pageSize: number;
  handleSelect: (e) => any;
}

export class PageSizePicker extends React.Component<IPageSizePickerProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { pageSize, handleSelect } = this.props;
    return (
      <FormGroup>
        <Row className="justify-content-end align-items-center" style={{ margin: '0 0' }}>
          <Col sm="2" md="2" lg="2" className="text-right p-0">
            <Label for="pagesizePicker">Dòng/Trang</Label>
          </Col>
          <Col sm="3" md="3" lg="2">
            <Input
              type="select"
              name="select"
              id="pagesizePicker"
              value={pageSize}
              onChange={event => handleSelect(parseInt(event.target.value, 10))}
            >
              <option>{ITEMS_PER_PAGE}</option>
              <option>{ITEMS_PER_PAGE * 2}</option>
              <option>{ITEMS_PER_PAGE * 3}</option>
              <option>{ITEMS_PER_PAGE * 4}</option>
              <option>{ITEMS_PER_PAGE * 5}</option>
            </Input>
          </Col>
          {this.props.children}
        </Row>
      </FormGroup>
    );
  }
}
