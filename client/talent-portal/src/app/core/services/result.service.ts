import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetResult, IGetAllResultUser, IPostResult, IResponse, IGetAllResultAdmin } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ResultService {

    adminUrl = "https://localhost:7163/api/admin/ResultAdmin";
    userUrl = "https://localhost:7163/api/user/ResultUser";

    constructor(private http: HttpClient) {

    }

    getResultAdmin(jobId: number) {
        return this.http.get<IGetAllResultAdmin[]>(this.adminUrl + "/result/" + jobId);
    }

    getAllResultUser(userId: string) {
        return this.http.get<IGetAllResultUser[]>(this.userUrl + "/result/" + userId);
    }

    getCurrentResult(jobId: number, userId: string) {
        const params = { jobId: jobId, userId: userId };
        return this.http.get<IGetResult>(this.userUrl + "/result", { params });
    }

    addResult(result: IPostResult) {
        return this.http.post(this.userUrl + "/result", result);
    }
}