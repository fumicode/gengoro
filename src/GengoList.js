import React, { Component } from 'react';
import './App.css';

export default class GengoList extends Component {

  constructor(){
    super();
  }


  render() {
    return pug`
      div
        if this.props.identifiedGengo
          - const gengo = this.props.identifiedGengo
          ul
            li= gengo.start.year + "\t" + gengo.gengo.name

        if this.props.gengoCands
          h2 元号候補
          if this.props.gengoCands.first
            h3 一文字目に現れる
            ul
              each gengo,index in this.props.gengoCands.first
                li(key=index)= gengo.start.year + "\t" + gengo.gengo.name
          if this.props.gengoCands.second
            h3 二文字目以降に現れる
            ul
              each gengo,index in this.props.gengoCands.second
                li(key=index)= gengo.start.year + "\t" + gengo.gengo.name

    `;
  }
}
