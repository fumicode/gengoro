import React, { Component } from 'react';
import './App.css';

export default class YearInput extends Component {

  constructor(props){
    super();
    //メインの入力欄
    this.yearInput = React.createRef();

    this.onYearLineChanged = (e)=>{
      e.preventDefault();
      const yearLine = this.yearInput.current.value;

      console.log("props");
      console.log(props);
      console.log("this.props");
      console.log(this.props);

      if(this.props.onYearLineChanged && typeof this.props.onYearLineChanged == "function"){
        console.log("year line changed event");
        this.props.onYearLineChanged(yearLine);
      }

    }

  }

  render() {
    return pug`
      .year-inputs
        form(onSubmit=${this.onYearLineChanged} )
          input(type="text" name="yearLine" ref=${this.yearInput})
          |年
    `;
  }
}
