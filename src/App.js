import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineC from './LineChart';
import PollutionCloudMap from './PollutionCloudMap';

class App extends Component {
  render() {
    return (
      <div className="App">
          <PollutionCloudMap/>
      </div>
    );
  }
}

export default App;
