import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';

//components
import YearRow from './YearRow';


export const YearTableHeader = (props)=>{
  return pug `
    table.year-list__head-table
      thead.year-list__header
        tr.year-list__header-row
          td.year-list__cell.m--seireki 西暦
          td.year-list__cell.m--gengo 元号
          td.year-list__cell.m--eto 干支
  `;

};


export default class YearTable extends Component {

  render() {
    return pug`
      table.year-list__body-table
        if this.props.yearCands
          if this.props.show == "one"
            tbody.year-list__content
              each yearObj in this.props.yearCands

                YearRow(addclass="m--highlight"
                  key=yearObj.seireki 
                  year=yearObj)

          else if this.props.show == "all"
            tbody.year-list__content
              - let firstHasCome = false;
              each yearObj in GengoYear.getYearsFromRange(this.props.range.from, this.props.range.to)
                - let isCandidate = (this.props.yearCands.indexOf(yearObj) != -1) ;

                - let highlightClass = isCandidate ? "m--highlight" : ""
                - let isFirst = false;
                - if(isCandidate && !firstHasCome){ isFirst = true; firstHasCome = true; } 

                YearRow(addclass=highlightClass
                  key=yearObj.seireki 
                  ref=isFirst?this.props.firstCandRow:null
                  year=yearObj)


        else if this.props.theYear
          if this.props.show == "one"
            tbody.year-list__content

              YearRow(addclass="m--highlight" year=this.props.theYear)
              


          else if this.props.show == "all"
            tbody.year-list__content
              each yearObj in GengoYear.getYearsFromRange(this.props.theYear.seireki - 50, this.props.theYear.seireki + 50)
                - let isTheYear =  (this.props.theYear == yearObj);
                - let highlightClass = isTheYear ? "m--highlight" : ""
                YearRow(addclass=highlightClass key=yearObj.seireki ref=isTheYear?this.props.firstCandRow:null year=yearObj)

        else 
          tbody.year-list__content
            each yearObj in GengoYear.getYearsFromRange(this.props.range.from, this.props.range.to)
              YearRow(key=yearObj.seireki year=yearObj)

    `;
  }
}
