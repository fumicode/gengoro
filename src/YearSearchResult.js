import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';
import YearTable from './YearTable.js';
import {YearTableHeader} from './YearTable.js';

export default class YearSearchResult extends Component {

  constructor(props){
    super(props);
    
    //ここにスクロールしたい
    this.firstCandRow = React.createRef();
    this.yearListScroller = React.createRef();
    this.onShowAllChange = this.onShowAllChange.bind(this);
  }


  componentDidMount(){
    if(this.firstCandRow.current && this.yearListScroller.current){

      this.scrollToElement(this.firstCandRow.current, this.yearListScroller.current);
    }
 
  }


  componentDidUpdate(){
    if(this.firstCandRow.current && this.yearListScroller.current){

      this.scrollToElement(this.firstCandRow.current, this.yearListScroller.current);
    }


  }

  scrollToElement(ele, container){
    const firstEle = container.firstChild;

    const firstRect = firstEle.getBoundingClientRect();
    const eleRect   = ele     .getBoundingClientRect();


    //containerの最初の要素(多分table)と求める要素の高さの差 
    // = スクロールすべき量

    const containerOffsetY = eleRect.y - firstRect.y;

    container.scrollTop =  containerOffsetY ;
  
  }

  onShowAllChange(show){
    
    if(this.props.onShowAllChange && typeof this.props.onShowAllChange == "function"){

      this.props.onShowAllChange(show==="all" );
    }
  }

  render() {
    return pug`
      .year-list-controll
        strong 表示する年:
        label
          input(type="radio" name="showAllOrOne" value="one" 
            checked=this.props.show == "one" onChange=${()=>{this.onShowAllChange("one")}})
          | 該当する年のみ

        label
          input(type="radio" name="showAllOrOne" value="all" 
            checked=this.props.show == "all"  onChange=${()=>{this.onShowAllChange("all")}})
          | 周辺の年も
        

      .year-list
        YearTableHeader
        .year-list__body-container(ref=this.yearListScroller)
          YearTable(firstCandRow=this.firstCandRow yearCands = this.props.yearCands, theYear =this.props.theYear  show=this.props.show range=this.props.range)

    `;
  }
}
