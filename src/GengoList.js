import React, { Component } from 'react';
import './App.css';

import GengoTable from './GengoTable.js';

export default class GengoList extends Component {
  constructor(props){
    super(props);
  }

  onGengoSelect(gengo){

    if(this.props.onGengoSelect && typeof this.props.onGengoSelect=== "function" ){
     this.props.onGengoSelect(gengo); 
    }
  }

  render() {

    const onGengoSelect = this.onGengoSelect.bind(this);

    return pug`

      div
        //元号がひとつに定まっている
        if this.props.identifiedGengo
          - const gengo = this.props.identifiedGengo

          GengoTable(gengo=gengo opened=true)

        //元号の候補がある
        if this.props.gengoCands
          h2 元号候補
          if this.props.gengoCands.first
            h3 一文字目が"#{this.props.yearLine}"

            each gengo,index in this.props.gengoCands.first
              .gengo-list__item(key=index onClick=(e)=>onGengoSelect(gengo))
                GengoTable(gengo=gengo)

          if this.props.gengoCands.second
            h3 二文字目以降に"#{this.props.yearLine}"
            each gengo,index in this.props.gengoCands.second
              .gengo-list__item(key=index onClick=(e)=>onGengoSelect(gengo))
                GengoTable(gengo=gengo)

    `;
  }
}
