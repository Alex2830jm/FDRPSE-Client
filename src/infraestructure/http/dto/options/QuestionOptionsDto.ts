export interface QuestionOptionsDto {
    options: QuestionOptionsElement[];
}
 interface QuestionOptionsElement {
    id: string;
    questions_id: string;
    opcion: string;
    //Se coloca opcional ya que solo se requiere en un filtro
    countUsers?: number;
    //created_at: string;
    //updated_at: string;
 }