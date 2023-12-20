import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/configs/app.config';
import { IGetJobDto } from 'src/app/core/interfaces';
import { JobService } from 'src/app/core/services/job.service';

@Component({
  selector: 'app-view-all-job',
  templateUrl: './view-all-job.component.html',
  styleUrls: ['./view-all-job.component.scss']
})
export class ViewAllJobComponent {
  @ViewChild('jobsTable') jobsTable!: Table;
  
  rows = this.constants.row;
  jobs: IGetJobDto[] = [];

  constructor(
    private readonly constants: Constants,
    private readonly service: JobService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs() {
    this.service.getAllJobs().subscribe({
      next: (response: any) => {
        this.jobs = response.result;
      }
    });
  }

  trackByJobId(index: number, job: IGetJobDto) {
    return job.id;
  }

  onRowSelect(jobId: number) {
    this.router.navigate(['user/exam-landing', jobId])
  }
}
