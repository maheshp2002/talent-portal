import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetJobDto, IPostJobDto } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    adminUrl = "https://localhost:7163/api/admin";
    userUrl = "https://localhost:7163/api/user/jobsUser";

    constructor(private http: HttpClient) {

    }

    getAllJobs() {
        return this.http.get<IGetJobDto[]>(this.userUrl + "/jobs");
    }

    addJob(job: IPostJobDto) {
        return this.http.post(this.adminUrl + "/jobs", job);
    }
}