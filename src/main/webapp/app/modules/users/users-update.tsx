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
import { convertDateTimeFromServer, displayDefaultTimeStamp } from 'app/shared/util/date-utils';

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

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="userFullnameLabel" for="user-fullName">
                        Họ và tên:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-fullName" className="form-control" name="fullName" />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="userFullnameLabel" for="user-fullName">
                        Avatar:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <img src="https://l.facebook.com/l.php?u=https%3A%2F%2Fsapi.fpt.vn%2Ffoxstep-auth-api-dev%2Fauth%2Fapi%2Fimage%3Fdetail%3D20210817%252Fset_1%252F20210817084251_admin_foxstepsImage.png%26fbclid%3DIwAR3_nVuhWTf3d9MMCsfZBiumXM5Vcx9KGdzDUvHTxD_wTATh-WCLEgAnmmE&h=AT32Un8RBAt84VzhmdcNbAHdxT3qvGsEeuMWoEhTK69DOoxtOCn9Z4i9DVBeFDcgC7ZBmTZbcj4TYE2w19-qza7858GAGR1NN7adAP2qq8SwfiYXlkn0y3gcTLUDxBxZspJhvQ" />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="userEmailLabel" for="user-email">
                        Email:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-email" className="form-control" name="email" disabled />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={6}></Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelNationalIdNumber" for="user-nationalIdNumber">
                        Số giấy tờ:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField
                        id="user-nationalIdNumber"
                        className="form-control"
                        name="nationalIdNumber"
                        value={usersEntity.nationalIdNumber}
                      />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={2}>
                      <Label style={{ paddingTop: '5px' }} id="labelBirthday" for="user-birthday">
                        Ngày sinh:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-birthday" className="form-control" name="nationalIdNumber" value={usersEntity.birthday} />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelMobilePhone" for="user-mobilePhone">
                        Số điện thoại:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-mobilePhone" className="form-control" name="nationalIdNumber" value={usersEntity.mobilePhone} />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={2}>
                      <Label style={{ paddingTop: '5px' }} id="labelShirtSize" for="user-shirtSize">
                        Size áo:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-shirtSize" className="form-control" name="nationalIdNumber" value={usersEntity.shirtSize} />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelGender" for="user-gender">
                        Giới tính:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-gender" type="select" className="form-control" name="gender" value={usersEntity.gender}>
                        <option value={0}>Nữ</option>
                        <option value={1}>Nam</option>
                      </AvField>
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={2}>
                      <Label style={{ paddingTop: '5px' }} id="labelWeight" for="user-weight">
                        Cân nặng:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-weight" className="form-control" name="weight" value={usersEntity.weight} />
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelHeight" for="user-height">
                        Chiều cao:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField
                        id="user-height"
                        className="form-control"
                        name="height"
                        value={usersEntity.height ? usersEntity.height + ' (cm) ' : ''}
                      />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}></Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelBib" for="user-bib">
                        BIB:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField
                        id="user-bib"
                        className="form-control"
                        disabled
                        name="bib"
                        value={usersEntity.bib ? usersEntity.bib + ' (cm) ' : ''}
                      />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}></Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelBib" for="user-bib">
                        Số nhà/Đường phố:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField
                        id="user-bib"
                        className="form-control"
                        name="bib"
                        value={usersEntity.bib ? usersEntity.bib + ' (cm) ' : ''}
                      />
                    </Col>
                  </AvGroup>
                </Col>
                <Col md={5}></Col>
              </Row>

              <div className="content" style={{ fontWeight: 'bold' }}>
                Địa chỉ:
              </div>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelIdProvince" for="user-idProvince">
                        Tỉnh/Thành phố:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-gender" type="select" className="form-control" name="gender" value={usersEntity.gender}>
                        <option value={0}>Hà Nội</option>
                        <option value={1}>Hà Tĩnh</option>
                      </AvField>
                    </Col>
                  </AvGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelIdProvince" for="user-idDistrict">
                        Quận huyện:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-idDistrict" type="select" className="form-control" name="idDistrict" value={usersEntity.idDistrict}>
                        <option value={0}>Hoàn Kiếm</option>
                      </AvField>
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelIdProvince" for="user-idWard">
                        Phường xã:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-gender" type="select" className="form-control" name="gender" value={usersEntity.idWard}>
                        <option value={0}>Chương Dương</option>
                      </AvField>
                    </Col>
                  </AvGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={5}>
                  <AvGroup row>
                    <Col md={3}>
                      <Label style={{ paddingTop: '5px' }} id="labelStrAddress" for="user-strAddress">
                        Số nhà/Đường phố:
                      </Label>
                    </Col>
                    <Col md={6}>
                      <AvField id="user-strAddress" className="form-control" name="strAddress" value={usersEntity.strAddress} />
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
