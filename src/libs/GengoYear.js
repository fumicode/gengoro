const {gengos,YEAR2GENGOS, NAME2GENGOS, KANJI2GENGOS}= require("./gengos.js");
const {KAN, SHI} = require("./eto.js");




class GengoYear{

  //fliweightパターン
  static getYearFromPool(year){
    //プールが存在しないなら、yearにする。
    if(!this.yearPool){
      this.yearPool = {}; // 1326 => GengoYear{}
    }

    if(typeof year == "number" && Math.floor(year) == year){
      const cachedYear = this.yearPool[year];
      if( cachedYear ){
        return cachedYear;
      }
    }
    else if(typeof year == "string"){
      const parsedYear = parseInt(year);
      const cachedYear = this.yearPool[parsedYear];
      if( cachedYear ){
        return cachedYear;
      }
    }

    return null;
  }

  static registerYearToPool(yearObj){
    if(!this.yearPool){
      this.yearPool = {}; // 1326 => GengoYear{}
    }

    if(this.yearPool[parseInt(yearObj.getSeireki())]){
      return;
    }
    this.yearPool[parseInt(yearObj.getSeireki())] = yearObj;
  }

  static getYearsFromRange(from, to){
    const constructor = this;
    return Array.from((function*(){
      for(let i = Math.max(from ,1); i <= to; i ++){
        yield new constructor(i);
      }
    })());
  }

  static getCachedYears(){
    return this.yearPool;
  }


  static identifyGengo(seireki){//範囲外の場合元号になり得ないのでnullを返す
    const startYears = Object.keys(YEAR2GENGOS);

    if(seireki < startYears[0]){
      return {
        "gengo": {
          "name": "西暦",
          "yomis": [
            "せいれき"
          ]
        },
        "start": {
          "year": 1,
          "month": 1,
          "date": 1
        }
      };
    }

    if(startYears[startYears.length-1] <= seireki){
      return YEAR2GENGOS[startYears[startYears.length-1]];
    }
    for(var i = 0; i < startYears.length; i ++ ){
      if(startYears[i] <= seireki && seireki < startYears[i+1]){
        return YEAR2GENGOS[startYears[i]];
      }
    }
    throw new Error("おかしいな");
  }

  static calcGengoYear(seireki, gengoObj){
    return seireki - gengoObj.start.year  + 1;
  }

  static recogFormat(year){
    if(typeof year == "number"){//数字だけだったら西暦の可能性が高い
      if(year <= 0){ //マイナスは年ではない
        throw new Error(`input year ${year} must be bigger than 0`);
      }
      //整数じゃなかったら、とかも必要

      //数字だったら、西暦と思われる。
      return {
        type:"seireki",
        seireki:year
      };
    }
    else if(typeof year == "string"){ //文字列 "1335" かも "平成3年" かもしれない。
      const num =  parseInt(year); //整数化しようとして

      if(num <= 0){ //マイナスは年ではない
        throw new Error(`input seireki ${num} must be bigger than 0`);
      }

      if(!isNaN(num)){ //できていれば
        //それは西暦
        return {
          type:"seireki",
          seireki:num
        };
      }

      //整数解釈だめだったら
      //西暦ではないと思われるので元号年として解釈を開始

      //行頭の、元号に使われる漢字から成る1文字以上
      {
        const gengoRegx = new RegExp("^(["+Object.keys(KANJI2GENGOS).join("")+"]+)(\\d+)")
        const gengoMatch = year.match(gengoRegx);
         
        if(gengoMatch){

          //todo エラー処理
          const gengo = gengoMatch[1];

          //整数が続く部分をマッチング
          //(平成5年とかもいける)
          const gengoYear= parseInt(gengoMatch[2]);
          //todo いずれ漢数字もいきたい!!

          //元号一覧からとってくる
          const gengoObj = NAME2GENGOS[gengo];

          if(!gengoObj){ //その元号が存在しなければ、マッチせず
            return {
              type:null
            }
          }

          if(!gengoYear){
            return {
              type:null
            }
          }

          return {
            type:"gengo",
            gengoObj,
            gengoYear:gengoYear,
            gengoStr:gengoMatch[0]
          }
        }
      }

      { //元号年としてだめなら、元号単体や元号の一部として解釈開始
        const gengoOnlyRegx = new RegExp("["+Object.keys(KANJI2GENGOS).join("")+"]+");

        const gengoOnlyMatch = year.match(gengoOnlyRegx);

        if(gengoOnlyMatch){
          const gengoStr = gengoOnlyMatch[0];

          return { //estimateGengoに回してくれ〜
            type:"gengo-only",
            gengoStr
          }
        }
      }

      { //それでもだめなら、干支として
        //元号＋干支パターンもありうるがまだ。
        const etoRegx= new RegExp("["+KAN.join("")+SHI.join("")+"]+");
        const etoMatch = year.match(etoRegx);


        let yearRange = 1700;
        const yearMatch = year.match(/\d+/);
        if(yearMatch){
          yearRange = parseInt(yearMatch[0]);
        }

        if(etoMatch){
          const etoStr = etoMatch[0];

          return {
            type:"eto",
            etoStr,
            yearRange
          }

        }
      }

      console.log("dounatteru");
      

      return {
        type:null
      }
    }
  }

  static * candYearsOfGengo(gengoObj){
    //!!!!
    const constructor = this;

    for(let i = gengoObj.start.year; i <= gengoObj.finish.year; i++){
      yield new constructor(gengoObj.start.year);
    }
  }

  static seireki2shiIndex(seireki){
    //seireki % 4 // 4 だったら甲
    return (12 + seireki - 4 ) % 12;

  }

  static seireki2shi(seireki){
    //seireki % 12 // 4 だったら子
    const shiIndex = this.seireki2shiIndex(seireki);
    return SHI[shiIndex];
  }



  static seireki2kanIndex(seireki){
    //seireki % 4 // 4 だったら甲
    return (10 + seireki - 4 ) % 10; 

  }

  static seireki2kan(seireki){
    //seireki % 4 // 4 だったら甲
    const kanIndex = this.seireki2kanIndex(seireki);

    return KAN[kanIndex];
  }

  //!!!! 2018とか書くな！ Date.now.getYear() とか？
  static * estimateByEto(etoStr, from=0, to=2018){
    //１個目は、type
    //甲子, 丑 => [{kanshi}, 1700, 1712, 1724, ]

    console.log("from");
    console.log(from);

    console.log("to");
    console.log(to);

    const kanRegx = new RegExp("["+KAN.join("")+"]");
    const kanMatch = etoStr.match(kanRegx);
    const kan = kanMatch && kanMatch[0] || "";
    const kanIndex = KAN.indexOf(kan);
    const kanExists = kanIndex != -1;

    //shi regx
    const shiRegx = new RegExp("["+SHI.join("")+"]");
    const shiMatch = etoStr.match(shiRegx);
    const shi = shiMatch && shiMatch[0] || "";
    const shiIndex = SHI.indexOf(shi);
    const shiExists = shiIndex != -1;

    //クソアルゴリズムだけど、楽だからいいやw
    yield {
      kan:kanExists && kan, shi:shiExists && shi
    };

    if(kanExists && shiExists){
      for(let year = from; year <= to; year++){
        if(this.seireki2kanIndex(year) == kanIndex && this.seireki2shiIndex(year) == shiIndex){
          yield year;
        }
      }
    }
    else if(!kanExists && shiExists){
      for(let year = from; year <= to; year++){
        if(this.seireki2shiIndex(year) == shiIndex){
          yield year;
        }
      }
    }
    else if(kanExists && !shiExists){
      for(let year = from; year <= to; year++){
        if( this.seireki2kanIndex(year) == kanIndex ){
          yield year;
        }
      }
    }
    else{
      throw new Error(etoStr + "には干支が含まれていません");
    }
  }

  static estimateGengo(gengoStr){
    //元号っぽいところをとってくる

    const gengoKanjis = Object.keys(KANJI2GENGOS);

    //行頭の元号っぽいところをとってくる
    const gengoRegx = new RegExp("^["+gengoKanjis.join("")+"]+")
    const gengoMatch = gengoStr.match(gengoRegx);


    //todo エラー処理
    if(!gengoMatch){
      return {
        type:null,
        data:null
      }
    }

    const gengo = gengoMatch[0];

    //元号の名前で検索
    //出てきたらオブジェクトを返す
    const gengoObj = NAME2GENGOS[gengo];

    if(gengoObj){ //ふつーに見つかったら
      return {
        type:"full-match", //単体でオブジェクトが見つかったで〜
        data:gengoObj //dataは元号オブジェクト
      };
    }

    //フルネーム検索で見つからなければ
    //漢字だけで検索
    const candidates = KANJI2GENGOS[gengo[0]]//最初の文字で

    if(!candidates){
      //KANJI2GENGOSのObject.keysで検索してるのだから、見つからないはずない。
      //なにかがおかしい
      throw new Error("そんなはずない！");
    }

    return {
      type: "candidates",
      data: candidates
    }
    //出てきたら候補の元号をオブジェクトで返す。


  }


  constructor(year){ //year: なんらかの年をあらわすオブジェクト: 2003 / "2018" / "大化3" / "平成3"
    //flyweightパターン
    const that = this;

    const format = that.constructor.recogFormat(year);

    let calcedSeireki = 2000;

    if(!format.type){
      throw new Error(year + "は年として解釈できません");
    }
    else if(format.type == "seireki"){
      calcedSeireki = parseInt(format.seireki);    
    }
    else if(format.type == "gengo"){
      //いずれキャッシュしたい。
      //今はシンプルにするためにseirekiだけ保存して他はいちいち求めることにしている
      calcedSeireki = format.gengoObj.start.year + format.gengoYear - 1;
    }
    else{
      throw new Error("何かがおかしい！recogFormatに穴がある");
    }

    {//キャッシュを調べて、存在するならそちらを返す。
      const yearObj = that.constructor.getYearFromPool(calcedSeireki);
      if(yearObj){
        return yearObj;
      }
    }

    //キャッシュがないなら、初期化して、キャッシュに登録
    that.seireki = calcedSeireki;
    that.constructor.registerYearToPool(that);

    return that;
  }

  getSeireki(){
    //こいつは必ず存在する
    return parseInt(this.seireki);
  }


  getGengo(){
    if(this.gengo){
      return this.gengo;
    }

    this.gengo = this.constructor.identifyGengo(this.seireki);
    return this.gengo;
  }

  getGengoStr(){
    return this.getGengo().gengo.name;
  }

  getGengoYear(){
    //すでにキャッシュが存在するならば、それを使う
    if(this.gengoYear){
      return this.gengoYear;
    }

    const gengoObj = this.getGengo();

    if(!gengoObj){ //大化よりも前だったら 0 ~ 645 
      this.gengoYear = this.seireki;
      return this.seireki;
    };

    this.gengoYear = this.constructor.calcGengoYear(this.seireki, gengoObj);

    return this.gengoYear;
  }


  getGengoYearStr(){
    return this.getGengoStr() + this.getGengoYear();
  }


  didGengoChanged(){
    return this.getGengoYear() == 1;//一番最初の西暦一年はのぞきたい
  }

  getChangedGengoYearStr(){
    if( !this.didGengoChanged ){
      return "";
    }
    const seireki = this.getSeireki();

    if(seireki<= 1){
      return "";
    }

    const prevYear= new this.constructor(seireki - 1);

    if(prevYear){
      return prevYear.getGengoStr() + (prevYear.getGengoYear() + 1) + "年";
    }
    else{
      return "";
    }

  }

  getShi(){
    if(this.shi){
      return this.shi;
    }

    this.shi = this.constructor.seireki2shi(this.getSeireki());

    return this.shi;
  }

  getKan(){
    if(this.kan){
      return this.kan;
    }

    this.kan = this.constructor.seireki2kan(this.seireki);

    return this.kan;
  }

  getEto(){
    return this.getKan() + this.getShi();
  }

  toJSON(){
    return {
      seireki:this.getSeireki(),
      gengo: this.getGengo(),
      gengoYear:this.getGengoYear(),
      shi:this.getShi(),
      kan:this.getKan()
    };

    /* return {
      seireki
      gengo
      gengoYear
      shi //十二支
      kan //十干
    } */
  }

  getPrevYear(){
    return new this.constructor(this.seireki - 1);
  }
  
  getNextYear(){
    return new this.constructor(this.seireki + 1);
  }

  toString(){
    return "西暦\t元号\t干支\n"+
      `${this.getSeireki()}\t${this.getGengoYearStr()}\t${this.getEto()}`;
  }

}

export {GengoYear};
