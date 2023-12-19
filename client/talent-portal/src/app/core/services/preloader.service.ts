import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PreLoaderService {

	/**
	 * Subject that emits a boolean value indicating whether a loading state is currently active.
	 */
	isLoading$ = new BehaviorSubject<boolean>(false);

	/**
	 * Sets the isLoading Subject to emit a true value, indicating that a loading state is currently active.
	 */
	show() {
		this.isLoading$.next(true);
	}

	/**
	 * Sets the isLoading Subject to emit a true value, indicating that a loading state is currently active.
	 */
	hide() {
		this.isLoading$.next(false);
	}
}
