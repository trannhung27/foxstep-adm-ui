import React, { useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { getEntities } from 'app/modules/workflow/wf-action/wf-action-reducer';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { TextFormat } from 'react-jhipster';

export interface IWfActionProps extends StateProps, DispatchProps {
  contentId: number;
  groupId: number;
}

export const WfAction = (props: IWfActionProps) => {
  const { contentId, groupId, wfActionList, loading } = props;
  const criteria = {
    contentId,
    groupId,
  };

  useEffect(() => {
    props.getEntities(criteria);
  }, []);

  return (
    <div className="table-responsive">
      {wfActionList && wfActionList.length > 0 ? (
        <Table responsive>
          <thead>
            <tr>
              <th>STT</th>
              <th>Người thực hiện</th>
              <th>Chức vụ</th>
              <th>Hành động</th>
              <th>Trạng thái yêu cầu</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {wfActionList.map((action, i) => (
              <tr key={`entity-${i}`} data-cy="entityTable">
                <td>{1 + i}</td>
                <td>{action.email}</td>
                <td>{action.userType}</td>
                <td>{action.actionType}</td>
                <td>{action.requestStatus}</td>
                <td>{action.datCreated ? <TextFormat type="date" value={action.datCreated} format={APP_TIMESTAMP_FORMAT} /> : null}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !loading && <div className="alert alert-warning">No Workflow Actions found</div>
      )}
    </div>
  );
};

const mapStateToProps = ({ wfAction }: IRootState) => ({
  wfActionList: wfAction.entities,
  loading: wfAction.loading,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WfAction);
