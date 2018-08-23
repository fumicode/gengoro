import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';
import {connect} from 'react-redux';

//////Components//////
import GengoroPage from './GengoroPage.js';


//////import Action types and creators//////
import {
  //Action Types
  CHANGE_YEAR_LINE ,

  //Action Creators
  changeYearLine,

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
      // Storeのdispatchメソッド（引数はAction Creator）
      dispatch(changeYearLine(yearLine));
    },
    changeYearRange(range){
      //!!!!
      //dispatch(changeYearLine());
    },
    changeShowAll(showAll){
      //dispatch(changeYearLine(yearLine));
    },
    selectGengo(){
      //dispatch(changeYearLine(yearLine));
    },

    recogFormat(yearLine){
      dispatch(recogFormat(yearLine));
    }

  };
}

//////Component Definition///////

class GengoroContainer extends Component {

  constructor(){
    super();

    this.yearInput = React.createRef();

    this.onShowAllChange = this.onShowAllChange.bind(this);
    this.onGengoSelect = this.onGengoSelect.bind(this);
    this.onYearLineChanged = this.onYearLineChanged.bind(this);
    this.onYearRangeChanged = this.onYearRangeChanged.bind(this);
  }

  onYearLineChanged(yearLine){
    //YearInputコンポートから、入力内容が送られてくる。シンプル。
    this.setState({yearLine});

    this.props.recogFormat(yearLine);
  }

  onYearRangeChanged(yearFrom, yearTo){
    if(yearFrom && yearTo){

      const yearRange = {
        from: yearFrom ,
        to:   yearTo,
      };

      this.props.changeYearRange(yearRange);

      setTimeout(()=>{
        this.props.recogFormat(this.props.yearLine);
        //範囲を計算し直す必要があるのでもう一度呼ぶ
        //そのとき、yearRangeの内容を作る必要があるので、
        //setTimeoutでセットされるのを待つ。
      },1);

    }
  }






  getFormatStr(mode){
    if(!this.state.format){
      return "";
    }

    const dictionary = {
      gengo: {
        text:"元号年",
        result:"年が特定できました",
      },
      seireki: {
        text:"西暦年",
        result:"年が特定できました",
      },
      "gengo-only": {
        text:"元号(候補)のみ",
        result:"いくつかの元号に絞れました",
      },
      eto: {
        text:"干支",
        result:"いくつかの年に絞れました",
      },
    }

    let key = "text";
    if(mode == "result"){
      key = "result";
    }
    const textObj = dictionary[this.state.format.type];

    if(!textObj){
      return ({
        text:"未対応フォーマット",
        result:"西暦年、元号、元号年、干支を入力してください。",
      })[key];
    }

    return textObj[key];
  }

  onGengoSelect(gengo){
    this.setState({
      yearLine:gengo.gengo.name
    });

    this.props.recogFormat();

    //setStateだけではYearInputのinput valueのonChangeが発火しないようなので

    
    /*
    あとまわし。
    setTimeout(()=>{
      this.recogFormatAndSetState(this.state.yearLine);

      if(this.yearInput.current){
        this.yearInput.current.focus();
      }

    },1);
    */
  }

  onShowAllChange(showAll){
    this.setState({
      showAll
    });
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





