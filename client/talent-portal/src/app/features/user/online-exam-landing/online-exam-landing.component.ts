import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-online-exam-landing',
  templateUrl: './online-exam-landing.component.html',
  styleUrls: ['./online-exam-landing.component.scss']
})
export class OnlineExamLandingComponent implements OnInit {
  jobId: number = 0;

  ngOnInit(): void {
    this.getJobId();
  }

  constructor(private readonly route: ActivatedRoute) { }

  getJobId() {
    this.route.params.subscribe(params => {
      this.jobId = params['id'];
    });
  }
}
