import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetJobDto, IPostJobDto, IResponse, UpdateJobStatusDto } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    adminUrl = "https://localhost:7163/api/admin/jobsAdmin";
    userUrl = "https://localhost:7163/api/user/jobsUser";

    constructor(private http: HttpClient) {

    }

    getAllJobs(userId: string) {
        return this.http.get<IGetJobDto[]>(`${this.userUrl}/skill-jobs/${userId}`);
    }
    
    getAllJobsAdmin() {
        console.log(this.adminUrl + "/jobs");
        
        return this.http.get<IGetJobDto[]>(this.adminUrl + "/jobs");
    }

    updateJobStatus(updateStatus: UpdateJobStatusDto) {
        return this.http.put<IResponse>(this.adminUrl + "/update-status", updateStatus);
    }

    addJob(job: IPostJobDto) {
        return this.http.post(this.adminUrl + "/jobs", job);
    }
}