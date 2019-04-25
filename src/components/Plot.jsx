import React, { Component } from 'react';
import {
  Chart, Geom, Axis, Tooltip, Legend
} from 'bizcharts';
import DataSet from '@antv/data-set';

import Navbar from './Global/Navbar';

class Plot extends Component {
  constructor() {
    super();

    this.state = {
      data: [
        { month: '10:30', cubesat1: 7.0, neutron1: 3.9 },
        { month: '10:31', cubesat1: 6.9, neutron1: 4.2 },
        { month: '10:32', cubesat1: 9.5, neutron1: 5.7 },
        { month: '10:33', cubesat1: 14.5, neutron1: 8.5 },
        { month: '10:34', cubesat1: 18.4, neutron1: 11.9 },
        { month: '10:35', cubesat1: 21.5, neutron1: 15.2 },
        { month: '10:36', cubesat1: 25.2, neutron1: 17.0 },
        { month: '10:37', cubesat1: 26.5, neutron1: 16.6 },
        { month: '10:38', cubesat1: 23.3, neutron1: 14.2 },
        { month: '10:39', cubesat1: 18.3, neutron1: 10.3 },
        { month: '10:40', cubesat1: 13.9, neutron1: 6.6 },
        { month: '10:41', cubesat1: 9.6, neutron1: 4.8 }
      ]
    };
  }

  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.state.data);
    dv.transform({
      type: 'fold',
      fields: ['cubesat1', 'neutron1'],
      key: 'satellite',
      value: 'temperature'
    });

    console.log(dv);

    const cols = {
      month: {
        range: [0, 1]
      }
    };

    return (
      <div>
        <Navbar
          current="plot"
        />
        <br />
        <Chart
          height={400}
          data={dv}
          scale={cols}
          forceFit
        >
          <Legend />

          <Axis
            name="month"
          />

          <Axis
            name="temperature"
            label={{ formatter: val => `${val}°C` }}
          />

          <Tooltip
            crosshairs={{ type: 'y' }}
          />

          <Geom
            type="line"
            position="month*temperature"
            size={2}
            color="satellite"
          />

          <Geom
            type="point"
            position="month*temperature"
            size={4}
            shape="circle"
            color="satellite"
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      </div>
    );
  }

}

export default Plot;
