import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Label, Row } from 'reactstrap';
import { AvFeedback, AvField, AvForm, AvGroup } from 'availity-reactstrap-validation';

import { IRootState } from 'app/shared/reducers';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { reset as resetUploadImage } from '../upload-image/upload-image-reducer';
import { createEntity, getEntity, reset, updateEntity } from 'app/modules/users/users.reducer';
import { connect } from 'react-redux';

import { PageHeader } from 'antd';
import { uploadImage } from 'app/modules/upload-image/upload-image-reducer';

export interface IUsersUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UsersUpdate = (props: IUsersUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { usersEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.goBack();
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  // useEffect(() => {
  //   if (usersEntity.content && !isNew)
  //     setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(faqEntity.content))));
  // }, [faqEntity]);

  useEffect(() => {
    if (props.updateSuccess) {
      props.history.push('/users');
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    // values.datePublished = convertDateTimeToServer(values.datePublished);
    //
    // values.content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // if (errors.length === 0) {
    //   const entity = {
    //     ...faqEntity,
    //     ...values,
    //     user: users.find(it => it.id.toString() === values.userId.toString()),
    //     newsCategory: newsCategories.find(it => it.id.toString() === values.newsCategoryId.toString()),
    //   };
    //
    //   if (isNew) {
    //     props.createEntity(entity);
    //   } else {
    //     props.updateEntity(entity);
    //   }
    // }
  };

  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Thông tin khác hàng" />
      <hr />
      <Row>
        <Col>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? { status: 1 } : usersEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup hidden>
                  <Label for="users-id">ID</Label>
                  <AvField id="users-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <Row className="justify-content-between">
                <Col>
                  <AvGroup>
                    <Label id="statusLabel" for="faq-status">
                      Trạng thái: {usersEntity ? usersEntity.status : null}
                    </Label>
                  </AvGroup>
                </Col>
              </Row>

              <AvGroup>
                <Label id="titleLabel" for="news-title">
                  Họ và tên:
                </Label>
                <AvField
                  id="users-name"
                  data-cy="userName"
                  type="text"
                  name="fullName"
                  placeholder="Aa"
                  validate={{
                    required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                    maxLength: { value: 255, errorMessage: 'Tối đa 255 ký tự.' },
                  }}
                />
              </AvGroup>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  adminUser: storeState.authentication.account,
  users: storeState.userManagement.users,
  usersEntity: storeState.users.entity,
  loading: storeState.users.loading,
  updating: storeState.users.updating,
  updateSuccess: storeState.users.updateSuccess,
  uploadImageEntity: storeState.uploadImage.entity,
  uploadingImage: storeState.uploadImage.loading,
});

const mapDispatchToProps = {
  getUsers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
  uploadImage,
  resetUploadImage,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UsersUpdate);
