import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Messages } from 'src/app/common/message';
import { ToastTypes } from 'src/app/core/enums';
import { IGetMcqQuestions, IResponse } from 'src/app/core/interfaces';
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
  isConfirmShow = false;
  questionId = 0;
  faQuestionCircle = faQuestionCircle;
  faDelete = faTrash;
  mcqs: IGetMcqQuestions[] = [];
  questionForm: FormGroup = new FormGroup({});
  initialFormState: FormGroup = new FormGroup({});
  confirmHeader = 'Delete Question';
  confirmMessage = 'Are you sure you want to delete this question?'

  constructor(
    private readonly fb: FormBuilder,
    public readonly message: Messages,
    private readonly messageService: MessageService,
    private readonly service: ExamService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
      question: ['', [Validators.required, Validators.maxLength(500)]],
      isCodeProvided: [false],
      code: ['', Validators.maxLength(3000)],
      optionOne: ['', this.optionValidator()],
      optionTwo: ['', this.optionValidator()],
      optionThree: ['', this.optionValidator()],
      optionFour: ['', this.optionValidator()],
      answer: ['', Validators.required],
      skill: ['', [Validators.required, Validators.maxLength(500)]],
      isDescriptiveQuestion: [false]
    });

    // Listen to changes in isDescriptiveQuestion and update validators for options accordingly
    this.questionForm.get('isDescriptiveQuestion')?.valueChanges.subscribe(value => {
      const optionOneControl = this.questionForm.get('optionOne');
      const optionTwoControl = this.questionForm.get('optionTwo');
      const optionThreeControl = this.questionForm.get('optionThree');
      const optionFourControl = this.questionForm.get('optionFour');

      // Ensure controls are not null before accessing properties
      optionOneControl?.clearValidators();
      optionTwoControl?.clearValidators();
      optionThreeControl?.clearValidators();
      optionFourControl?.clearValidators();

      if (!value) {
        // If isDescriptiveQuestion is false, apply validators for options
        optionOneControl?.setValidators([Validators.required, Validators.maxLength(500)]);
        optionTwoControl?.setValidators([Validators.required, Validators.maxLength(500)]);
        optionThreeControl?.setValidators([Validators.required, Validators.maxLength(500)]);
        optionFourControl?.setValidators([Validators.required, Validators.maxLength(500)]);
      }

      // Update validity of controls
      optionOneControl?.updateValueAndValidity();
      optionTwoControl?.updateValueAndValidity();
      optionThreeControl?.updateValueAndValidity();
      optionFourControl?.updateValueAndValidity();
    });
  }

  // Custom validator function for options
  optionValidator() {
    return [Validators.required, Validators.maxLength(500)];
  }

  /**
   * Reset settingsForm to it's initial state.
   */
  resetForm() {
    this.questionForm.reset(this.initialFormState);
  }

  ConfirmShow(id: number) {
    this.questionId = id;
    this.isConfirmShow = true;
  }

  onDelete() {
    this.isConfirmShow = false;
    this.service.deleteQuestions(this.questionId).subscribe({
      next: () => {
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Question deleted successfully'
        });
        this.getQuestionsList();
      },

      error: () => {
        this.messageService.add({
          severity: ToastTypes.ERROR,
          summary: 'An error occurred while deleting'
        });
      }
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
        this.getQuestionsList();
      },

      error: (errorResponse) => {
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
          } else {
            this.messageService.add({
              severity: ToastTypes.ERROR,
              summary: 'An error occurred while adding'
            });
          }
        }
      }
    })
    this.buildQuestionForm();
  }

  restoreMultiline(text: string): string {
    return text.replace(/\\n/g, "\n");
  }
}