export interface IGetJobDto {
    id: number
    title: string
    description: string
    isOpen: boolean
    skills: []
    startedDate: ""
    position: string
}

export interface IPostJobDto {
    title: string
    description: string
    isOpen: boolean
    skills: []
    startedDate: ""
    position: string
}