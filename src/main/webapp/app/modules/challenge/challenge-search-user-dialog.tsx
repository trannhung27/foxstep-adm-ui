import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col, Label, Table } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getCustomer } from '../users/users.reducer';
import { update as updateWorkflow } from '../workflow/workflow-request.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';
export interface IChallengeUserDialogProps extends StateProps, DispatchProps {
  showModal: boolean;
  onClose: () => void;
  choose: (email: string, userId: number) => void;
}

export const ChallengeUserDialog = (props: IChallengeUserDialogProps) => {
  useEffect(() => {
    props.getCustomer();
  }, []);

  const handleClose = () => {
    // props.history.push('/challenges/new', { email: customer.email, userId: customer.id });
    props.onClose();
  };

  const [showModalIn, setShowModalIn] = useState(props.showModal);
  const findACustomer = (value: string) => {
    props.getCustomer(value);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const { customer } = props;

  const [searchValue, setSearchValue] = useState('');
  return (
    <Modal size="lg" toggle={handleClose} isOpen={props.showModal} backdrop="static" id="challenge-searchuser" autoFocus={false}>
      <ModalHeader toggle={handleClose} data-cy="challengeUserDialogHeading">
        Tìm khách hàng
      </ModalHeader>
      <ModalBody id="foxstep2AdminWebappApp.challenge.search-user.question">
        <AvForm>
          <AvGroup>
            <AvInput
              name="searchInfo"
              placeholder="Nhập email, tên, BIB hoặc SĐT của khách hàng để tìm kiếm"
              onChange={event => {
                setSearchValue(event.target.value);
              }}
            />
            <Button color="primary" type="submit" onClick={() => findACustomer(searchValue)}>
              Tìm
            </Button>
          </AvGroup>
        </AvForm>

        <hr style={{ backgroundColor: 'DodgerBlue', height: '2px' }} />
        <div className="table-responsive">
          {customer ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className="hand">
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand">Email</th>
                  <th className="hand">Tên khách hàng</th>
                  <th className="hand">Số điện thoại</th>
                  <th className="hand">BIB</th>
                  <th className="hand">Địa chỉ</th>
                  <th className="hand">
                    <div></div>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr data-cy="entityTable">
                  <td>{customer.id}</td>
                  <td>{customer.email}</td>
                  <td>{customer.fullName}</td>
                  <td>{customer.mobilePhone}</td>
                  <td>{customer.bib}</td>
                  <td>{customer.strAddress}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        // tag={Link}
                        // to={{ pathname: `/challenges/new`, state: { email: customer.email, userId: customer.id } }}
                        onClick={() => props.choose(customer.email, customer.id)}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <span className="d-none d-md-inline">Chọn</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Users found</div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        {/*<Button id="jhi-confirm-delete-challenge" data-cy="entityApproveChallengeButton" color="danger" onClick={approveChallenge}>*/}
        {/*  &nbsp; Có*/}
        {/*</Button>*/}
        {/*<Button color="secondary" onClick={handleClose}>*/}
        {/*  &nbsp; Không*/}
        {/*</Button>*/}
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ users, wfRequest }: IRootState) => ({
  customer: users.entity,
  updateSuccess: wfRequest.updateSuccess,
});

const mapDispatchToProps = { updateWorkflow, getCustomer };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeUserDialog);
