export class PlaningDto {
  id : number ;
  dayRep: number;
  category: string;
  lstDay:string []= [] ;
  dateOfRep : Date  ;
  beginOrEndMonth :string
  indexStep: number ;
  dateOfMonth : number ; 
  selectedDay : string  = null ; 
  nbrMonth : string  = null ; 
  month : string   ; 
}
