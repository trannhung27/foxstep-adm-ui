import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './wf-process.reducer';
import { IWfProcess } from 'app/shared/model/workflow/wf-process.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWfProcessProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WfProcess = (props: IWfProcessProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { wfProcessList, match, loading } = props;
  return (
    <div>
      <h2 id="wf-process-heading" data-cy="WfProcessHeading">
        Wf Processes
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh List
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Wf Process
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {wfProcessList && wfProcessList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Wf Process Group</th>
                <th>Wf Action Type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {wfProcessList.map((wfProcess, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${wfProcess.id}`} color="link" size="sm">
                      {wfProcess.id}
                    </Button>
                  </td>
                  <td>{wfProcess.type}</td>
                  <td>{wfProcess.status}</td>
                  <td>
                    {wfProcess.wfProcessGroup ? (
                      <Link to={`wf-process-group/${wfProcess.wfProcessGroup.id}`}>{wfProcess.wfProcessGroup.name}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{wfProcess.authority ? wfProcess.authority.name : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${wfProcess.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${wfProcess.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${wfProcess.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Wf Processes found</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ wfProcess }: IRootState) => ({
  wfProcessList: wfProcess.entities,
  loading: wfProcess.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcess);
