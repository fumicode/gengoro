import {
  //Action Types
  CHANGE_YEAR_LINE ,
  CHANGE_YEAR_RANGE ,
  CHANGE_SHOW_ALL    ,
  RECOG_FORMAT ,
  IDENTIFY_THE_YEAR ,
  IDENTIFY_THE_GENGO ,
  ESTIMATE_BY_ETO ,
  SUGGEST_GENGOS , 
  NO_FORMAT ,  

  //Action Creators
  changeYearLine,
  recogFormat,
  changeShowAll
} from './actionCreators.js';

export default function formReducer(state, action){
  switch(action.type){
  case CHANGE_YEAR_LINE:
    return Object.assign({}, state, {
      yearLine:action.yearLine
    });

    break;

  case CHANGE_YEAR_RANGE:
    return Object.assign({}, state, {
      yearRange:action.range
    });

    break;

  case IDENTIFY_THE_YEAR:
    return Object.assign({}, state, {
      format: action.type,
      identifiedYear: action.identifiedYear
    });
    
    break;

  case IDENTIFY_THE_GENGO:
    return Object.assign({}, state, {
      format: action.type,
      identifiedGengo: action.identifiedGengo
    });
    
    break;


  case ESTIMATE_BY_ETO:
    return Object.assign({}, state, {
      format: action.type,
      identifiedYear: action.identifiedYear,
      yearCands: action.yearCands,
    });

    break;

  case SUGGEST_GENGOS:
    return Object.assign({}, state, {
      format: action.type,
      gengoCands: action.gengoCands,
    });

    break;

  case CHANGE_YEAR_RANGE:
    return Object.assign({}, state, {
      range: action.range
    });
    
    break;

  case CHANGE_SHOW_ALL:
    return Object.assign({}, state, {
      showAll: action.showAll
    });
    
    break;

  case NO_FORMAT:
    return Object.assign({}, state, {
      format: action.type,
    });
    
    break;

  default:
    return state;
    break;
  }

  return state;
}

