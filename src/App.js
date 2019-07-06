import React, { Component } from 'react';
// import './App.css';
import {Provider} from "react-redux";
import store from "./store"
import Container from './components/Container';

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <Container  />
      </Provider>
    );
  }
}

export default App;
