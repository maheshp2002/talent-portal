import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Constants } from 'src/app/configs/app.config';
import { IGetAllResultAdmin, IGetAllResultUser } from 'src/app/core/interfaces';
import { ResultService } from 'src/app/core/services/result.service';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.scss']
})
export class ExamResultComponent implements OnInit {
  @ViewChild('resultTable') resultTable!: Table;
  
  rows = this.constants.row;
  results: IGetAllResultAdmin[] = [];
  jobId = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly constants: Constants,
    private readonly service: ResultService,
    public readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getId();
  }
  
  getId() {
    this.activatedRoute.params.subscribe(params => {
      this.jobId = params['id'];      
    });
    this.getResult();
  }

  getResult() {
    this.service.getResultAdmin(this.jobId).subscribe({
      next: (response: any) => {
        this.results = response.result;
        console.log(this.results); 
      }
    });
  }

  openModal(imageUrl: string): void {
    this.dialog.open(ImageModalComponent, {
      data: { imageSrc: imageUrl }
    });
  }
}
