import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetResult, IPostResult } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ResultService {

    adminUrl = "https://localhost:7163/api/admin/ResultAdmin";
    userUrl = "https://localhost:7163/api/user/ResultUser";

    constructor(private http: HttpClient) {

    }

    getResultAdmin() {
        return this.http.get<IGetResult[]>(this.adminUrl + "/result");
    }

    getResult(skill: string) {
        const params = { skill: skill };
        return this.http.get<IGetResult[]>(this.userUrl + "/result", { params });
    }

    addResult(result: IPostResult) {
        return this.http.post(this.userUrl + "/result", result);
    }
}