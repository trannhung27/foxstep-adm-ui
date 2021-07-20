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
  const uploadImageToServer = (base64Image: string) => {
    const imageEntity = {
      content: base64Image,
      imageName: 'imageday',
      url: 'http://abc.com',
    };
    props.upload(imageEntity);
  };

  // const getEmergencyFoundImg = urlImg => {
  //   const img = new Image();
  //   img.src = urlImg;
  //   img.crossOrigin = 'Anonymous';
  //
  //   const canvas = document.createElement('canvas'),
  //     ctx = canvas.getContext('2d');
  //
  //   canvas.height = img.naturalHeight;
  //   canvas.width = img.naturalWidth;
  //   ctx.drawImage(img, 0, 0);
  //
  //   const b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
  //   return b64;
  // };

  const handleChangeImage = event => {
    setSelectedFile(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function () {
      // uploadImageToServer(btoa(reader.result.toString()));
      setBase64File(reader.result.toString());
    };
    reader.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('there are some problems');
    };
  };

  const getBase64 = file => {
    const baseURL = '';
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);
  };
  const uploadHandler = () => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function () {
      uploadImageToServer(btoa(reader.result.toString()));
      setBase64File(btoa(reader.result.toString()));
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
            <img src={`${base64File}`} />
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
