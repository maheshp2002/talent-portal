export interface IGetMcqQuestions extends IGetQuestions {
    isCodeProvided: boolean
    code: string
    optionOne: string
    optionTwo: string
    optionThree: string
    optionFour: string
}

export interface IGetQuestions {
    id: number
    question: string
    answer: string
    isDescriptiveQuestion: boolean
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
    isDescriptiveQuestion: boolean
}

export interface ISelectedOption {
    index: number
    option: string
}

export interface IDescriptiveScore {
    questionId: number
    userAnswer: string
}
