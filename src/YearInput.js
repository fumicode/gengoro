import React, { Component } from 'react';
import './App.css';

export default class YearInput extends Component {

  constructor(props){
    super(props);
    //メインの入力欄
    this.yearInput = React.createRef();
    this.onYearLineChange = this.onYearLineChange.bind(this);
  }

  onYearLineChange(e){
    e.preventDefault();
    const yearLine = this.yearInput.current.value;

    if(this.props.onYearLineChange && typeof this.props.onYearLineChange == "function"){
      this.props.onYearLineChange(yearLine);
    }
  }

  focus(){
    if(this.yearInput.current){
      this.yearInput.current.focus();
    }
  }

  render(){
    return pug`
      .year-inputs
        form(onSubmit=${this.onYearLineChange} )
          input(type="text" name="yearLine" onChange=${this.onYearLineChange} ref=${this.yearInput} value=this.props.yearLine)
          |年
    `;
  }
}
