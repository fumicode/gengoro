//Redux
import { createStore, applyMiddleware ,compose} from 'redux';
import thunk from 'redux-thunk';
import formReducer from './formReducer.js';

// 初期state変数（initialState）の作成
const initialState = {
  yearLine: "",

  format: "NO_FORMAT",
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
const Store = createStore(
  formReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

export default Store;
