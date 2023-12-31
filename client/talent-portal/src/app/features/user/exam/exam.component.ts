import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Messages } from 'src/app/common/message';
import { ToastTypes } from 'src/app/core/enums';
import { CanComponentDeactivate, IPostResult, IGetQuestions, IResponse } from 'src/app/core/interfaces';
import { DetectionService } from 'src/app/core/services/cheat-detection.service';
import { ExamService } from 'src/app/core/services/exam.service';
import { PreLoaderService } from 'src/app/core/services/preloader.service';
import { ResultService } from 'src/app/core/services/result.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements CanComponentDeactivate, OnInit {
  navigatingAway: boolean = false;
  personCheatingLimit: number = 0;
  objectCheatingLimit: number = 0;
  noOfQ: number = 0;
  isCheating: boolean = false;
  detectObject: any;
  isConfirmDialogShow: boolean = false;
  currentQuestion: IGetQuestions = {
    id: 0,
    question: "",
    isCodeProvided: false,
    code: "",
    optionOne: "",
    optionTwo: "",
    optionThree: "",
    optionFour: "",
    answer: ""
  }
  result: IPostResult = {
    isPassed: false,
    score: 0,
    jobId: 0,
    userId: "string",
    totalScore: 0
  }
  index = 0;
  mcqs: IGetQuestions[] = [];
  questionForm: FormGroup = new FormGroup({});
  response: IResponse = {
    isValid: true,
    errors: {},
    result: []
  }
  constructor(
    private readonly fb: FormBuilder,
    public readonly message: Messages,
    private readonly messageService: MessageService,
    private readonly examService: ExamService,
    private readonly resultService: ResultService,
    private readonly detectionService: DetectionService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly tokenHelper: TokenHelper,
    private readonly preloaderService: PreLoaderService,
    private readonly router: Router
  ) { }

  async ngOnInit() {
    this.preloaderService.show();
    this.subscribeToConfirmDialogChanges();
    this.getId();
    this.buildQuestionForm();
    this.getQuestionsList();
    try {
      await this.onDetectionStart();
    } catch {
      this.messageService.add({
        severity: ToastTypes.ERROR,
        summary: 'An error occurred during cheating detection'
      });
    }
  }

  getId() {
    this.activatedRoute.params.subscribe(params => {
      this.result.jobId = params['id'];
    });

    this.result.userId = this.tokenHelper.getDecodedToken().nameidentifier;
  }

  // Check if the is dialog value is changed.
  private subscribeToConfirmDialogChanges() {
    this.detectionService.getConfirmDialogShow().subscribe((isShow: boolean) => {
      this.isConfirmDialogShow = isShow;
      // You can add any additional logic here based on the changes
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.isCheating) {      
      $event.returnValue = "Are you sure you want to reload this page? This will terminate you from the exam.";
      this.detectionService.stopDetection();
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isConfirmDialogShow) {
      const confirmNavigation = window.confirm('Are you sure you want to leave this page? Leaving this page will terminate you from examination.');
      this.detectionService.stopDetection();
      return confirmNavigation;
    }
    return true;
  }

  onDetectionStart() {
    this.detectionService.startDetection();

    // If you want to subscribe to the detected object data
    this.detectionService.getDetectedObject().subscribe((data) => {
      this.detectObject = data;

      if (this.detectObject.toString().toLowerCase().includes("cheating")) {
        this.messageService.add({
          severity: ToastTypes.WARNING,
          summary: data
        });

        if (this.detectObject.toString().toLowerCase().includes("cheating: person detected")) {
          this.personCheatingLimit = this.personCheatingLimit + 1;
        }

        if (this.detectObject.toString().toLowerCase().includes("cheating: cell phone detected")) {
          this.objectCheatingLimit = this.objectCheatingLimit + 1;
        }

        if (this.objectCheatingLimit >= 10 || this.personCheatingLimit >= 2) {
          this.isCheating = this.isConfirmDialogShow = true;

          this.detectionService.stopDetection();
          
          setTimeout(() => {
            this.router.navigate(['user/jobs']);
          }, 3000);
        }
      }
    });
  }

  getQuestionsList() {
    this.examService.getSkillQuestions(this.result.jobId, this.result.userId).subscribe({
      next: (result: any) => {
        this.response = result;
        this.mcqs = this.response.result;
        this.noOfQ = this.mcqs.length;
        this.mcqs.forEach(mcq => {
          if (mcq.isCodeProvided) {
            mcq.code = this.restoreMultiline(mcq.code);
          }
        });
        this.currentQuestion = this.mcqs[0];
      },

      error: (errorResponse) => {
        this.isConfirmDialogShow = true;
        const errorObject = errorResponse.error;
        
        // Iterate through the keys in the error object
        for (const key in errorObject) {
          if (Object.prototype.hasOwnProperty.call(errorObject, key)) {
            const errorMessage = errorObject[key];
            // Display or handle the error message as needed
            this.messageService.add({
              severity: ToastTypes.ERROR,
              summary: errorMessage
            });
          }
        }
        
        this.detectionService.stopDetection();

        setTimeout(() => {          
          this.router.navigate(['user/jobs']);
        }, 1000);
      }

    });
  }

  submit() {
    var selectedOption = this.questionForm.get('answer')?.value;
    this.result.score = this.currentQuestion.answer.toLowerCase() == selectedOption.toLowerCase()
      ? this.result.score + 1
      : this.result.score + 0;

    if (this.index < this.noOfQ - 1) {

      this.index = this.index + 1;
      this.currentQuestion = this.mcqs[this.index];
    }
    else {
      this.detectionService.stopDetection();
      var result = this.result;
      result.totalScore = this.noOfQ
      result.isPassed = result.score >= (this.noOfQ - 1) / 2 ? true : false;
      this.resultService.addResult(result).subscribe({
        next: () => {
          this.isConfirmDialogShow = true;
          this.preloaderService.hide();
          this.messageService.add({
            severity: ToastTypes.SUCCESS,
            summary: 'Exam completed successfully'
          });
          this.router.navigate(['user/result', result.jobId, result.userId]);
        },

        error: () => {
          this.isConfirmDialogShow = true;
          this.preloaderService.hide();
          this.router.navigate(['user/result', result.jobId, result.userId]);
          this.messageService.add({
            severity: ToastTypes.ERROR,
            summary: 'An error occurred'
          });
        }
      })
    }
  }

  restoreMultiline(text: string): string {
    return text.replace(/\\n/g, "\n");
  }

  /**
   * Constructs the question form using the FormBuilder.
   */
  buildQuestionForm() {
    this.questionForm = this.fb.group({
      answer: [null, Validators.required]
    });
  }
}
