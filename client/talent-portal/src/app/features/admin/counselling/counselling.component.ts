import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Messages } from 'src/app/common/message';
import { Constants } from 'src/app/configs/app.config';
import { ToastTypes } from 'src/app/core/enums';
import { IGetCounselling } from 'src/app/core/interfaces';
import { CounsellingService } from 'src/app/core/services/CounsellingService.service';

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.scss']
})
export class CounsellingComponent {
  @ViewChild('counsellingTable') counsellingTable!: Table;
  
  isVisible = false;
  rows = this.constants.row;
  counselling: IGetCounselling[] = [];
  counsellingForm: FormGroup = new FormGroup({});

  constructor(
    private readonly fb: FormBuilder,
    private readonly constants: Constants,
    private readonly service: CounsellingService,
    public readonly message: Messages,
    private readonly messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.buildCounsellingForm();
    this.getCounsellors();
  }

  getCounsellors() {
    this.service.getAdminCounselling().subscribe({
      next: (response: any) => {
        this.counselling = response.result;
      }
    });
  }

    /**
     * Constructs the counselling form using the FormBuilder.
     */
    buildCounsellingForm() {
      this.counsellingForm = this.fb.group({
        name: ['',
          [Validators.required, Validators.maxLength(200)]
        ],
        email: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.constants.emailPattern)]],
        address: ['',
          [Validators.required, Validators.maxLength(500)]
        ],
        websiteUrl: ['',
          [Validators.required, Validators.pattern(this.constants.urlPattern)]
        ],
        phoneNumber: ['',
          [Validators.required, Validators.pattern(this.constants.phoneNumberPattern)]
        ]
      });
    }

  onSubmit() {
    this.isVisible = false;
    this.service.addCounselling(this.counsellingForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: ToastTypes.SUCCESS,
          summary: 'Counsellor added successfully'
        });
        this.getCounsellors();
      },

      error: () => {
        this.messageService.add({
          severity: ToastTypes.ERROR,
          summary: 'An error occurred while adding'
        });
      }
    })
  }
}
