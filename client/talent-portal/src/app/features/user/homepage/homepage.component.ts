import { Component, OnInit, ViewChild } from '@angular/core';
import { IResponse, IUserProfileDto } from 'src/app/core/interfaces';
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
    private profileDialogService: ProfileDialogService
  ) {
    this.dialogSubscription = this.profileDialogService.isDialogVisible$.subscribe((isVisible: boolean) => {
      this.isDialogVisible = isVisible;
    });
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.buildResumeForm();
  }

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
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Resume uploaded successfully'
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
