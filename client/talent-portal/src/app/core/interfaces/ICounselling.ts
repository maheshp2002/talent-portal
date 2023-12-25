export interface ICounselling {
    name: string
    email: string
    phoneNumber: string
    address: string
    websiteUrl: string
}

export interface IGetCounselling extends ICounselling {
    id: number
}