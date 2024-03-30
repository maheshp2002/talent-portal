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
import { ImageValidator } from 'src/app/core/validators/image.validator';
import { PreLoaderService } from 'src/app/core/services/preloader.service';

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
    resumeUrl: '',
    profileImage: ''
  };

  fileName: string = '';
  isFileSelected = false;
  userId = '';
  fileSizeInBytes: number = this.constants.fileSizeInBytes;
  allowedFileType: string = this.constants.allowedFileType;
  resumeUploadForm: FormGroup = new FormGroup({});
  imageSizeInBytes: number = this.constants.imageSizeInBytes;
  allowedImageType: string = this.constants.allowedImageType;

  constructor(
    private readonly service: AuthenticationService,
    private readonly tokenHelper: TokenHelper,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly constants: Constants,
    public readonly message: Messages,
    private readonly fileValidator: FileValidator,
    private readonly imageValidator: ImageValidator,
    private readonly profileDialogService: ProfileDialogService,
    private readonly preloaderService: PreLoaderService
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
      resume: ['',
        [
          this.fileValidator.fileSizeValidator(this.constants.fileSizeInBytes),
          this.fileValidator.fileTypeValidator()
        ]
      ],
      profileImage: ['',
        [
          this.imageValidator.imageSizeValidator(this.constants.imageSizeInBytes),
          this.imageValidator.imageTypeValidator()
        ]
      ]
    });
  }

  onFileSelect({ files }: { files: File[] }) {
    const file = files[0];
    const fileUrl = URL.createObjectURL(file);
    this.profile.resumeUrl = fileUrl;
    this.profile.resume = file.name;

    this.resumeUploadForm.patchValue({ resume: file });
    this.resumeUploadForm.get('resume')?.markAsDirty();

    if (this.fileUpload) {
      this.fileUpload.clear();
    }

    this.fileName = file.name;

    this.isFileSelected = this.resumeUploadForm.invalid ? false : true;
  }

  /**
    * Method that used to set a default image when there is an image error.
    */
  handleImageError() {
    this.profile.profileImage = '/assets/images/image-not-available.png';
  }

  /**
   * Handles the selection of an image file and updates the user profile form accordingly.
   * This method is triggered when an image file is selected using an input element.
   *
   * @param params - An object containing the selected image file(s) in the 'files' property.
   * @param params.files - An array of File objects representing the selected image files.
   */
  onImageSelect({ files }: { files: File[] }) {
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    this.profile.profileImage = imageUrl;

    this.resumeUploadForm.patchValue({ profileImage: file });
    this.resumeUploadForm.get('profileImage')?.markAsDirty();

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }  

  onSubmit() {
    this.preloaderService.show();
    const formData = new FormData();
    const temp = this.resumeUploadForm.value;

    Object.keys(temp).forEach((key) => {      
      formData.append(key, temp[key])
    });
    
    this.service.uploadResume(formData).subscribe({
      next: () => {
        this.preloaderService.hide();
        this.fileName = '';
        this.isFileSelected = false;
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Profile updated successfully'
        });
        this.getUserProfile();
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
