// SilverChartMargins is a child of the current chart style componentWillMount
/* eslint-disable prefer-reflect */
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
  // This component maintains class names for the elements that it appends
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
      // NOTE: I don't know if this'll ever get used, but it's
      // at least a reminder to myself...
      'extraMargins': props.extraMargins,
    };
  }

  componentWillMount() {
    const strings = this.props.config.strings;
    this.restateStrings(strings);
  }

  componentDidMount() {
    this.updateBackground();
    this.updateStrings();
  }

  componentWillReceiveProps(newProps) {
    const strings = newProps.config.strings;
    this.restateStrings(strings);
  }

  componentDidUpdate() {
    this.updateBackground();
    this.updateStrings();
  }

  // RESTATE STRINGS
  // Called from componentWillMount/ReceiveProps
  // Appends classes (from internal prop) to strings.
  // Then converts strings object to D3-friendly array,
  // which it puts on state...
  restateStrings(target) {
    // Append class names to string definitions
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

  // ===== Dthree stuff begins =====

  // UPDATE BACKGROUND
  // Background shapes...
  updateBackground() {
    const config = this.props.config;
    const backArray = config.backgroundShapes;
    const chartHeight = config.dimensions.outerbox.height;
    const chartWidth = config.dimensions.outerbox.width;
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
      .transition().duration(config.duration)
      .attr({
        'x': (ddd) => ddd.x,
        'y': (ddd) => ddd.y,
        // Height and width can be absolute px values, or a percent
        // of the containing outerbox...
        'height': (ddd) => {
          // Default is value from context config
          let height = ddd.height;
          // But if element's size is adjustable, express as % of outerbox
          // (assumed to be percent val)
          if (ddd.adjustable.height) {
            const percent = parseFloat(ddd.height, 10);
            height = chartHeight / 100 * percent;
          }
          return height;
        },
        'width': (ddd) => {
          let width = ddd.width;
          if (ddd.adjustable.width) {
            const percent = parseFloat(ddd.width, 10);
            width = chartWidth / 100 * percent;
          }
          return width;
        },
      })
    ;
    // Exit
    boundShape.exit().remove();
  }

  // UPDATE STRINGS
  updateStrings() {
    const config = this.props.config;
    const textArray = this.state.textArray;
    // NOTE: next isn't used... but it might be... eventually.
    // const extraMargins = this.state.extraMargins;
    const chartWidth = config.dimensions.outerbox.width;
    const chartHeight = config.dimensions.outerbox.height;
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
      .transition().duration(config.duration)
      .attr({
        'wrapwidth': (ddd) => ddd.wrapwidth,
        'leading': (ddd) => ddd.leading,
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
      // Bostock's original had a linecounter, but I don't seem to need that...
      let line = [];
      const leading = `${thisText.attr('leading')}px`;
      let tspan = thisText.text(null).append('tspan').attr('x', xPos).attr('dy', 0);
      while (words.length > 0) {
        const word = words.pop();
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > wrapWidth) {
          // debugger;
          line.pop();
          tspan.text(line.join(' '));
          line = [ word ];
          tspan = thisText.append('tspan').attr('x', xPos).attr('dy', leading).text(word);
        }
      }
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
