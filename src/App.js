import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import LineC from './LineChart';

class App extends Component {
    state = {
        data: [12, 5, 6, 6, 9, 10],
        width: 700,
        height: 500,
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <LineC/>
            </div>
        );
    }
}

export default App;
