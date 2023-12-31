import { Component } from '@angular/core';
import { Constants } from 'src/app/configs/app.config';
import { IGetCounselling } from 'src/app/core/interfaces';
import { CounsellingService } from 'src/app/core/services/CounsellingService.service';

@Component({
  selector: 'app-counselling',
  templateUrl: './counselling.component.html',
  styleUrls: ['./counselling.component.scss']
})
export class CounsellingComponent {
  isVisible = false;
  rows = this.constants.row;
  counselling: IGetCounselling[] = [];

  constructor(
    private readonly constants: Constants,
    private readonly service: CounsellingService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getCounsellors();
  }

  getCounsellors() {
    this.service.getAdminCounselling().subscribe({
      next: (response: any) => {
        this.counselling = response.result;        
      }
    });
  }
}
