import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { IGetJobDto, UpdateJobStatusDto } from 'src/app/core/interfaces';
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
    private readonly router: Router,
    private readonly toast: MessageService
  ) { }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs() {
    this.service.getAllJobsAdmin().subscribe({
      next: (response: any) => {
        this.jobs = response.result;
      }
    });
  }

  updateStatus(jobId: number, isOpen: boolean) {
    const updateStatus: UpdateJobStatusDto = {
      id: jobId,
      isOpen: !isOpen
    }
    this.service.updateJobStatus(updateStatus).subscribe({
      next: () => {
        this.getJobs();
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Job Status Updated Successfully'
        });
      }
    });
  }

  trackByJobId(index: number, job: IGetJobDto) {
    return job.id;
  }

  onRowSelect(jobId: number) {
    this.router.navigate(['admin/exam-result', jobId])
  }
}
