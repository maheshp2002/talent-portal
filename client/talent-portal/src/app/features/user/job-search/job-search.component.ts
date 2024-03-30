import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowRight, faCalendar, faKeyboard, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { IGetJobDto } from 'src/app/core/interfaces';
import { JobService } from 'src/app/core/services/job.service';
import { PreLoaderService } from 'src/app/core/services/preloader.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})
export class JobSearchComponent implements OnInit {
  @ViewChild('jobsTable') jobsTable!: Table;

  rows = this.constants.row;
  jobs: IGetJobDto[] = [];
  initialJobs: IGetJobDto[] = [];
  faArrowRight = faArrowRight
  faSuitcase = faSuitcase;
  faKeyboard = faKeyboard;
  faCalendar = faCalendar;
  isResultEmpty = false;
  jobSearchForm: FormGroup = new FormGroup({});

  constructor(
    private readonly fb: FormBuilder,
    private readonly constants: Constants,
    private readonly service: JobService,
    private readonly router: Router,
    private readonly tokenHelper: TokenHelper,
    private readonly preloader: PreLoaderService,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.preloader.show();
    window.scrollTo(0, 0);
    this.buildJobSearchForm();
    this.getUserProfile();
  }

  cancelSearch(): void {
    this.jobSearchForm.get('search')?.setValue(''); // Clear the search input value
    this.filterJobs(''); // Trigger filtering with an empty search term
  }

  getUserProfile() {
    const userId = this.tokenHelper.getDecodedToken().nameidentifier;
    this.service.getAllJobs(userId).subscribe({
      next: (response: any) => {
        this.preloader.hide();
        this.initialJobs = this.jobs = response.result;        
      },

      error: (errorResponse) => {
        const errorObject = errorResponse.error;        

        // Iterate through the keys in the error object
        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorMessage = errorObject[key];
            this.messageService.add({
              severity: ToastTypes.ERROR,
              summary: errorMessage
            });
          }
        }
        this.router.navigate(['user']);
      }
    });
  }

  /**
   * Constructs the job search form using the FormBuilder.
   */
  buildJobSearchForm() {
    this.jobSearchForm = this.fb.group({
      search: [''],
    })

    this.jobSearchForm.get('search')?.valueChanges.subscribe((value: any) => {
      this.filterJobs(value);
    })
  }

  trackByJobId(index: number, job: IGetJobDto) {
    return job.id;
  }

  onClick(jobId: number) {
    this.router.navigate(['user/exam-landing', jobId])
  }

  filterJobs(value: string) {
    if (!value) {
      this.jobs = [...this.initialJobs]; // Reset to initial jobs if the search input is empty
      this.isResultEmpty = false;
      return;
    }
  
    const searchTerm = value.toLowerCase().trim();
    this.jobs = this.initialJobs.filter(
      job => job.title.toLowerCase().includes(searchTerm)
    );

    this.isResultEmpty = this.jobs.length <= 0 ? true : false;
  }
}
