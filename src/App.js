import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//Redux
import { createStore, applyMiddleware ,compose} from 'redux';
import { Provider, connect } from 'react-redux';

import thunk from 'redux-thunk';

import formReducer from './formReducer.js';

import GengoroContainer from './GengoroContainer.js';

// 初期state変数（initialState）の作成
const initialState = {
  yearLine: "",

  format: null,
  identifiedYear: null,
  yearCands: null,

  identifiedGengo:null,
  gengoCands:null,

  yearRange:{
    from:1600,
    to:1800
  },

  showAll:true
};


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// createStore（）メソッドを使ってStoreの作成
const store = createStore(
  formReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);



class App extends Component {
  constructor(){
    super();
  }

  
  render() {
    return pug`
      Provider(store=store)
        GengoroContainer 
    `;
  }
}

export default App;
