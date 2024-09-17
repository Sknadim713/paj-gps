import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AnimationController, Platform, ToastController } from '@ionic/angular';
import { ApiserviceService } from 'src/app/apiservice.service';
import { Template } from 'src/app/types/home';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  devices: any;

  constructor(
    public toastController: ToastController,
    private animationCtrl: AnimationController,
    private platform: Platform,
    private _ApiService: ApiserviceService,

  ) {
    // this.getAllcard()
  }





  async onScreenClick(temp: Template) {
    if (!temp.screenPath) {
      const toast = await this.toastController.create({
        message: 'Coming soon...',
        duration: 2000,
      });
      toast.present();
    }
  }

  listKeyExtractor(_i: number, screen: Template) {
    return screen.id;
  }

  // getAllcard() {
  //   this._ApiService.device().subscribe((res: any) => {
  //     this.devices = res;
  //   });
  // }

  onDeviceSelect(device: any) {
    const lat = device.last_lat_symbol;
    const lng = device.last_lng_symbol;
    // this.map.setView([lat, lng], 15);  
    // L.marker([lat, lng]).addTo(this.map); 
  }

}
