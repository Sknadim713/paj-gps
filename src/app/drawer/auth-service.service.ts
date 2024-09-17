import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'https://connect.paj-gps.de/api/v1/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.loginUrl, body, { headers })
      .pipe(
        map((response: any) => {

          if (response && response.success && response.success.token) {
            const token = response.success.token;
            localStorage.setItem('authToken', token);
            return token;
          } else {
            throw new Error('Token not found in response');
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }
}
