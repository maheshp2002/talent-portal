import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Messages } from 'src/app/common/message';
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
  isVisible = false;
  jobForm: FormGroup = new FormGroup({});

  constructor(
    private readonly constants: Constants,
    private readonly service: JobService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly toast: MessageService,
    public readonly message: Messages
  ) { }

  ngOnInit(): void {
    this.getJobs();
    this.buildJobForm();
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

  buildJobForm() {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      isOpen: [true],
      description: ['', [Validators.maxLength(300), Validators.required]],
      position: ['', [Validators.maxLength(200), Validators.required]]
    });
  }

  onSubmit() {
    this.isVisible = false;
    this.service.addJob(this.jobForm.value).subscribe({
      next: () => {
        this.toast.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Job added successfully'
        });
        this.getJobs();
      },

      error: (errorResponse) => {
        const errorObject = errorResponse.error;

        // Iterate through the keys in the error object
        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorMessage = errorObject[key];
            // Display or handle the error message as needed
            this.toast.add({
              severity: ToastTypes.ERROR,
              summary: errorMessage
            });
          } else {
            this.toast.add({
              severity: ToastTypes.ERROR,
              summary: 'An error occurred while adding'
            });
          }
        }
      }
    })
  }
}
