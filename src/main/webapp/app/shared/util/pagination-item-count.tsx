import * as React from 'react';

export interface IJhiItemCountProps {
  page: number;
  total: number;
  itemsPerPage: number;
  i18nEnabled?: boolean;
}

export class PaginationItemCount extends React.Component<IJhiItemCountProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { page, total, itemsPerPage, i18nEnabled } = this.props;
    return (
      <div>
        <span>
          Hiện {(page - 1) * itemsPerPage === 0 ? 1 : (page - 1) * itemsPerPage + 1} -{' '}
          {page * itemsPerPage < total ? page * itemsPerPage : total} của {total}.
        </span>
      </div>
    );
  }
}
