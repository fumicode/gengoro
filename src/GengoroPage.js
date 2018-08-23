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
          h1 元号郎 - Gengoro

        .page__body
          //元号が一つか複数ある場合は元号リスト
          if this.props.gengoCands
            GengoSuggestion(gengoCands=this.props.gengoCands onGengoSelect=this.onGengoSelect)

          YearInput(onYearLineChange=${this.props.onYearLineChange}  yearLine=this.props.yearLine)
          //入力フォーマットを表示する

          // デバッグ用
          if this.props.format
            FormatIdentifier(format=${this.getFormatStr()} result=${this.getFormatStr("result")})

          //表示する範囲を指定する
          if !this.props.identifiedYear && this.props.yearCands
            RangeInput(defaultRange=${this.props.yearRange}
              onYearRangeChange=${this.props.onYearRangeChange} )

          .outputs
            //identifiedYearが存在するか、候補が存在するならば
            if this.props.identifiedYear || this.props.yearCands
              YearSearchResult(theYear= ${this.props.identifiedYear} yearCands=${this.props.yearCands} range=${{from:this.props.yearRange.from, to:this.props.yearRange.to}} show=this.props.showAll?"all":"one" onShowAllChange=this.props.onShowAllChange)

            //元号が一つか複数ある場合は元号リスト
            if this.props.identifiedGengo || this.props.gengoCands
              GengoList(identifiedGengo=this.props.identifiedGengo  gengoCands=this.props.gengoCands, yearLine=this.props.yearLine onGengoSelect=this.props.onGengoSelect)

          .page__footer
            //多分中身ないと思うけど
            //スマホだとこっちに入力欄あった方がいい？
    `;
  }
}







