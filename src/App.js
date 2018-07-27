import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {GengoYear} from './libs/GengoYear.js';

class App extends Component {

  constructor(){
    super();

    this.state = {
      format: null,
      identifiedYear: null,
      yearCands: null,

      identifiedGengo:null,
      gengoCands:null,

      yearRange:{
        from:1600,
        to:1800
      }
    };

    //メインの入力欄
    this.yearInput =  React.createRef();

    //年の範囲の入力欄
    this.yearRangeFromInput  =  React.createRef();
    this.yearRangeToInput  =  React.createRef();


    
    this.onYearLineChanged = (e) => {
      e.preventDefault();
      const yearLine = this.yearInput.current.value;
      this.recogFormatAndSetState(yearLine);
    }

    this.onYearRangeChanged = (e) => {
      e.preventDefault();
      const yearFromStr= this.yearRangeFromInput.current.value;
      const yearToStr  = this.yearRangeToInput  .current.value;

      const yearFrom = parseInt(yearFromStr);
      const yearTo   = parseInt(yearToStr  );

      console.log(yearFrom);
      console.log(yearTo);

      if(yearFrom && yearTo){
        this.setState({
          yearRange:{
            from: yearFrom ,
            to:   yearTo,
          }
        });

        setTimeout(()=>{
          //setStateの直後では変更されないので。
          this.onYearLineChanged(e);
        },1);
        //範囲を計算し直す必要があるのでもう一度呼ぶ
      }


    }
  }

  recogFormatAndSetState(line){
    const format = GengoYear.recogFormat(line);
    console.log("format:\n" + JSON.stringify(format));

    switch(format.type){
    case "seireki":
    case "gengo":

      console.log("format:西暦 or 元号年。一つが特定できた　");

      const newYear = new GengoYear(line);

      console.log(line + "\n"+ newYear );

      this.setState({ 
        format,
        identifiedYear: newYear ,
        yearCands: null,
        identifiedGengo:null,
        gengoCands:null,
      });
      
      break;

      //gengoOrSeireki(format.gengoStr);

      break;
      
    case "gengo-only":
      console.log("format:元号単体/元号の一部");
      //estimateGengo(format.gengoStr);
      
      const estimation = GengoYear.estimateGengo(line);

      if(estimation.type == "full-match"){
        console.log(estimation.data); //単一の元号を表示
          
        this.setState({ 
          format,
          identifiedYear: null,
          yearCands: null, //これは作ってあげてもいいのかもね
          identifiedGengo: estimation.data,
          gengoCands:null,
        });
      }
      else if(estimation.type == "candidates"){
        const first  = estimation.data.first;
        const second = estimation.data.second;

        this.setState({ 
          format,
          identifiedYear: null,
          yearCands: null, //これは作ってあげてもいいのかもね
          identifiedGengo:null,
          gengoCands:{
            first,
            second
          },
        });
      }
      else{
        console.log("元号候補はありません");
        //こいつをどうやって表示しよう

        this.setState({ 
          format,
          identifiedYear: null,
          yearCands: null,
          identifiedGengo:null,
          gengoCands:null,
        });
      }


      break;
      
    case "eto":
      console.log("format:干支");
      //estimateByEto(format.etoStr, format.yearRange);


      const yearCandidate = Array.from(GengoYear.estimateByEto(line,this.state.yearRange.from, this.state.yearRange.to))
      //console.log(yearCandidate.next().value);

      const type = yearCandidate.shift();

      if(type.shi && type.kan){
        console.log("干支両方("+ type.kan + type.shi +")あり");
      }
      else if(type.shi ){
        console.log("十二支("+ type.shi +")のみ");
      }
      else if(type.kan ){
        console.log("十干("+type.kan+")のみ");
      }
      else{
        console.log("干支なし");
        return ;
      }

      console.log("この干支から推測される年");

      console.log(yearCandidate);

      const yearObjCands =  yearCandidate.map((year)=>new GengoYear(year));


      console.log(yearObjCands);

      this.setState({ 
        format,
        identifiedYear: yearObjCands.length == 1 ? yearObjCands[0]:null,
        yearCands: yearObjCands,
        identifiedGengo:null,
        gengoCands:null,
      });

      break;

    default:

      this.setState({ 
        format,
        identifiedYear: null,
        yearCands: null,
        identifiedGengo:null,
        gengoCands:null,
      });

      break;
    }
  }


  getFormatStr(mode){
    if(!this.state.format){
      return "";
    }


    const dictionary = {
      gengo: {
        text:"元号年",
        result:"年が特定できました",
      },
      seireki: {
        text:"西暦年",
        result:"年が特定できました",
      },
      "gengo-only": {
        text:"元号(候補)のみ",
        result:"いくつかの元号に絞れました",
      },
      eto: {
        text:"干支",
        result:"いくつかの年に絞れました",
      },

    }

    let key = "text";
    if(mode == "result"){
      key = "result";
    }
    const textObj = dictionary[this.state.format.type];

    if(!textObj){
      return ({
        text:"未対応フォーマット",
        result:"西暦年、元号、元号年、干支を入力してください。",
      })[key];
    }

    return textObj[key];
  }

  
  render() {
    return pug`
      .page
        .page__header
          h1 元号郎 - Gengoro

        .page__body
          .year-inputs
            form(onSubmit=${this.onYearLineChanged} )
              input(type="text" name="yearLine" ref=${this.yearInput})
              |年

          if this.state.format
            .format-identifier
              p 入力： ${this.getFormatStr()}
                br
                |結果： ${this.getFormatStr("result")}

          if !this.state.identifiedYear && this.state.yearCands
            p 年を絞り込もう
            form(onSubmit=${this.onYearRangeChanged})
              input(type="text" name="yearRangeFrom" ref=${this.yearRangeFromInput} 
                defaultValue=${this.state.yearRange.from})
              |年 〜 
              input(type="text" name="yearRangeTo" ref=${this.yearRangeToInput}
                defaultValue=${this.state.yearRange.to})
              |年

              input(type="submit" value="絞り込み")
              

          .outputs
            //identifiedYearが存在するか、候補が存在するならば
            if this.state.identifiedYear || this.state.yearCands
              table.year-list
                thead
                  tr.year-list__header
                    td 西暦
                    td 元号
                    td 干支

                if this.state.yearCands
                  tbody.year-list__content
                    each yearObj in this.state.yearCands
                      tr(key=yearObj.seireki).year-list__candidate-row
                        td= yearObj.getSeireki()+"年"
                        td= yearObj.getGengoYearStr() + "年"
                        td= yearObj.getEto()
                if this.state.identifiedYear
                  tbody.year-list__content
                    tr.year-list__candidate-row
                      td= this.state.identifiedYear.getSeireki()+"年"
                      td= this.state.identifiedYear.getGengoYearStr() + "年"
                      td= this.state.identifiedYear.getEto()


            if this.state.identifiedGengo
              - const gengo = this.state.identifiedGengo
              ul
                li= gengo.start.year + "\t" + gengo.gengo.name

            if this.state.gengoCands
              h2 元号候補
              if this.state.gengoCands.first
                h3 一文字目に現れる
                ul
                  each gengo,index in this.state.gengoCands.first
                    li(key=gengo.gengo.name)= gengo.start.year + "\t" + gengo.gengo.name
              if this.state.gengoCands.second
                h3 二文字目以降に現れる
                ul
                  each gengo,index in this.state.gengoCands.second
                    li(key=gengo.gengo.name)= gengo.start.year + "\t" + gengo.gengo.name

          .page__footer
          //多分中身ないと思うけど
    `;
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
        ok
      </p>
    </div>
    */
  }
}

export default App;
