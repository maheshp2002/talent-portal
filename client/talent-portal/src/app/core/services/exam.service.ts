import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetQuestions, IPostQuestions } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ExamService {

    adminUrl = "https://localhost:7163/api/admin/examquestions";
    userUrl = "https://localhost:7163/api/user";

    constructor(private http: HttpClient) {

    }

    getQuestions() {
        return this.http.get<IGetQuestions[]>(this.adminUrl + "/questions");
    }

    getSkillQuestions(skill: string) {
        const params = { skill: skill };
        return this.http.get<IGetQuestions[]>(this.userUrl + "/exam/skill-questions", { params });
    }

    addQuestions(question: IPostQuestions) {
        return this.http.post(this.adminUrl + "/questions", question);
    }
}