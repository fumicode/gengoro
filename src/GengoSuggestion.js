import React, { Component } from 'react';
import './App.css';

export default class GengoSuggestion extends Component {

  constructor(props){
    super(props);



  }

  onGengoSelect(gengo){

    if(this.props.onGengoSelect && typeof this.props.onGengoSelect=== "function" ){
      this.props.onGengoSelect(gengo); 
    }
  }

  render() {
    //this.なしでかけるようにここでバインドしちゃう
    const onGengoSelect = this.onGengoSelect.bind(this);

    return pug`
      .gengo-suggestion
        ul.gengo-suggestion__list
          each gengo,index in this.props.gengoCands.first
            li.gengo-suggestion__item(key=index)
              a.gengo-suggestion__link(onClick=(e)=>onGengoSelect(gengo))
                .gengo-suggestion__gengo= gengo.gengo.name
                  .gengo-suggestion__start-year=gengo.start.year

          li.gengo-suggestion__item.m--sep
          each gengo,index in this.props.gengoCands.second
            li.gengo-suggestion__item(key=index)
              a.gengo-suggestion__link(onClick=(e)=>onGengoSelect(gengo))
                .gengo-suggestion__gengo= gengo.gengo.name
                  .gengo-suggestion__start-year=gengo.start.year
    `;
  }
}
