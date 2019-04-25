import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import '../../FlightIndicator/css/flightindicators.css';
import $ from 'jquery';
import '../../FlightIndicator/js/jquery.flightindicators.js';

class DroneData extends Component {
  componentDidMount() {
    setTimeout(() => {
      var first_attitude = $.flightIndicator('#first_attitude', 'attitude', {size:350, roll:8, pitch:3, showBox : true});
    }, 4000)
  }

  render() {
    const {
      velocity,
      acceleration,
      altitude
    } = this.props;

    const data = [{
      key: '1',
      velocity,
      acceleration,
      altitude
    }];

    return (
      <div style={{ padding: '1em' }}>
        <span id="first_attitude" />
      </div>
    );
  }
}

DroneData.propTypes = {
  velocity: PropTypes.number.isRequired,
  acceleration: PropTypes.number.isRequired,
  altitude: PropTypes.number.isRequired
};

export default DroneData;
