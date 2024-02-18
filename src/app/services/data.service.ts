import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const api = environment.weatherApi;
const apiKey = environment.apiKey;

export interface weatherData{
  coord : {
    lon : number,
    lat : number
  },
  weather : [{
    id : number,
    main : string,
    description : string,
    icon : string
  }],
  base : string,
  main : {
    temp : number,
    feels_like : number,
    temp_min : number,
    temp_max : number,
    pressure : number,
    humidity : number,
    sea_level : number,
    grnd_level : number,
  },
  visibility : number,
  wind : {
    speed : number,
    deg : number,
    gust : number
  },
  rain : {
    '1h' : number
  },
  clouds : {
    all : number
  },
  dt : number,
  sys : {
    type : number,
    id : number,
    country : string,
    sunrise : number,
    sunset : number
  },
  timezone : number,
  id : number,
  name : string,
  cod : number
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http : HttpClient) { }

  data = signal<weatherData[]>([]);
  time = signal<string>('');
  
  // fetch weather data, units: standard, metric, imperial
  async fetchWeatherData(lat : number, lon : number, units : string, lang : string){
    return new Promise((resolve, reject) => {
      try{
        this.http.get(`${api}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`)
        .subscribe((dataIn : any) => {
          this.data.set([dataIn]);
          console.log(this.data());
          this.time.set(this.convertUnix(this.data()[0].dt))
          console.log(this.time());
          resolve(dataIn);
        })
      }catch(error){
        reject(error);
      }
    })
  }

  // convert unix to time
  convertUnix(unix : number) : string{
    let date = new Date(unix * 1000);
    let res = date.toUTCString();
    return res;
  }
}
