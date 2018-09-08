import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';


//////Components//////
import YearInput        from './YearInput.js';
import FormatIdentifier from './FormatIdentifier.js';
import RangeInput       from './RangeInput.js';
import YearSearchResult from './YearSearchResult.js';
import GengoList        from './GengoList.js';
import GengoSuggestion  from './GengoSuggestion.js';

//////Component Definition///////
export default class GengoroPage extends Component {

  constructor(props){
    super(props);
    
  }


  render() {
    return pug`
      .page
        .page__header
          p 元号郎 - Gengoro

        .page__body
          //元号が一つか複数ある場合は元号リスト
          if this.props.format == "NO_FORMAT"
            p 以下のような入力を受け付けます。
              br
              | 1991 / 平成3 / 元禄1 / 未 / 戊辰

          if this.props.format === "SUGGEST_GENGO"
            GengoSuggestion(gengoCands=this.props.gengoCands onGengoSelect=this.props.onGengoSelect)

          YearInput(onYearLineChange=${this.props.onYearLineChange}  yearLine=this.props.yearLine)
          //入力フォーマットを表示する

          //表示する範囲を指定する
          if ["ESTIMATE_BY_ETO"].includes(this.props.format)
            RangeInput(defaultRange=${this.props.yearRange}
              onYearRangeChange=${this.props.onYearRangeChange} )

          .outputs
            //identifiedYearが存在するか、候補が存在するならば

            if this.props.format === "ESTIMATE_BY_ETO"
              YearSearchResult(
                theYear= ${this.props.identifiedYear} 
                yearCands=${this.props.yearCands} 
                range=${{from:this.props.yearRange.from, to:this.props.yearRange.to}} 
                show=this.props.showAll ? "all":"one" 
                onShowAllChange=this.props.onShowAllChange)

            else if this.props.format == "IDENTIFY_THE_YEAR" 

              YearSearchResult(
                theYear= ${this.props.identifiedYear} 
                yearCands=${this.props.yearCands} 
                range=${{from:this.props.yearRange.from, to:this.props.yearRange.to}} 
                show=this.props.showAll?"all":"one" 
                onShowAllChange=this.props.onShowAllChange)

            //元号が一つか複数ある場合は元号リスト
            else if this.props.format == "IDENTIFY_THE_GENGO" 
              GengoList(
                identifiedGengo=this.props.identifiedGengo
                yearLine=this.props.yearLine 
                onGengoSelect=this.props.onGengoSelect)

            else if this.props.format == "SUGGEST_GENGOS" 
              GengoList(
                gengoCands=this.props.gengoCands
                yearLine=this.props.yearLine 
                onGengoSelect=this.props.onGengoSelect)

          .page__footer
            //多分中身ないと思うけど
            //スマホだとこっちに入力欄あった方がいい？
    `;
  }
}







