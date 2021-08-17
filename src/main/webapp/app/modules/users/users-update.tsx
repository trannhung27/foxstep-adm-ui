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

              {/*<Row>*/}
              {/*  <Col xs="12" sm="6">*/}
              {/*    <AvGroup className="form-group form-inline" >*/}
              {/*      <Label style={{ marginRight: '10px' }} id="titleLabel" for="challenge-title">*/}
              {/*       Trạng thái:*/}
              {/*      </Label>*/}
              {/*      <AvField*/}
              {/*        id="users-status"*/}
              {/*        data-cy="status"*/}
              {/*        type="text"*/}
              {/*        name="status"*/}
              {/*        validate={{*/}
              {/*          required: { value: true, errorMessage: 'This field is required.' },*/}
              {/*          minLength: {*/}
              {/*            value: 5,*/}
              {/*            errorMessage: 'This field is required to be at least 5 characters.',*/}
              {/*          },*/}
              {/*          maxLength: {*/}
              {/*            value: 200,*/}
              {/*            errorMessage: 'This field cannot be longer than 200 characters.',*/}
              {/*          },*/}
              {/*        }}*/}
              {/*      />*/}
              {/*    </AvGroup>*/}
              {/*  </Col>*/}

              {/*  <Col xs="12" sm="6">*/}
              {/*  </Col>*/}
              {/*</Row>*/}

              <Row form>
                <Col md={4}>
                  <AvGroup className="form-inline" row>
                    <Col md={3}>
                      <Label id="statusLabel" for="users-status">
                        Trạng thái: {usersEntity ? usersEntity.status : null}
                      </Label>
                    </Col>
                    <Col md={9}>
                      <AvField id="users-status" data-cy="userStatus" type="text" name="status" />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={4}>
                  <AvGroup className="form-inline" row>
                    <Col md={3}>
                      <Label id="usersName" for="users-name">
                        Họ và tên:
                      </Label>
                    </Col>
                    <Col md={9}>
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
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={4}>
                  <AvGroup className="form-inline" row>
                    <Col md={3} className="justify-content-left">
                      <Label id="usersEmail" for="users-email">
                        Email: &nbsp; &nbsp; &nbsp;
                      </Label>
                    </Col>
                    <Col md={9}>
                      <AvField
                        id="users-email"
                        data-cy="userEmail"
                        type="text"
                        name="email"
                        validate={{
                          required: { value: true, errorMessage: 'Giá trị bắt buộc.' },
                          maxLength: { value: 255, errorMessage: 'Tối đa 255 ký tự.' },
                        }}
                      />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>
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
