export interface ILoginDto {
    email: string
    password: string
}

export interface IResetPasswordDto extends ILoginDto {
	token: string;
}

export interface IRegisterDto {
    name: string
    email: string
    password: string
}