// SilverChartMargins is a child of ChartWrapper
import Dthree from 'd3';
import React from 'react';

export default class SilverChartMargins extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      test: React.PropTypes.string,
      config: React.PropTypes.object,
      textArray: React.PropTypes.array,
      extraMargins: React.PropTypes.object,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      config: {
        strings: {
          // (co-ords are text anchor -- bottom left/right)
          title: { 'content': 'Title', 'x': 12, 'y': 15, 'class': 'silver-title-string' },
          subtitle: { 'content': 'Subtitle', 'x': 12, 'y': 30, 'class': 'silver-subtitle-string' },
          source: { 'content': 'Source', 'x': 12, 'y': -5, 'class': 'silver-source-string' },
          footnote: { 'content': 'Footnote', 'x': -12, 'y': -5, 'class': 'silver-footnote-string' },
        },
        dimensions: { 'width': 160, 'height': 155 },
      },
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

  componentWillMount() {
    // Disentangle the strings from the inherited config object
    const strings = this.props.config.strings;
    const textArray = Object.keys(strings).map((key) => strings[key]);
    this.setState({ textArray });
  }

  componentDidMount() {
    this.updateBackground();
    this.updateStrings();
  }

  componentDidUpdate() {
    this.updateBackground();
    this.updateStrings();
  }

  // ===== Dthree stuff begins =====

  updateBackground() {
    const backArray = this.props.config.background;
    // Context
    const marginsGroup = Dthree.select('.silver-chart-margins-group');
    const boundShape = marginsGroup.selectAll('rect')
      .data(backArray)
      ;
    // Enter
    boundShape.enter().append('rect')
      .attr({
        'class': 'silver-d3-background-rect',
        'fill': (ddd) => ddd.fill,
      });
    // Update
    boundShape
      .transition().duration(2000)
      .attr({
        'x': (ddd) => ddd.x,
        'y': (ddd) => ddd.y,
        'height': (ddd) => ddd.height,
        'width': (ddd) => ddd.width,
      })
    ;
    // Exit
    boundShape.exit().remove();
  }

  // UPDATE STRINGS
  updateStrings() {
    const textArray = this.state.textArray;
    // OK: next isn't used... but it might be... eventually.
    const extraMargins = this.state.extraMargins;
    const chartWidth = this.props.config.dimensions.width;
    const chartHeight = this.props.config.dimensions.height;
    // Context
    const marginsGroup = Dthree.select('.silver-chart-margins-group');
    // Bind text strings to D3 group:
    const boundText = marginsGroup.selectAll('text')
      .data(textArray);
    // Enter
    boundText
      .enter()
      .append('text');
    // Update
    boundText
      .transition().duration(500)
      .attr({
        'class': (ddd) => ddd.class,
        'x': (ddd) => {
          let val = ddd.x;
          if (val < 0) {
            // If xpos < 0, we're positioning relative to right edge
            val += chartWidth;
          }
          return val;
        },
        'y': (ddd) => {
          let val = ddd.y;
          if (val < 0) {
            // If ypos < 0, we're positioning relative to bottom
            val += chartHeight;
          }
          return val;
        },
      })
      .text((ddd) => ddd.content);
      // Exit
    boundText.exit().remove();
  }
  // UPDATE STRINGS ends

  // =====  Dthree stuff ends  =====

  // RENDER
  render() {
    return (
      <g className="silver-chart-margins-group"/>
    );
  }
}
