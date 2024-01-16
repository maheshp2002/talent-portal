import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IUserProfileDto } from 'src/app/core/interfaces';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { FileValidator } from 'src/app/core/validators/file.validator';
import { MessageService } from 'primeng/api';
import { ToastTypes } from 'src/app/core/enums';
import { Subscription } from 'rxjs';
import { ProfileDialogService } from 'src/app/core/services/ProfileDialogService.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: any;
  isDialogVisible = false;
  private dialogSubscription: Subscription;

  profile: IUserProfileDto = {
    id: '',
    name: '',
    email: '',
    isAdmin: false,
    resume: '',
    resumeUrl: ''
  };

  fileName: string = '';
  isFileSelected = false;
  userId = '';
  fileSizeInBytes: number = this.constants.fileSizeInBytes;
  allowedFileType: string = this.constants.allowedFileType;
  resumeUploadForm: FormGroup = new FormGroup({});

  constructor(
    private readonly service: AuthenticationService,
    private readonly tokenHelper: TokenHelper,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly constants: Constants,
    public readonly message: Messages,
    private readonly fileValidator: FileValidator,
    private readonly profileDialogService: ProfileDialogService
  ) {
    this.dialogSubscription = this.profileDialogService.isDialogVisible$.subscribe((isVisible: boolean) => {
      this.isDialogVisible = isVisible;
    });
  }

  ngOnInit(): void {
      window.scrollTo(0, 0);
      this.isDialogVisible = false;
      this.getUserProfile();
      this.buildResumeForm();
  }

  // Image Animation
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
      if (this.isElementInViewport(element) && !element.classList.contains('animate')) {
        element.classList.add('animate');
      }
    });
  }

  isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top <= windowHeight * 0.8 &&
      rect.bottom >= windowHeight * 0.2
    );
  }

  // Other functionalities
  getUserProfile() {
    this.userId = this.tokenHelper.getDecodedToken().nameidentifier;

    this.service.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        this.profile = response.result;
      }
    });
  }

  buildResumeForm() {
    this.resumeUploadForm = this.fb.group({
      id: [this.userId],
      file: ['',
        [
          this.fileValidator.fileSizeValidator(this.constants.fileSizeInBytes),
          this.fileValidator.fileTypeValidator()
        ]
      ]
    });
  }

  onFileSelect({ files }: { files: File[] }) {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    this.profile.resumeUrl = fileUrl;
    this.profile.resume = file.name;

    this.resumeUploadForm.patchValue({ file: file });
    this.resumeUploadForm.get('file')?.markAsDirty();

    if (this.fileUpload) {
      this.fileUpload.clear();
    }

    this.fileName = file.name;

    this.isFileSelected = this.resumeUploadForm.invalid ? false : true;
  }

  onSubmit() {
    const formData = new FormData();
    const temp = this.resumeUploadForm.value;

    Object.keys(temp).forEach((key) => {
      console.log(key, temp[key]);

      formData.append(key, temp[key])
    });

    this.service.uploadResume(formData).subscribe({
      next: () => {
        this.fileName = '';
        this.isFileSelected = false;
        this.getUserProfile();
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Resume uploaded successfully'
        });
      },

      error: () => {
        this.messageService.add({
          severity: ToastTypes.ERROR,
          summary: 'An error occurred during resume upload'
        });
      }
    })
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
  }
}
