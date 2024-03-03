import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { CanComponentDeactivate, IPostResult, IGetMcqQuestions, IResponse, ISelectedOption, IDescriptiveScore } from 'src/app/core/interfaces';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
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
export class ExamComponent implements CanComponentDeactivate, OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoElement: any;
  @ViewChild('canvas', { static: true }) canvas: any;
  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: true
  };

  userId = '';
  navigatingAway: boolean = false;
  personCheatingLimit: number = 0;
  objectCheatingLimit: number = 0;
  noOfQ: number = 0;
  isCheating: boolean = false;
  detectObject: any;
  isConfirmDialogShow: boolean = false;
  isDescriptiveQuestion = false;
  faceMatchCount = 0;
  currentQuestion: IGetMcqQuestions = {
    id: 0,
    question: "",
    isCodeProvided: false,
    code: "",
    optionOne: "",
    optionTwo: "",
    optionThree: "",
    optionFour: "",
    answer: "",
    isDescriptiveQuestion: false
  }
  descriptiveAnswer: IDescriptiveScore[] = [];
  selectedOptions: ISelectedOption[] = [];
  totalScore = 0;

  result: IPostResult = {
    isPassed: false,
    score: 0,
    jobId: 0,
    userId: "string",
    totalScore: 0
  }
  index = 0;
  mcqs: IGetMcqQuestions[] = [];
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
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly authenticationService: AuthenticationService,
    private readonly constants: Constants
  ) { }

  async ngOnInit() {
    this.preloaderService.show();
    this.getUserProfile();
    this.subscribeToConfirmDialogChanges();
    this.getId();
    this.buildQuestionForm();
    this.getMcqQuestionsList();
    const storedResult = localStorage.getItem(this.constants.mcqResults);
    const storeQuestion = localStorage.getItem(this.constants.mcqQuestions);
    // this.capture();
    if (storedResult) {
      this.clearMcqResultFromLocalStorage();
      this.clearDescriptiveQuestionResultFromLocalStorage();
    }
    if (storeQuestion) {
      this.clearMcqQuestionFromLocalStorage();
    }

  }

  async sendPassportImage(base64Data: any) {
    try {
      this.onDetectionStart(base64Data);
      this.startCameraAfterPassportProcessing();
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
      this.preloaderService.hide();
  
      // Continuously send camera feed for cheating detection
      setInterval(() => {
        this.captureFrameAndSend();
      }, 1000); // Adjust interval as needed
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }

    // Method to stop the camera
    stopCamera() {
      const stream = this.videoElement.nativeElement.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track: any) => track.stop());
      }
    }
  
  
  captureFrameAndSend() {
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.nativeElement.videoWidth;
    canvas.height = this.videoElement.nativeElement.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);
    const base64Data = canvas.toDataURL('image/jpeg');
  
    // Send camera feed for cheating detection
    this.detectionService.sendCameraFeed(base64Data);
  }

  startCameraAfterPassportProcessing() {
    this.detectionService.getDetectedObject().subscribe((message: string) => {      
      if (message.includes('Passport image uploaded successfully')) {
        this.startCamera();
      }
    });
  }

  getUserProfile() {
    this.userId = this.tokenHelper.getDecodedToken().nameidentifier;

    this.authenticationService.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        try {
          this.downloadImageAndConvertToBase64(response.result.profileImage);
        } catch {
          this.messageService.add({
            severity: ToastTypes.ERROR,
            summary: 'An error occurred during cheating detection'
          });
        }
      }
    });
  }

  downloadImageAndConvertToBase64(imageUrl: string): void {
    this.http.get(imageUrl, { responseType: 'blob' })
      .subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string | ArrayBufferLike | Blob | ArrayBufferView;
          this.sendPassportImage(base64Data); // Start detection with the base64 data
        };
        reader.readAsDataURL(blob);
      });
  }

  getId() {
    this.activatedRoute.params.subscribe(params => {
      this.result.jobId = Number.parseFloat(params['id']);
    });

    this.result.userId = this.tokenHelper.getDecodedToken().nameidentifier;
  }

  // Check if the is dialog value is changed.
  private subscribeToConfirmDialogChanges() {
    this.detectionService.getConfirmDialogShow().subscribe((isShow: boolean) => {
      this.isConfirmDialogShow = isShow;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.isCheating) {
      $event.returnValue = "Are you sure you want to reload this page? This will terminate you from the exam.";
      this.detectionService.stopDetection();
      this.stopCamera();
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isConfirmDialogShow) {
      const confirmNavigation = window.confirm('Are you sure you want to leave this page? Leaving this page will terminate you from examination.');
      this.detectionService.stopDetection();
      this.stopCamera();
      return confirmNavigation;
    }
    return true;
  }

  onDetectionStart(base64Data: string | ArrayBufferLike | Blob | ArrayBufferView) {    
    this.detectionService.startDetection(base64Data);

    this.detectionService.getDetectedObject().subscribe((data) => {
      this.detectObject = data;
      console.log(data);
      

      if (this.detectObject.toString().toLowerCase().includes("cheating")) {
        this.messageService.add({
          severity: ToastTypes.WARNING,
          summary: data
        });

        if (this.detectObject.toString().toLowerCase().includes("cheating: more than one face detected!")) {
          this.personCheatingLimit = (this.personCheatingLimit || 0) + 1; // Initialize if undefined
        }

        if (this.detectObject.toString().toLowerCase().includes("cheating: cell phone detected!")) {
          this.objectCheatingLimit = (this.objectCheatingLimit || 0) + 1; // Initialize if undefined
        }

        if(this.detectObject.toString().toLowerCase().includes("cheating: face not matching user profile!")) {
          this.faceMatchCount = (this.objectCheatingLimit || 0) + 1;
        }

        // Check if cheating limits exceeded
        if (this.objectCheatingLimit >= 10 || this.personCheatingLimit >= 2 || this.faceMatchCount >= 2) {
          this.isCheating = this.isConfirmDialogShow = true;
          this.detectionService.stopDetection();
          this.stopCamera();

          setTimeout(() => {
            this.router.navigate(['user/jobs']);
          }, 3000);
        }
      }
    });
  }

  getMcqQuestionsList() {
    this.examService.getMcqQuestions(this.result.jobId, this.result.userId).subscribe({
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
            this.messageService.add({
              severity: ToastTypes.ERROR,
              summary: errorMessage
            });
          }
        }

        this.detectionService.stopDetection();
        this.stopCamera();

        setTimeout(() => {          
          this.router.navigate(['user/jobs']);
        }, 1000);
      }

    });
  }

  getDescriptiveQuestionsList() {
    this.examService.getDescriptiveQuestions(this.result.jobId, this.result.userId).subscribe({
      next: (result: any) => {
        this.response = result;
        this.mcqs = this.response.result;
        this.noOfQ = this.mcqs.length;
        this.currentQuestion = this.mcqs[0];
      },

      error: (errorResponse) => {
        this.isConfirmDialogShow = true;
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

        this.detectionService.stopDetection();
        this.stopCamera();

        setTimeout(() => {          
          this.router.navigate(['user/jobs']);
        }, 1000);
      }

    });
  }

  onBackClick() {
    const currentIndex = this.index;
    this.index = this.index - 1;
    this.currentQuestion = this.mcqs[this.index];
    this.questionForm.patchValue({ answer: this.getAnswerAtIndex(currentIndex - 1) })
  }

  /**
   * Get answer from local storage.
   * @param index 
   * @returns string
   */
  getAnswerAtIndex(index: number): string {
    // Get the list from local storage
    var questionListString: string | null;
    if (!this.isDescriptiveQuestion) {
      questionListString = localStorage.getItem(this.constants.mcqQuestions);
    } else {
      questionListString = localStorage.getItem(this.constants.descriptiveQuestions);
    }

    // Check if the list exists in local storage
    if (questionListString) {
      const questionList: any[] = JSON.parse(questionListString);

      // Find the entry with the matching index
      const questionData = questionList.find((item: any) => item.index === index);

      // If an entry with the matching index is found, return its answer
      if (questionData) {
        return questionData.selectedOption;
      }
    }

    return "";
  }

  submit() {
    let questionList: any[] = [];
    if (this.isDescriptiveQuestion) {
      // Get the list from local storage or initialize if it doesn't exist
      const questionListString = localStorage.getItem(this.constants.descriptiveQuestions);
      questionList = questionListString ? JSON.parse(questionListString) : [];
    } else {
      const questionListString = localStorage.getItem(this.constants.mcqQuestions);
      questionList = questionListString ? JSON.parse(questionListString) : [];
    }

    // Check if data for the current question already exists in the list
    const existingQuestionIndex = questionList.findIndex((item: any) => item.index === this.index);
    if (existingQuestionIndex !== -1) {
      // Update existing data
      questionList[existingQuestionIndex] = {
        index: this.index,
        question: this.currentQuestion,
        selectedOption: this.questionForm.get('answer')?.value,
        correctAnswer: this.currentQuestion.answer
      };

    } else {
      // Add new data
      questionList.push({
        index: this.index,
        question: this.currentQuestion,
        selectedOption: this.questionForm.get('answer')?.value,
        correctAnswer: this.currentQuestion.answer
      });
    }

    if (this.isDescriptiveQuestion) {
      // Store the updated list in local storage
      localStorage.setItem(this.constants.descriptiveQuestions, JSON.stringify(questionList));
    } else {
      localStorage.setItem(this.constants.mcqQuestions, JSON.stringify(questionList));
    }

    if (this.index < this.noOfQ - 1) {
      this.index = this.index + 1;
      this.currentQuestion = this.mcqs[this.index];
      if (existingQuestionIndex !== -1) {
        this.questionForm.patchValue({ answer: this.getAnswerAtIndex(this.index) })
      }
    } else {

      if (!this.isDescriptiveQuestion) {
        // Calculate score based on selected options and correct answers
        this.result.score = 0;
        this.selectedOptions.forEach(element => {
          const question = this.mcqs[element.index];
          const selectedOption = element.option;
          const correctAnswer = question.answer;

          if (selectedOption === correctAnswer) {
            this.result.score++;
          }
        });

        // Calculate total score and determine if the exam is passed
        this.result.totalScore = this.noOfQ;
        this.result.isPassed = this.result.score >= (this.noOfQ - 1) / 2;

        // Store result in local storage
        localStorage.setItem(this.constants.mcqResults, JSON.stringify(this.result));
        this.isDescriptiveQuestion = true;
        this.getDescriptiveQuestionsList();
        this.buildQuestionForm();
        this.index = 0;
        console.log("score", this.result.score);
      } else {
        let answer: IDescriptiveScore = {
          questionId: this.currentQuestion.id,
          userAnswer: this.questionForm.get('answer')?.value
        }
        this.descriptiveAnswer.push(answer);
        this.getDescriptiveScore();
      }
    }
  }

  getDescriptiveScore() {    
    this.preloaderService.show();
    this.examService.descriptiveScore(this.descriptiveAnswer).subscribe({
      next: (response: any) => {
        this.examResult(response.result);
      },

      error: (errorResponse: any) => {
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
      }
    });
  }

  examResult(descriptiveResult: string) {
    const questionListString = localStorage.getItem(this.constants.mcqResults);
    const mcq = questionListString ? JSON.parse(questionListString) : [];

    var result = this.result;
    // Parse the string to float and then add them together
    const parsedScore = Number.parseFloat(mcq.score) + Number.parseFloat(descriptiveResult);
    result.score = parseFloat(parsedScore.toFixed(2));
    result.totalScore = this.noOfQ + mcq.totalScore
    result.isPassed = result.score >= (result.totalScore) / 2 ? true : false;
    
    this.resultService.addResult(result).subscribe({
      next: () => {
        this.isConfirmDialogShow = true;
        this.preloaderService.hide();
        this.detectionService.stopDetection();
        this.stopCamera();
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Exam completed successfully'
        });
        this.router.navigate(['user/result', result.jobId, result.userId]);
      },

      error: () => {
        this.detectionService.stopDetection();
        this.stopCamera();
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

    this.questionForm.get('answer')?.valueChanges.subscribe((value) => {
      if (!this.selectedOptions[this.index]) {
        this.selectedOptions.push({ option: value, index: this.index })
      } else {
        this.selectedOptions[this.index].option = value;
      }
    })
  }

  clearMcqQuestionFromLocalStorage() {
    localStorage.removeItem(this.constants.mcqQuestions);
  }

  clearMcqResultFromLocalStorage() {
    localStorage.removeItem(this.constants.mcqResults);
  }

  clearDescriptiveQuestionResultFromLocalStorage() {
    localStorage.removeItem(this.constants.descriptiveQuestions)
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.detectionService.stopDetection();
    this.clearMcqQuestionFromLocalStorage();
    this.clearDescriptiveQuestionResultFromLocalStorage();
  }
}
