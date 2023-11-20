import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { CanComponentDeactivate, IGetQuestions, IResponse } from 'src/app/core/interfaces';
import { DetectionService } from 'src/app/core/services/cheat-detection.service';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements CanComponentDeactivate {
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
    private readonly constants: Constants,
    private readonly service: ExamService,
    private readonly detectionService: DetectionService,
    private readonly confirmMessageService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getQuestionsList();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const confirmNavigation = window.confirm('Are you sure you want to leave this page?');
    return confirmNavigation;
  }

  onStartClick() {
    this.detectionService.startDetection();
  }

  onStopClick() {
    this.detectionService.stopDetection();
  }

  getQuestionsList() {
    this.service.getSkillQuestions('java').subscribe({
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

  nextQuestion() {
    this.index = this.index + 1;
    this.currentQuestion = this.mcqs[this.index];
  }

  restoreMultiline(text: string): string {
    return text.replace(/\\n/g, "\n");
  }
}
