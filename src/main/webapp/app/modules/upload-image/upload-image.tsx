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
      <Row>
        <Label>Ảnh đại diện TT:</Label>
      </Row>
      <img style={{ width: '300px', height: '240px' }} src={base64File} />
      <AvGroup className="form-group form-inline">
        <AvInput type="file" name="file" className="upload-file" id="file" onChange={handleChangeImage} required />
        <Button color="info" onClick={uploadHandler}>
          Upload!
        </Button>
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
