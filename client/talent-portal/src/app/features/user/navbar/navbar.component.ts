import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ToastTypes } from 'src/app/core/enums';
import { ProfileDialogService } from 'src/app/core/services/ProfileDialogService.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TokenHelper } from 'src/app/core/utilities/helpers/token.helper';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() profileClick: EventEmitter<void> = new EventEmitter<void>();
  isConfirmShow = false;
  faHome = faHome;
  faLogout = faSignOutAlt
  userId = '';
  profileImage = '';

  constructor(
    private readonly activatedRouter: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: MessageService,
    private profileDialogService: ProfileDialogService,
    private readonly tokenHelper: TokenHelper,
    private readonly authenticationService: AuthenticationService
  ) { }


  ngOnInit(): void {
    this.getPath();
    this.getUserProfile();
  }

  getPath() {
    this.activatedRouter.params.pipe(take(1)).subscribe((params) => {
      console.log(params);

    });
  }

  getUserProfile() {
    this.userId = this.tokenHelper.getDecodedToken().nameidentifier;

    this.authenticationService.getUserProfile(this.userId).subscribe({
      next: (response: any) => {
        if (response.result.profileImage != '') {
          this.profileImage = response.result.profileImage;
        }
      }
    });
  }

  /**
   * Clears the local storage and navigates the user to the home page.
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
    this.toast.add({
      severity: ToastTypes.SUCCESS,
      summary: 'Logged out successfully'
    });
  }

  onProfileClick(): void {
    this.profileDialogService.setIsDialogVisible(true);
  }
}
