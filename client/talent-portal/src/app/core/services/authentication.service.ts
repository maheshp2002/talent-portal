import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto, IRegisterDto, IResetPasswordDto, IResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    url = "https://localhost:7163/api/account/authentication";

    constructor(private http: HttpClient) {

    }

    login(model: ILoginDto) {
        return this.http.post(this.url + "/login", model);
    }

    register(model: IRegisterDto) {
        return this.http.post(this.url + "/register", model);
    }

    getAdminProfile(adminId: string) {
        return this.http.get(this.url + "/admin-profile/" + adminId);
    }

    getUserProfile(userId: string) {
        return this.http.get(this.url + "/user-profile/" + userId);
    }

    uploadResume(file: FormData) {
        return this.http.post<IResponse>(this.url + "/upload-resume", file);
    }

    forgotPassword(email: string) {        
        return this.http.post<IResponse>(this.url + "/forgot-password", { email });
    }

    resetPassword(dto: IResetPasswordDto) {        
        return this.http.put<IResponse>(this.url + "/change-password", dto);
    }
}