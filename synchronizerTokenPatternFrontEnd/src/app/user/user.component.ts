import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  csrfJson = { csrf: '', amount: 0 };
  cookieId = '';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.cookieId = this.cookieService.get('SessionID');
    console.log(this.cookieId);
    this.http.get('http://localhost:3000/getToken').subscribe((data: any) => {
      console.log(data);
      this.csrfJson.csrf = data.csrfToken;
    });
  }

  /**
   * transfer current csrf
   */
  transferToken() {
    this.http.post('http://localhost:3000/transferToken', {
      amount: this.csrfJson.amount,
      token: this.csrfJson.csrf
    }, { headers: new HttpHeaders().set('SID', this.cookieId) }).subscribe(
      (res: any) => {
        alert(res.result);
        console.log(res);
      },
      err => {
        alert(err.message);
        console.log(err);
      }
    );
  }

  /**
   * logout
   */
  logOut() {
    this.router.navigate(['/login']);
  }

}
