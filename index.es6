import Dthree from 'd3';
import React from 'react';

export default class SilverChartMargins extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      test: React.PropTypes.string,
      config: React.PropTypes.object,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {};
  }

  // CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {};
  }

  // ===== Dthree stuff begins =====

  // =====  Dthree stuff ends  =====

  // RENDER
  render() {
    // Axis group
    return (
      <g className="silver-chart-margins-group"/>
    );
  }
}
