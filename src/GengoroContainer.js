import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';
import {connect} from 'react-redux';

//////Components//////
import GengoroPage from './GengoroPage.js';


//////import Action types and creators//////
import {
  //Action Types
  CHANGE_YEAR_LINE  ,
  RECOG_FORMAT      ,
  IDENTIFY_THE_YEAR ,
  IDENTIFY_THE_GENGO,
  ESTIMATE_BY_ETO   ,
  SUGGEST_GENGOS    ,
  NO_FORMAT         ,

  //Action Creators
  changeYearLine,
  changeYearRange,
  changeShowAll,
  recogFormat,

} from './actionCreators.js';


//////Connect to Redux//////
function mapStateToProps(state) { //このstateは、storeの中にあるstate
  return {
    // propsを通して取得する際に使う名前: Storeのstateの値
    yearLine          : state.yearLine          ,
    format            : state.format            ,
    yearRange         : state.yearRange         ,
    showAll           : state.showAll           ,
    yearCands         : state.yearCands         ,
    identifiedYear    : state.identifiedYear    ,
    gengoCands        : state.gengoCands        ,
    identifiedGengo   : state.identifiedGengo   ,

  };
}

function mapDispatchToProps(dispatch) { //このdispatchは、storeの中にあるdispatch
  return {
    // propsを通して取得する際に使う名前
    changeYearLine(yearLine) {
      console.log("Action creator changeYearLins");
      // Storeのdispatchメソッド（引数はAction Creator）
      dispatch(changeYearLine(yearLine));

      //ここでロジック書いてしまっている。
      //単なるmapなのに、いいのかは甚だ疑問
      dispatch(recogFormat());
    },
    changeYearRange(range){
      //ここでロジック書いてしまっている。
      //単なるmapなのに、いいのかは甚だ疑問
      dispatch(changeYearRange(range));

      dispatch(recogFormat());
    },
    changeShowAll(showAll){
      dispatch(changeShowAll(showAll));
    },

    selectGengo(gengo){
      dispatch(changeYearLine(gengo.gengo.name));

      //ここでロジック書いてしまっている。
      //単なるmapなのに、いいのかは甚だ疑問
      dispatch(recogFormat());
      
    },

    recogFormat(yearLine){
      console.log("Action creator recogFormat");
      dispatch(recogFormat(yearLine));
    }

  };
}

//////Component Definition///////

class GengoroContainer extends Component {

  constructor(){
    super();

    this.yearInput = React.createRef();

  }


  render() {
    return pug`
      GengoroPage(
        yearLine          = this.props.yearLine          
        format            = this.props.format            
        yearRange         = this.props.yearRange         
        showAll           = this.props.showAll           
        yearCands         = this.props.yearCands         
        identifiedYear    = this.props.identifiedYear    
        gengoCands        = this.props.gengoCands        
        identifiedGengo   = this.props.identifiedGengo   

        onYearLineChange  = this.props.changeYearLine
        onYearRangeChange = this.props.changeYearRange
        onShowAllChange   = this.props.changeShowAll
        onGengoSelect     = this.props.selectGengo
      )
    `;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GengoroContainer);


