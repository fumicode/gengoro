import React, { Component } from 'react';
import './App.css';

export default class YearInput extends Component {

  constructor(props){
    super(props);
    //メインの入力欄
    this.yearInput = React.createRef();

    this.onYearLineChanged = (e)=>{
      e.preventDefault();
      const yearLine = this.yearInput.current.value;

      if(this.props.onYearLineChanged && typeof this.props.onYearLineChanged == "function"){
        this.props.onYearLineChanged(yearLine);
      }

    }
  }

  focus(){
    if(this.yearInput.current){
      this.yearInput.current.focus();
    }
  }


  render() {
    return pug`
      .year-inputs
        form(onSubmit=${this.onYearLineChanged} )
          input(type="text" name="yearLine" onChange=${this.onYearLineChanged} ref=${this.yearInput} value=this.props.yearLine)
          |年
    `;
  }
}
