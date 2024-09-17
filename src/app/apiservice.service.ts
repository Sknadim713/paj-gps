import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  private BaseUrl = environment.BaseUrl;

  constructor(private _http: HttpClient) { }

  Login(credentials: any): Observable<any> {
    return this._http.post<any>(`${this.BaseUrl}/login`, credentials);
  }

  updateToken(token: string): Observable<any> {
    return this._http.post<any>(`${this.BaseUrl}/updatetoken`, { token });
  }

  carDeviceData(): Observable<any> {
    return this._http.get<any>(`${this.BaseUrl}/sdevice/car`,);
  }


  device(): Observable<any> {
    return this._http.get<any>(`${this.BaseUrl}/device`,);
  }
  addNewDevice(data: any): Observable<any> {
    return this._http.post<any>(`${this.BaseUrl}/trackerdata/getalllastpositions`, data);
  }

  // https://connect.paj-gps.de/api/v1/trackerdata/212/last_minutes?lastMinutes=10

  // getLastMinutesLocation() {
  //   return this._http.get<any>(`${this.BaseUrl}/trackerdata/${DEVICE_ID}`,);
  // }
  getLastMinutesLocation(deviceId: string) {
    return this._http.get<any>(`https://connect.paj-gps.de/api/trackerdata/${deviceId}/last_points?lastPoints=50`,);
  }

}
