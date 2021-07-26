import React from 'react';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';

export interface IParticipantsFilterFormProps {
  participantsCriteria: Record<string, unknown>;
  handleFilter: (participants: Record<string, unknown>) => void;
  updating: boolean;
}

class ParticipantsFilterForm extends React.Component<IParticipantsFilterFormProps> {
  private form: any;
  constructor(props) {
    super(props);
    this.cancelFilter = this.cancelFilter.bind(this);
  }

  handleSubmit = (even, errors, participantsCriteria) => {
    const { handleFilter } = this.props;
    handleFilter(participantsCriteria);
  };

  cancelFilter = (event, fields) => {
    this.form && this.form.reset();
  };

  render() {
    const { participantsCriteria, updating } = this.props;

    return <AvForm onSubmit={this.handleSubmit} onReset={this.cancelFilter} ref={c => (this.form = c)}></AvForm>;
  }
}

export default ParticipantsFilterForm;
