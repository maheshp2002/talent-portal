import { Component, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Messages } from 'src/app/common/message';
import { ToastTypes } from 'src/app/core/enums';
import { CanComponentDeactivate, IPostResult, IGetQuestions, IResponse } from 'src/app/core/interfaces';
import { DetectionService } from 'src/app/core/services/cheat-detection.service';
import { ExamService } from 'src/app/core/services/exam.service';
import { ResultService } from 'src/app/core/services/result.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements CanComponentDeactivate {
  navigatingAway: boolean = false;
  isCheating: boolean = false;
  detectObject: any;
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
    userId: "string"
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
    private readonly router: Router,
    private readonly fb: FormBuilder,
    public readonly message: Messages,
    private readonly messageService: MessageService,
    private readonly examService: ExamService,
    private readonly resultService: ResultService,
    private readonly detectionService: DetectionService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly tokenHelper: TokenHelper
  ) { }

  async ngOnInit() {
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

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = "Are you sure you want to reload thi page? This will terminate you from the exam.";
    console.log($event);

  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const confirmNavigation = window.confirm('Are you sure you want to leave this page? Leaving this page will terminate you from examination.');
    return confirmNavigation;
  }

  onDetectionStart() {
    this.detectionService.startDetection();

    // If you want to subscribe to the detected object data
    this.detectionService.getDetectedObject().subscribe((data) => {
      this.detectObject = data;
      
      if (this.detectObject.toString().toLowerCase().includes("cheating")) {
        console.log(data);
        
        this.isCheating = true;
        this.messageService.add({
          severity: ToastTypes.WARNING,
          summary: data
        });
      }
    });
  }

  onDetectionStop() {
    this.detectionService.stopDetection();
  }

  getQuestionsList() {
    this.examService.getSkillQuestions('java').subscribe({
      next: (result: any) => {
        this.response = result;
        this.mcqs = this.response.result;
        this.mcqs.forEach(mcq => {
          if (mcq.isCodeProvided) {
            mcq.code = this.restoreMultiline(mcq.code);
          }
        });
        this.currentQuestion = this.mcqs[0];
      }
    });
  }

  submit() {
    var selectedOption = this.questionForm.get('answer')?.value;
    this.result.score = this.currentQuestion.answer == selectedOption
      ? this.result.score + 1
      : this.result.score + 0;
    if (this.index < 2) {
      this.index = this.index + 1;
      this.currentQuestion = this.mcqs[this.index];
    } else {
      console.log(this.result);
      this.onDetectionStop();
      var result = this.result;
      result.isPassed = result.score >= 10 ? true : false;
      this.resultService.addResult(result).subscribe({
        next: () => {
          this.messageService.add({
            severity: ToastTypes.SUCCESS,
            summary: 'Exam completed successfully'
          });
        },

        error: () => {
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
