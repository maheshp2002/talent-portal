import { Component } from '@angular/core';
import { faArrowRight, faSuitcase, faKeyboard, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { IGetAllResultUser } from 'src/app/core/interfaces';
import { ResultService } from 'src/app/core/services/result.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';

@Component({
  selector: 'app-attended-exams',
  templateUrl: './attended-exams.component.html',
  styleUrls: ['./attended-exams.component.scss']
})
export class AttendedExamsComponent {
  results: IGetAllResultUser[] = [];
  jobId = 0;
  faArrowRight = faArrowRight
  faSuitcase = faSuitcase;
  faKeyboard = faKeyboard;
  faCalendar = faCalendar;
  
  constructor(
    private readonly tokenHelper: TokenHelper,
    private readonly service: ResultService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getResult();
  }
  
  getResult() {
    let userId = this.tokenHelper.getDecodedToken().nameidentifier;

    this.service.getAllResultUser(userId).subscribe({
      next: (response: any) => {
        this.results = response.result;
        console.log(this.results);
      }
    });
  }
}
