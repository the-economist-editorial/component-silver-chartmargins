import 'babel-polyfill';
import SilverChartmargins from '../src';
import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
chai.use(chaiEnzyme()).should();
describe('SilverChartmargins', () => {

  it('renders a React element', () => {
    React.isValidElement(<SilverChartmargins />).should.equal(true);
  });

  describe('Rendering', () => {
    let rendered = null;
    let silverChartmargins = null;
    beforeEach(() => {
      rendered = mount(<SilverChartmargins />);
      silverChartmargins = rendered.find('.silver-chartmargins');
    });

    it('renders a top level div.silver-chartmargins', () => {
      silverChartmargins.should.have.tagName('div');
      silverChartmargins.should.have.className('silver-chartmargins');
    });

    xit('renders <FILL THIS IN>', () => {
      silverChartmargins.should.have.exactly(1).descendants('.the-descendent-class');
      silverChartmargins.find('.the-descendent-class').should.have.tagName('TAG');
    });

  });

});
