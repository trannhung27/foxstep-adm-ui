import React, { useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset, uploadImage as upload } from 'app/modules/upload-image/upload-image-reducer';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvGroup, AvField } from 'availity-reactstrap-validation';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IUploadImage extends StateProps, DispatchProps {
  label: string;
  initImage: string;
  required: boolean;
}

export const UploadImageInput = (props: IUploadImage) => {
  const { entity, loading } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64File, setBase64File] = useState('');
  const uploadImageToServer = (base64Image: string) => {
    const imageEntity = {
      content: base64Image,
      imageName: 'foxstepsImage',
      url: '',
    };
    props.upload(imageEntity);
  };

  const chooseImage = () => {
    document.getElementById('uploadFile').click();
  };

  const handleChangeImage = event => {
    setSelectedFile(event.target.files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      setBase64File(reader.result.toString());
    };
  };

  useEffect(() => {
    setBase64File(props.initImage);
    props.reset();
  }, []);

  useEffect(() => {
    props.reset();
  }, [base64File]);

  const uploadHandler = () => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = function () {
      const imageBase64 = reader.result.toString().split(',')[1];
      uploadImageToServer(imageBase64);
    };
    reader.onerror = function () {
      // eslint-disable-next-line no-console
      console.log('there are some problems');
    };
  };

  return (
    <div>
      <AvGroup className="form-group">
        <Row>
          <Col sm="6" xs="12">
            <Label>{props.label}</Label>
            <img style={{ width: '300px', height: '240px' }} src={base64File} />
            <Button color="success" onClick={chooseImage}>
              <FontAwesomeIcon icon={faUpload} /> Tải ảnh
            </Button>

            <AvField
              type="file"
              hidden
              accept="image/png, image/gif, image/jpeg"
              name="file"
              className="upload-file"
              id="uploadFile"
              onChange={handleChangeImage}
              validate={{}}
            />
          </Col>
        </Row>

        <Button color="info" onClick={uploadHandler}>
          Upload!
        </Button>
      </AvGroup>
      {props.entity.url ? (
        <text>
          <FontAwesomeIcon icon={faCheck} />
          Thành công
        </text>
      ) : null}
    </div>
  );
};

const mapStateToProps = ({ uploadImage }: IRootState) => ({
  entity: uploadImage.entity,
  loading: uploadImage.loading,
});

const mapDispatchToProps = {
  upload,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UploadImageInput);
