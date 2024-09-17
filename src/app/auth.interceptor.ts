import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiserviceService } from './apiservice.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: ApiserviceService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    // Clone the request and add the Authorization header if the token is present
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Token added to request:', token); // Debug log to check the token
    } else {
      console.warn('No token found, proceeding without Authorization header');
    }

    // Proceed with the request and handle errors
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error); // Log the error details

        if (error.status === 401) {
          // Unauthorized error handling (token expired, invalid, etc.)
          console.error('Unauthorized (401) - Redirecting to login page');
          // this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden error handling (user does not have permission)
          console.error('Forbidden (403) - Access denied');
          this.router.navigate(['/access-denied']); // Optional: Redirect to an error page
        }

        // Return the error to the caller
        return throwError(error);
      })
    );
  }

}
