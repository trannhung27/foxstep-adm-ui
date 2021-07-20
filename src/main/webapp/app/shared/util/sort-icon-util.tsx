import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

export interface ISortItemProps {
  sortBy: string;
  paginationState: any;
}

export class SortIcon extends React.Component<ISortItemProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { sortBy, paginationState } = this.props;
    return (
      <span>
        {paginationState.sort === sortBy ? (
          <FontAwesomeIcon icon={paginationState.order === 'asc' ? faSortUp : faSortDown} color="royalBlue" />
        ) : (
          <FontAwesomeIcon icon="sort" />
        )}
      </span>
    );
  }
}
