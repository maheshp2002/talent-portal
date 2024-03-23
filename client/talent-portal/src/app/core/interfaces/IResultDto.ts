export interface IPostResult {
    isPassed: boolean
    score: number
    jobId: number
    totalScore: number
    userId: string
    userImage: string
}

export interface IGetResult {
    id: number
    isPassed: boolean
    score: number
    totalScore: number
    jobId: number
    userId: string
}

export interface IGetAllResultUser {
    id: number
    score: number
    isPassed: boolean
    examDate: string
    jobPosition: string
    jobName: string
    jobDescription: string
    userEmail: string
    userName: string
    totalScore: number
}

export interface IGetAllResultAdmin {
    id: number
    score: number
    totalScore: number
    isPassed: boolean
    examDate: string
    resume: string
    jobName: string
    jobDescription: string
    userEmail: string
    userName: string
    userImage: string
}
