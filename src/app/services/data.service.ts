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
  rain? : {
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

  // raw data (json)
  data = signal<weatherData[]>([]);

  // extracted data
  weather_id = signal<number | undefined>(undefined);
  weather_main = signal<string>('');
  weather_desc = signal<string>('');
  weather_icon = signal<string>('');
  temp = signal<number | undefined>(undefined);
  feels_like = signal<number | undefined>(undefined);
  temp_min = signal<number | undefined>(undefined);
  temp_max = signal<number | undefined>(undefined);
  pressure = signal<number | undefined>(undefined);
  humidity = signal<number | undefined>(undefined);
  visibility = signal<number | undefined>(undefined);
  wind_speed = signal<number | undefined>(undefined);
  wind_deg = signal<number | undefined>(undefined);
  rain = signal<number | undefined>(undefined);
  clouds = signal<number | undefined>(undefined);
  dt_time = signal<string>(''); // unix converted to time
  sys_type = signal<number | undefined>(undefined);
  sys_id = signal<number | undefined>(undefined);
  sys_country = signal<string>('');
  sunrise_time = signal<string>(''); // unix converted to time
  sunset_time = signal<string>(''); // unix converted to time
  timezone = signal<number | undefined>(undefined)
  id = signal<number | undefined>(undefined);
  name = signal<string>('');

  // fetch weather data, units: standard, metric, imperial
  fetchWeatherData(lat : number, lon : number, units : string, lang : string){
    return new Promise((resolve, reject) => {
      try{
        this.http.get(`${api}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`)
        .subscribe((dataIn : any) => {
          this.data.set([dataIn]);
          console.log(this.data());
          this.extractData();
          resolve(dataIn);
        })
      }catch(error){
        reject(error);
      }
    })
  }

  extractData(){
    this.dt_time.set(this.convertUnix(this.data()[0].dt))
    console.log('converted dt time: ', this.dt_time());
    this.sunrise_time.set(this.convertUnix(this.data()[0].sys.sunrise));
    console.log('converted sunrise time: ', this.sunrise_time());
    this.sunset_time.set(this.convertUnix(this.data()[0].sys.sunset));
    console.log('converted sunset time: ', this.sunset_time());
    this.weather_id.set(this.data()[0].weather[0].id);
    console.log(this.weather_id());
    this.weather_main.set(this.data()[0].weather[0].main);
    console.log(this.weather_main());
    this.weather_desc.set(this.data()[0].weather[0].description);
    console.log(this.weather_desc());
    this.weather_icon.set(this.data()[0].weather[0].icon);
    console.log(this.weather_icon());
    this.temp.set(this.data()[0].main.temp);
    console.log(this.temp());
    this.feels_like.set(this.data()[0].main.feels_like);
    console.log(this.feels_like());
    this.temp_min.set(this.data()[0].main.temp_min);
    console.log(this.temp_min());
    this.temp_max.set(this.data()[0].main.temp_max);
    console.log(this.temp_max());
    this.pressure.set(this.data()[0].main.pressure);
    console.log(this.pressure());
    this.humidity.set(this.data()[0].main.humidity);
    console.log(this.humidity());
    this.visibility.set(this.data()[0].visibility);
    console.log(this.visibility());
    this.wind_speed.set(this.data()[0].wind.speed);
    console.log(this.wind_speed());
    this.wind_deg.set(this.data()[0].wind.deg);
    console.log(this.wind_deg());
    this.rain.set(this.data()[0].rain?.['1h']);
    console.log(this.rain());
    this.clouds.set(this.data()[0].clouds.all);
    console.log(this.clouds());
    this.sys_type.set(this.data()[0].sys.type);
    console.log(this.sys_type());
    this.sys_id.set(this.data()[0].sys.type);
    console.log(this.sys_id());
    this.sys_country.set(this.data()[0].sys.country);
    console.log(this.sys_country());
  }

  // convert unix to time
  convertUnix(unix : number) : string{
    let date = new Date(unix * 1000);
    let res = date.toUTCString();
    return res;
  }
}
