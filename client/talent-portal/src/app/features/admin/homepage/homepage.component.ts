import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { IGetQuestions, IResponse } from 'src/app/core/interfaces';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  response: IResponse = {
    isValid: true,
    errors: {},
    result: []
  }
  isVisible = false;
  faQuestionCircle = faQuestionCircle;
  faDelete = faTrash;
  mcqs: IGetQuestions[] = [];
  questionForm: FormGroup = new FormGroup({});

  constructor(
    private readonly fb: FormBuilder,
    public readonly message: Messages,
    private readonly messageService: MessageService,
    private readonly service: ExamService
  ) { }

  ngOnInit(): void {
    this.getQuestionsList();
    this.buildQuestionForm();
  }

  getQuestionsList() {
    this.service.getQuestions().subscribe({
      next: (result: any) => {
        this.response = result;
        this.mcqs = this.response.result;
        this.mcqs.forEach(mcq => {
          if (mcq.isCodeProvided) {
            mcq.code = this.restoreMultiline(mcq.code);
          }
        });
      }
    });
  }

  /**
   * Constructs the question form using the FormBuilder.
   */
  buildQuestionForm() {
    this.questionForm = this.fb.group({
      question: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      isCodeProvided: [false],
      code: ['', Validators.maxLength(3000)],
      optionOne: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      optionTwo: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      optionThree: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      optionFour: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      answer: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      skill: ['',
        [Validators.required, Validators.maxLength(500)]
      ]
    });
  }

  onSubmit() {
    // Fetch the code control from the form
    const codeControl = this.questionForm.get('code');

    // Check if the code control exists and has a value
    if (codeControl && codeControl.value) {
      // Transform the code value: replace newlines with spaces
      const codeValue = codeControl.value.replace(/\n/g, '\\n');

      // Update the code control value with the transformed code
      codeControl.patchValue(codeValue);
    }

    this.isVisible = false;
    this.service.addQuestions(this.questionForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Question added successfully'
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
  
  restoreMultiline(text: string): string {
    return text.replace(/\\n/g, "\n");
  }
}