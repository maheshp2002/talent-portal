export interface IProfileDto {
    id: string
    email: string
    name: string
    isAdmin: boolean
}

export interface IUserProfileDto extends IProfileDto {
    resume: string
    resumeUrl: string
}