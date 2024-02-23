import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDescriptiveScore, IGetMcqQuestions, IPostQuestions, IResponse } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ExamService {

    adminUrl = "https://localhost:7163/api/admin/examquestions";
    userUrl = "https://localhost:7163/api/user";

    constructor(private http: HttpClient) {

    }

    getQuestions() {
        return this.http.get<IGetMcqQuestions[]>(this.adminUrl + "/questions");
    }

    getMcqQuestions(jobId: number, userId: string) {
        const params = { jobId: jobId, userId: userId };
        return this.http.get<IGetMcqQuestions[]>(this.userUrl + "/exam/mcq-questions", { params });
    }

    getDescriptiveQuestions(jobId: number, userId: string) {
        const params = { jobId: jobId, userId: userId };
        return this.http.get<IGetMcqQuestions[]>(this.userUrl + "/exam/descriptive-questions", { params });
    }

    descriptiveScore(descriptiveScore: IDescriptiveScore[]) {
        return this.http.post<string>(this.userUrl + "/exam/descriptive-answer", descriptiveScore);
    }

    addQuestions(question: IPostQuestions) {
        return this.http.post(this.adminUrl + "/questions", question);
    }

    deleteQuestions(id: number) {
        console.log(id);
        
        return this.http.delete(this.adminUrl + "/questions/" + id);
    }
}