import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto, IRegisterDto } from '../interfaces';

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

    getProfile() {
        return this.http.get(this.url + "/profile");
    }
}