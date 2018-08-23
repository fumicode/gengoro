
/* Actionの実装 */

// Action名の定義
export const CHANGE_YEAR_LINE   = 'CHANGE_YEAR_LINE';
export const RECOG_FORMAT       = 'RECOG_FORMAT';
export const IDENTIFY_THE_YEAR  = 'IDENTIFY_THE_YEAR';
export const IDENTIFY_THE_GENGO = 'IDENTIFY_THE_GENGO';
export const ESTIMATE_BY_ETO    = 'ESTIMATE_BY_ETO';
export const SUGGEST_GENGOS     = 'SUGGEST_GENGOS';
export const NO_FORMAT          = 'NO_FORMAT';


// Action Creator
export function changeYearLine(yearLine) {
  // Action
  console.log("ActionCreator: changeYearLine :"+yearLine);
  return {
    type: CHANGE_YEAR_LINE,
    yearLine,
  };
}


export function recogFormat(yearLine) {
    const format = GengoYear.recogFormat(line);
    console.log("format:\n" + JSON.stringify(format));

    switch(format.type){
    case "seireki":
    case "gengo":

      console.log("format:西暦 or 元号年。一つが特定できた　");
      const newYear = new GengoYear(line);
      console.log(line + "\n"+ newYear );

      //action
      return {
        type: IDENTIFY_THE_YEAR,
        identifiedYear: newYear ,
      }

      break;

    case "gengo-only":
      console.log("format:元号単体/元号の一部");
      //estimateGengo(format.gengoStr);

      const estimation = GengoYear.estimateGengo(line);

      if(estimation.type == "full-match"){
        console.log(estimation.data); //単一の元号を表示
        const gengo = estimation.data;

        //const yearCands = Array.from(GengoYear.candYearsOfGengo(gengo));

        return {
          type:IDENTIFY_THE_GENGO ,
          identifiedGengo: gengo,
        };

      }
      else if(estimation.type == "candidates"){
        const first  = estimation.data.first;
        const second = estimation.data.second;


        return {
          type:SUGGEST_GENGOS ,
          gengoCands:{
            first,
            second
          },
        };
      }
      else{
        console.log("元号候補はありません");
        //こいつをどうやって表示しよう
        return {
          type:NO_FORMAT,
        };
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

      return {
        type:ESTIMATE_BY_ETO,
        identifiedYear: yearObjCands.length == 1 ? yearObjCands[0]:null,
        yearCands: yearObjCands,
      };

      break;

    default:
      return {
        type: NO_FORMAT
      }

      break;
    }
  }
