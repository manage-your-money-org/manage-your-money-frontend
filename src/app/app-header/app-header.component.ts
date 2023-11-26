import {Component, OnInit} from '@angular/core';
import {UserAuthenticationService} from '../services/user-authentication/user-authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent implements OnInit {


  constructor(private router: Router, private userAuthenticationService: UserAuthenticationService) {
  }

  ngOnInit(): void {

  }

  logoutUser() {

    this.userAuthenticationService.logoutUser().subscribe();

    this.router.navigate(['/login']);
  }

}
