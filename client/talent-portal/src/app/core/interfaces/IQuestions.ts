export interface IGetQuestions {
    id: number
    question: string
    isCodeProvided: string
    code: string
    optionOne: string
    optionTwo: string
    optionThree: string
    optionFour: string
    answer: string
}

export interface IPostQuestions {
    question: string
    isCodeProvided: string
    code: string
    optionOne: string
    optionTwo: string
    optionThree: string
    optionFour: string
    answer: string
}
