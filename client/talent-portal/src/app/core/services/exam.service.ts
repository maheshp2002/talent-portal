import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginDto, IGetQuestions, IRegisterDto, IPostQuestions } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class ExamService {

    url = "https://localhost:7163/api/admin/examquestions";

    constructor(private http: HttpClient) {

    }

    getQuestions() {
        return this.http.get<IGetQuestions[]>(this.url + "/questions");
    }

    addQuestions(question: IPostQuestions) {
        return this.http.post(this.url + "/questions", question);
    }
}