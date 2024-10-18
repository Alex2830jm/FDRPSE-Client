/* export interface QuestionOptionDto {
    option: OptionsElement[];
}
 interface OptionsElement {
    id: string;
    opcion: string;
 } */

    export interface QuestionOptionResponseDto {
        id              : string;
        questions_id    : string;
        opcion          : string;
    }