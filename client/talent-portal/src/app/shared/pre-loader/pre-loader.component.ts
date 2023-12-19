import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { PreLoaderService } from 'src/app/core/services/preloader.service';

@Component({
  selector: 'app-pre-loader',
  templateUrl: './pre-loader.component.html',
  styleUrls: ['./pre-loader.component.scss']
})
export class PreLoaderComponent {
	isLoading$: Subject<boolean> = this.loaderService.isLoading$;

	constructor(private readonly loaderService: PreLoaderService) { }
}
