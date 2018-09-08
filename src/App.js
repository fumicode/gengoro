import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { Provider } from 'react-redux';

import GengoroContainer from './GengoroContainer.js';

import Store from "./Store.js";

class App extends Component {
  constructor(){
    super();
  }
  
  render() {
    return pug`
      Provider(store=Store)
        GengoroContainer 
    `;
  }
}

export default App;
