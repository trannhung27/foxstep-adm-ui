import React, { useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { uploadImage as upload } from 'app/modules/upload-image/upload-image-reducer';

export interface IUploadImage extends StateProps, DispatchProps {}

export const UploadImageInput = (props: IUploadImage) => {
  const { entity, loading } = props;

  const uploadImageToServer = () => {
    const imageEntity = {
      content: 'kien',
      imageName: 'imageday',
    };
    upload(imageEntity);
  };

  // useEffect(() => {
  //   props.getEntities(criteria);
  // }, []);

  return (
    <div>
      <button onClick={uploadImageToServer}>Upload</button>
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
