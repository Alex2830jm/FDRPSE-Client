export interface QuestionsClosedResponseDto {
    questionsClosed: QuestionsClosedElement[];
}

interface QuestionsClosedElement {
    id: string;
    name: string;
}