import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {GengoYear} from './libs/GengoYear.js';


//Components
import YearInput from './YearInput.js';
import FormatIdentifier from './FormatIdentifier.js';
import RangeInput from './RangeInput.js';
import YearTable from './YearTable.js';
import GengoList from './GengoList.js';

class App extends Component {
  constructor(){
    super();

    this.state = {
      yearLine: "",

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



    //

    this.onYearLineChanged = (yearLine) => {
      //YearInputコンポートから、入力内容が送られてくる。シンプル。
      this.setState({yearLine});

      this.recogFormatAndSetState(yearLine);
    }
    
    this.onYearRangeChanged = (yearFrom, yearTo) => {
      if(yearFrom && yearTo){
        this.setState({
          yearRange:{
            from: yearFrom ,
            to:   yearTo,
          }
        });

        setTimeout(()=>{
          this.recogFormatAndSetState(this.state.yearLine);
          //範囲を計算し直す必要があるのでもう一度呼ぶ
          //そのとき、yearRangeの内容を作る必要があるので、
          //setTimeoutでセットされるのを待つ。
        },1);

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
          YearInput(onYearLineChanged=${this.onYearLineChanged} )
          //入力フォーマットを表示する
          if this.state.format
            FormatIdentifier(format=${this.getFormatStr()} result=${this.getFormatStr("result")})

          //表示する範囲を指定する
          if !this.state.identifiedYear && this.state.yearCands
            RangeInput(defaultRange=${this.state.yearRange}
              onYearRangeChanged=${this.onYearRangeChanged} )

          .outputs
            //identifiedYearが存在するか、候補が存在するならば
            if this.state.identifiedYear || this.state.yearCands
              YearTable( theYear= ${this.state.identifiedYear} yearCands=${this.state.yearCands} range=${{from:this.state.yearRange.from, to:this.state.yearRange.to}})


            //元号が一つか複数ある場合は元号リスト
            if this.state.identifiedGengo || this.state.gengoCands
              GengoList(identifiedGengo=this.state.identifiedGengo , gengoCands=this.state.gengoCands)


          .page__footer
            //多分中身ないと思うけど
            //スマホだとこっちに入力欄あった方がいい？
    `;
  }
}

export default App;
