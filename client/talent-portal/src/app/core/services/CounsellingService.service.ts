import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICounselling, IGetCounselling } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class CounsellingService {

    adminUrl = "https://localhost:7163/api/admin/counselling";
    userUrl = "https://localhost:7163/api/user/counselling";

    constructor(private http: HttpClient) {

    }

    getAdminCounselling() {
        return this.http.get<IGetCounselling[]>(this.adminUrl);
    }

    addCounselling(counselling: ICounselling) {
        return this.http.post(this.adminUrl, counselling);
    }

    getUserCounselling() {
        return this.http.get<IGetCounselling[]>(this.userUrl);
    }
}