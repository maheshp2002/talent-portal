import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGetResult } from 'src/app/core/interfaces';
import { ResultService } from 'src/app/core/services/result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit{
  jobId = 0;
  userId = '';
  result: IGetResult = {
    id: 0,
    isPassed: false,
    score: 0,
    jobId: 0,
    userId: '',
    totalScore: 0
  };
  percentage = 0.0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: ResultService
  ) { }

  ngOnInit() {
    this.getId();
    this.getResult();
  }

  getId() {
    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['jobId'];
      this.userId = params['userId']; 
    });
  }

  getResult() {
    this.service.getCurrentResult(this.jobId, this.userId).subscribe({
      next: (response) => {
        this.result = response;
        console.log(response);
        this.percentage = (this.result.score / this.result.totalScore) * 100;
      }
    });
  }
}
