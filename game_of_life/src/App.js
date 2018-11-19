import React, { Component } from 'react';
import './App.css';
import Conway from './components/conway';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Conway />
      </div>
    );
  }
}

export default App;
