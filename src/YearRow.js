import React, { Component } from 'react';
import './App.css';

import {GengoYear} from './libs/GengoYear.js';



const YearRow = React.forwardRef((props, ref)=>{

  const className =  "year-list__candidate-row "+ (props.addclass || "");
  return pug`
    tr(...props className=className ref=ref)
      td.year-list__cell.m--seireki= props.year.getSeireki()+"年"
      td.year-list__cell.m--gengo
        if props.year.didGengoChanged()
          div ${props.year.getChangedGengoYearStr()}
        |${props.year.getGengoYearStr() + "年"}
        if props.year.didGengoChanged()
          |${"(" +props.year.getGengo().start.month+ "月" +props.year.getGengo().start.date+ "日より)"}
      td.year-list__cell.m--eto= props.year.getEto()

  `;
}

);

export default YearRow;
