import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/apiservice.service';
import * as maplibregl from 'maplibre-gl';
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map!: maplibregl.Map;
  deviceForm!: FormGroup;

  constructor(private fb: FormBuilder, private _Apiservice: ApiserviceService) { }

  ngOnInit() {
    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 0],
      zoom: 2,
    });

    this._Apiservice.device().subscribe((devices) => {
      devices.forEach((device: any) => {
        new maplibregl.Marker()
          .setLngLat([device.longitude, device.latitude])
          .addTo(this.map);
      });
    });



    this.deviceForm = this.fb.group({
      id: ['', Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required],
      direction: [null, Validators.required],
      dateunix: [null, Validators.required],
      battery: [null, Validators.required],
      speed: [null, Validators.required],
      iddevice: ['', Validators.required],
      steps: [null],
      heartbeat: [null],
      accuracy: [null],
      wifi: [''],
      note: [''],
    });
  }
  onSubmit() {
    if (this.deviceForm.valid) {
      this._Apiservice.addNewDevice(this.deviceForm.value).subscribe(
        (response) => {
          console.log('Success!', response);
        },
        (error) => {
          console.error('Error!', error);
        }
      );
    }
  }


}
