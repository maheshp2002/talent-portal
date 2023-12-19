import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight, faCalendar, faChair, faKeyboard, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/configs/app.config';
import { IGetJobDto } from 'src/app/core/interfaces';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit{
  @ViewChild('jobsTable') jobsTable!: Table;
  
  rows = this.constants.row;
  jobs: IGetJobDto[] = [];
  faArrowRight = faArrowRight
  faSuitcase = faSuitcase;
  faKeyboard = faKeyboard;
  faCalendar = faCalendar;

  constructor(
    private readonly constants: Constants,
    private readonly service: JobService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile() {
    this.service.getAllJobs().subscribe({
      next: (response: any) => {
        this.jobs = response.result;
      }
    });
  }

  trackByJobId(index: number, job: IGetJobDto) {
    return job.id;
  }

  onClick(jobId: number) {
    this.router.navigate(['user/exam-landing', jobId])
  }

}
