import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from 'src/app/apiservice.service';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private _ApiService: ApiserviceService,
    public toastController: ToastController,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService, private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }




  onLogin() {
    if (this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (token) => {

            this.presentToast('Login successful!', 'success');
            this.router.navigate(['/main']);
          },
          error: (error) => {
            this.presentToast('Login failed: ' + error.message, 'danger');
          }
        });
    } else {
      this.presentToast('Email and password are required', 'warning');
    }
  }




  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }


}
