import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './wf-process.reducer';
import { PageHeader } from 'antd';

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
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Loại yêu cầu" />
      <hr />

      <div className="d-flex justify-content-end p-1">
        <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} /> Làm mới
        </Button>
        <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Tạo mới
        </Link>
      </div>

      <div className="table-responsive">
        {wfProcessList && wfProcessList.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Loại yêu cầu</th>
                <th>Trạng thái</th>
                <th>Nhóm</th>
                <th>Quyền duyệt</th>
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
                  <td>{wfProcess.type === 1 ? 'Tạo mới' : 'Chỉnh sửa'}</td>
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
                      <Button tag={Link} to={`${match.url}/${wfProcess.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${wfProcess.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
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
