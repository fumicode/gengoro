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
    this.onYearRangeChanged = (e) => {
      e.preventDefault();
      const yearFromStr= this.yearRangeFromInput.current.value;
      const yearToStr  = this.yearRangeToInput  .current.value;

      const yearFrom = parseInt(yearFromStr);
      const yearTo   = parseInt(yearToStr  );

      console.log(yearFrom);
      console.log(yearTo);

      if(this.props.onYearRangeChanged && typeof this.props.onYearRangeChanged == "function"){
        this.props.onYearRangeChanged(yearFrom, yearTo);
      }
    }
  }

  render() {
    return pug`
      p 年を絞り込もう
      form(onSubmit=${this.onYearRangeChanged})
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
