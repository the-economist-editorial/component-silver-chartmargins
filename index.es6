// SilverChartMargins is a child of ChartWrapper
import Dthree from 'd3';
import React from 'react';

export default class SilverChartMargins extends React.Component {

  // PROP TYPES
  static get propTypes() {
    return {
      config: React.PropTypes.object,
      test: React.PropTypes.string,
      extraMargins: React.PropTypes.object,
      stringClasses: React.PropTypes.object,
    };
  }

  // DEFAULT PROPS
  static get defaultProps() {
    return {
      stringClasses: {
        title: { class: 'silver-d3-title-string' },
        subtitle: { class: 'silver-d3-subtitle-string' },
        source: { class: 'silver-d3-source-string' },
        footnote: { class: 'silver-d3-footnote-string' },
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
      'textArray': {},
      // I don't know if this'll ever get used, but it's
      // at least a reminder to myself...
      'extraMargins': props.extraMargins,
    };
  }

  componentWillMount() {
    // Append class names to string definitions
    // debugger;
    const target = this.props.config.strings;
    const strList = Object.keys(target);
    const source = this.props.stringClasses;
    for (const i in strList) {
      const str = strList[i];
      // Assign class to default config object
      target[str] = Object.assign(target[str], source[str]);
    }
    // Convert to array (for D3)
    const textArray = Object.keys(target).map((key) => target[key]);
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
    const backArray = this.props.config.backgroundShapes;
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
    // NOTE: next isn't used... but it might be... eventually.
    // const extraMargins = this.state.extraMargins;
    const chartWidth = this.props.config.dimensions.outerbox.width;
    const chartHeight = this.props.config.dimensions.outerbox.height;
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
        'wrapwidth': (ddd) => ddd.wrapwidth,
        'leading': (ddd) => {
          return ddd.leading;
        },
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
        'dy': 0,
      })
      .call(this.wrapText, chartWidth)
      ;
      // Exit
    boundText.exit().remove();
  }
  // UPDATE STRINGS ends

  // WRAP TEXT
  // Called from updateStrings to wrap title etc strings as SVG
  // tspan elements. Params are D3 text element and wrap-width
  wrapText(textElement, cWidth) {
    // Allow 'function' and 'this', for D3...
    /* eslint-disable func-names, no-invalid-this */
    textElement.each(function () {
      const thisText = Dthree.select(this);
      // Extract properties from D3 bound data, since they
      // don't seem to survive the call...
      thisText.attr({
        'content': (ddd) => ddd.content,
        'class': (ddd) => ddd.class,
        'wrapwidth': (ddd) => ddd.wrapwidth,
        'leading': (ddd) => ddd.leading,
        'x': (ddd) => {
          let xVal = ddd.x;
          // Right-aligned?
          if (xVal < 0) {
            xVal += cWidth;
          }
          return xVal;
        },
      });
      const wrapWidth = thisText.attr('wrapwidth');
      // String content as reversed array, by word
      const content = thisText.attr('content');
      const words = content.split(/\s+/).reverse();
      // X pos for tspans
      const xPos = `${thisText.attr('x')}px`;
      let line = [];
      let lineNumber = 0;
      const leading = `${thisText.attr('leading')}px`;
      let dyPos = 0;
      let tspan = thisText.text(null).append('tspan').attr('x', xPos).attr('dy', `${dyPos}em`);
      while (words.length > 0) {
        const word = words.pop();
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > wrapWidth) {
          // debugger;
          line.pop();
          tspan.text(line.join(' '));
          line = [ word ];
          lineNumber++;
          // dyPos = `${leading}em`;
          // dyPos = `${lineNumber * leading}em`;
          tspan = thisText.append('tspan').attr('x', xPos).attr('dy', leading).text(word);
        }
      }
      // console.log(content + 'spread over ' + (lineNumber + 1) + ' lines');
    });
  }
  // WRAP TEXT ends

  // =====  Dthree stuff ends  =====

  // RENDER
  render() {
    return (
      <g className="silver-chart-margins-group"/>
    );
  }
}
