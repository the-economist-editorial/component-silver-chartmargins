import Dthree from 'd3';
import React from 'react';

export default class SilverChartMargins extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      test: React.PropTypes.string,
      textArray: React.PropTypes.array,
      extraMargins: React.PropTypes.object,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      textArray: [
        { 's': 'Title to come...', 'x': 12, 'y': 15, 'class': 'silver-title-string' },
        { 's': 'Subtitle to come...', 'x': 12, 'y': 30, 'class': 'silver-subtitle-string' },
        { 's': 'Source: to come', 'x': 12, 'y': 5, 'class': 'silver-source-string' },
        { 's': 'Footnote to come...', 'x': 12, 'y': 5, 'class': 'silver-footnote-string' },
      ],
      extraMargins: {
        title: 0,
        subtitle: 0,
        source: 0,
        footnote: 0,
      },
    };
  }

  // CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      'textArray': props.textArray,
      'extraMargins': props.extraMargins,
    };
  }

  // componentWillMount() {
  //   console.log('Will mount');
  // }

  componentDidMount() {
    this.updateStrings();
  }

  componentDidUpdate() {
    this.updateStrings();
  }

  // ===== Dthree stuff begins =====

  // UPDATE STRINGS
  updateStrings() {
    const textArray = this.state.textArray;
    const extraMargins = this.state.extraMargins;
    // Context
    const marginsGroup = Dthree.select('.silver-chart-margins-group');
    // Append text strings to D3 group:
    marginsGroup.selectAll('text')
      .data(textArray)
      .enter()
      .append('text')
      .attr({
        'class': (ddd) => ddd.class,
        'x': (ddd) => ddd.x,
        'y': (ddd) => ddd.y,
      })
      .text((ddd) => ddd.s);
  }
  // UPDATE STRINGS ends

  // =====  Dthree stuff ends  =====

  // RENDER
  render() {
    // Axis group
    return (
      <svg>
      <g className="silver-chart-margins-group">
      </g>
      </svg>
    );
  }
}
