import {
  //Action Types
  CHANGE_YEAR_LINE ,


  //Action Creators
  changeYearLine,

} from './actionCreators.js';

export default function formReducer(state, action){
  switch(action.type){
  case CHANGE_YEAR_LINE:
    console.log("Reducer: CHANGE_YEAR_LINE:");
    console.log("state");
    console.log(state);

    console.log("action");
    console.log(action);

    return Object.assign({}, state, {
      yearLine:action.yearLine
    });

    break;

  case IDENTIFY_THE_YEAR:
    return Object.assign({}, state, {
      format: action.type,
      identifiedYear: action.identifiedYear;
    });
    
    break;

  default:
    return state;
    break;
  }

  return state;
}

