import React, { Component } from 'react';
import './App.css';

export default class RangeInput extends Component {

  constructor(props){
    super();
    //メインの入力欄
    this.yearInput = React.createRef();

    //年の範囲の入力欄
    this.yearRangeFromInput  =  React.createRef();
    this.yearRangeToInput  =  React.createRef();

    //変更されたときのイベント
    this.onYearRangeChange = (e) => {
      e.preventDefault();
      const yearFromStr= this.yearRangeFromInput.current.value;
      const yearToStr  = this.yearRangeToInput  .current.value;

      const from = parseInt(yearFromStr);
      const to   = parseInt(yearToStr  );

      console.log(from);
      console.log(" ~ " + to);

      if(this.props.onYearRangeChange && typeof this.props.onYearRangeChange == "function"){
        this.props.onYearRangeChange({from, to});
      }
    }
  }

  render() {
    return pug`
      form(onSubmit=${this.onYearRangeChange})
        input(type="text" name="yearRangeFrom" ref=${this.yearRangeFromInput} 
          defaultValue=${this.props.defaultRange.from || ""})
        |年 〜 
        input(type="text" name="yearRangeTo" ref=${this.yearRangeToInput}
          defaultValue=${this.props.defaultRange.to || ""})
        |年
        input(type="submit" value="絞り込み")
              
    `;
  }
}
