import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';

//components
import YearRow from './YearRow';


export default class YearTable extends Component {

  constructor(props){
    super(props);
    
    this.state={
      show:"all"
    };

    //ここにスクロールしたい
    this.firstCandRow = React.createRef();

    this.yearListScroller = React.createRef();

  }

  getYearsFromRange(from, to){
    return Array.from((function*(){
      for(let i = Math.max(from ,1); i <= to; i ++){
        yield new GengoYear(i);
      }
    })());
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
    console.log("ele");
    console.log(ele);
    const firstEle = container.firstChild;

    const firstRect = firstEle.getBoundingClientRect();
    const eleRect   = ele     .getBoundingClientRect();


    //containerの最初の要素(多分table)と求める要素の高さの差 
    // = スクロールすべき量

    const containerOffsetY = eleRect.y - firstRect.y;

    container.scrollTop =  containerOffsetY ;
  
  }

  render() {
    
    return pug`
      .year-list-controll
        strong 表示する年:
        label
          input(type="radio" name="showAllOrOne" value="one" 
            checked=${this.state.show == "one"} onChange=${()=>{this.setState({show:"one"})}})
          | 該当する年のみ

        label
          input(type="radio" name="showAllOrOne" value="all" 
            checked=${this.state.show == "all"}  onChange=${()=>{this.setState({show:"all"})}})
          | 周辺の年も
        

      .year-list()
        table.year-list__head-table
          thead.year-list__header
            tr.year-list__header-row
              td.year-list__cell.m--seireki 西暦
              td.year-list__cell.m--gengo 元号
              td.year-list__cell.m--eto 干支


        .year-list__body-container(ref=this.yearListScroller)
          table.year-list__body-table
            if this.props.yearCands
              if this.state.show == "one"
                tbody.year-list__content
                  each yearObj in this.props.yearCands

                    YearRow(addclass="m--highlight"
                      key=yearObj.seireki 
                      year=yearObj)

              else if this.state.show == "all"
                tbody.year-list__content
                  - let firstHasCome = false;
                  each yearObj in this.getYearsFromRange(this.props.range.from, this.props.range.to)
                    - let isCandidate = (this.props.yearCands.indexOf(yearObj) != -1) ;

                    - let highlightClass = isCandidate ? "m--highlight" : ""
                    - let isFirst = false;
                    - if(isCandidate && !firstHasCome){ isFirst = true; firstHasCome = true; } 

                    YearRow(addclass=highlightClass
                      key=yearObj.seireki 
                      ref=isFirst?this.firstCandRow:null
                      year=yearObj)


            else if this.props.theYear
              if this.state.show == "one"
                tbody.year-list__content

                  YearRow(addclass="m--highlight" year=this.props.theYear)
                  

    
              else if this.state.show == "all"
                tbody.year-list__content
                  each yearObj in this.getYearsFromRange(this.props.theYear.seireki - 50, this.props.theYear.seireki + 50)
                    - let isTheYear =  (this.props.theYear == yearObj);
                    - let highlightClass = isTheYear ? "m--highlight" : ""
                    YearRow(addclass=highlightClass key=yearObj.seireki ref=isTheYear?this.firstCandRow:null year=yearObj)

            else 
              tbody.year-list__content
                each yearObj in this.getYearsFromRange(this.props.range.from, this.props.range.to)
                  YearRow(key=yearObj.seireki year=yearObj)

                



    `;
  }
}
