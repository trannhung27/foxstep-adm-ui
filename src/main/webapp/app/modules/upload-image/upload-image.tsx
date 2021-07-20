import React, { useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { uploadImage as upload } from 'app/modules/upload-image/upload-image-reducer';
import { Button, Row, Col, Label, Collapse, CardBody, Card } from 'reactstrap';
import {
  AvFeedback,
  AvForm,
  AvGroup,
  AvInput,
  AvField,
  AvRadioGroup,
  AvRadio,
  AvCheckboxGroup,
  AvCheckbox,
} from 'availity-reactstrap-validation';
export interface IUploadImage extends StateProps, DispatchProps {}

export const UploadImageInput = (props: IUploadImage) => {
  const { entity, loading } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64File, setBase64File] = useState('');
  const [img, setImg] = useState('');
  const uploadImageToServer = (base64Image: string) => {
    const imageEntity = {
      content: base64Image,
      imageName: 'imageday',
      url: 'http://abc.com',
    };
    props.upload(imageEntity);
  };

  const handleChangeImage = event => {
    setSelectedFile(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      // uploadImageToServer(btoa(reader.result.toString()));
      setBase64File(reader.result.toString());
    };
    reader.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('there are some problems');
    };
  };

  useEffect(() => {}, [base64File]);

  const uploadHandler = () => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function () {
      const imageString = reader.result.toString();
      const imageBase64 = imageString.slice(23, imageString.length);
      uploadImageToServer(imageBase64);
      // setBase64File(btoa(reader.result.toString()));
    };
    reader.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('there are some problems');
    };
    // console.log(base64File);
  };

  // useEffect(() => {
  //   props.getEntities(criteria);
  // }, []);

  return (
    <div>
      <AvGroup>
        <Row className="justify-content-left">
          <Col xs="12" sm="7">
            <Label>Ảnh đại diện TT:</Label>
            <AvInput type="file" name="file" className="upload-file" id="file" onChange={handleChangeImage} required />

            <img style={{ width: '40px', height: '40px' }} src={base64File} />
          </Col>
          <Col xs="12" sm="5">
            <Button color="info" onClick={uploadHandler}>
              Upload!
            </Button>
          </Col>
        </Row>
      </AvGroup>
    </div>
  );
};

const mapStateToProps = ({ uploadImage }: IRootState) => ({
  entity: uploadImage.entity,
  loading: uploadImage.loading,
});

const mapDispatchToProps = {
  upload,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageInput);
