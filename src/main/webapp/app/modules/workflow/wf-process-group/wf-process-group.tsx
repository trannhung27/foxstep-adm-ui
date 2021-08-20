import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './wf-process-group.reducer';
import { PageHeader } from 'antd';

export interface IWfProcessGroupProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const WfProcessGroup = (props: IWfProcessGroupProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const handleSyncList = () => {
    props.getEntities();
  };

  const { wfProcessGroupList, match, loading } = props;
  return (
    <div>
      <PageHeader style={{ padding: '0 0' }} className="site-page-header" title="Nhóm duyệt" />
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
        {wfProcessGroupList && wfProcessGroupList.length > 0 ? (
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {wfProcessGroupList.map((wfProcessGroup, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${wfProcessGroup.id}`} color="link" size="sm">
                      {wfProcessGroup.id}
                    </Button>
                  </td>
                  <td>{wfProcessGroup.name}</td>
                  <td>{wfProcessGroup.status}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${wfProcessGroup.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${wfProcessGroup.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Xóa</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Không có dữ liệu</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ wfProcessGroup }: IRootState) => ({
  wfProcessGroupList: wfProcessGroup.entities,
  loading: wfProcessGroup.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfProcessGroup);
