import React, { Component } from 'react';
import './App.css';
import YearTable from './YearTable.js';
import {YearTableHeader} from './YearTable.js';

export default class GengoTable extends Component {
  render() {
    return pug`
      .gengo-table
        .gengo-table__header
          .gengo-table__header-content
            .gengo-table__start-year= this.props.gengo.start.year
            .gengo-table__name= this.props.gengo.gengo.name

        if this.props.opened
          .gengo-table__body()
            //.m--hidden
            .gengo-table__content
              p 改元日: #{this.props.gengo.start.year}年#{this.props.gengo.start.month}月#{this.props.gengo.start.date}日

              YearTableHeader
              YearTable(range=${{from:this.props.gengo.start.year, to:this.props.gengo.finish.year}})
    `;
  }
}
