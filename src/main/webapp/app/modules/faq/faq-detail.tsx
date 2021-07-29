import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './faq.reducer';
import { APP_TIMESTAMP_FORMAT, NEWS_STATUSES } from 'app/config/constants';
import { TextFormat } from 'react-jhipster';
import { Descriptions, PageHeader, Tag } from 'antd';
import parse from 'html-react-parser';

export interface IFaqDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FaqDetail = (props: IFaqDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { faqEntity } = props;
  const history = useHistory();

  return (
    <div>
      <PageHeader
        style={{ padding: '0 0' }}
        title={faqEntity.title}
        className="site-page-header"
        extra={[
          <Button key="0" tag={Link} to={`/faqs/${faqEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Sửa</span>
          </Button>,
          <Button key="1" onClick={() => history.goBack()} replace color="info" data-cy="entityDetailsBackButton">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Quay lại</span>
          </Button>,
        ]}
      >
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Người tạo">{faqEntity.user ? faqEntity.user.firstName : ''}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {NEWS_STATUSES.map(status =>
              status.id === faqEntity.status ? <Tag color={status.id === 1 ? 'green' : 'red'}>{status.name}</Tag> : null
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian đăng">
            <TextFormat type="date" value={faqEntity.datePublished} format={APP_TIMESTAMP_FORMAT} />
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div>
        <div className="text-center">{faqEntity.imgUrl ? <img src={faqEntity.imgUrl} alt="" width="40%" /> : ''}</div>
        {faqEntity.description && (
          <p className="m-4 text-muted text-center">
            <i>{faqEntity.description}</i>
          </p>
        )}
        <div>{faqEntity.content && parse(faqEntity.content)}</div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ faqs }: IRootState) => ({
  faqEntity: faqs.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FaqDetail);
