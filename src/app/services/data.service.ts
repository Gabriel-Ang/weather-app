import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';

const weatherApi = environment.weatherApi;
const apiKey = environment.apiKey;
const directGeocodingApi = environment.directGeocodingApi;
const reverseGeocodingApi = environment.reverseGeocodingApi;

export interface weatherData {
  coord: {
    lon: number,
    lat: number
  },
  weather: [{
    id: number,
    main: string,
    description: string,
    icon: string
  }],
  base: string,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number,
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number,
    gust: number
  },
  rain?: {
    '1h'?: number
  },
  clouds: {
    all: number
  },
  dt: number,
  sys: {
    type: number,
    id: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: number,
  id: number,
  name: string,
  cod: number
};

export interface directGeocodeObj {
  name: string;
  local_name?: string;
  lat: number,
  lon: number,
  country: string,
  state: string
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http: HttpClient, private msgService: MessageService) { }

  // raw data (json)
  data = signal<weatherData[] | undefined>(undefined);
  directGeocodeList = signal<directGeocodeObj[] | undefined>(undefined);
  showGeocodeList : boolean = false;

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

  extractData() {
    this.dt_time.set(this.convertUnix(this.data()![0].dt))
    this.sunrise_time.set(this.convertUnix(this.data()![0].sys.sunrise));
    this.sunset_time.set(this.convertUnix(this.data()![0].sys.sunset));
    this.weather_id.set(this.data()![0].weather[0].id);
    this.weather_main.set(this.data()![0].weather[0].main);
    this.weather_desc.set(this.data()![0].weather[0].description);
    this.weather_icon.set(this.data()![0].weather[0].icon);
    this.temp.set(this.data()![0].main.temp);
    this.feels_like.set(this.data()![0].main.feels_like);
    this.temp_min.set(this.data()![0].main.temp_min);
    this.temp_max.set(this.data()![0].main.temp_max);
    this.pressure.set(this.data()![0].main.pressure);
    this.humidity.set(this.data()![0].main.humidity);
    this.visibility.set(this.data()![0].visibility);
    this.wind_speed.set(this.data()![0].wind.speed);
    this.wind_deg.set(this.data()![0].wind.deg);
    this.rain.set(this.data()![0].rain?.['1h']);
    this.clouds.set(this.data()![0].clouds.all);
    this.sys_type.set(this.data()![0].sys.type);
    this.sys_id.set(this.data()![0].sys.type);
    this.sys_country.set(this.data()![0].sys.country);

    // this.dt_time.set(this.convertUnix(this.data()?[0].dt))
    // this.sunrise_time.set(this.convertUnix(this.data()?[0].sys.sunrise));
    // this.sunset_time.set(this.convertUnix(this.data()?[0].sys.sunset));
    // this.weather_id.set(this.data()?[0].weather[0].id);
    // this.weather_main.set(this.data()?[0].weather[0].main);
    // this.weather_desc.set(this.data()?[0].weather[0].description);
    // this.weather_icon.set(this.data()?[0].weather[0].icon);
    // this.temp.set(this.data()?[0].main.temp);
    // this.feels_like.set(this.data()?[0].main.feels_like);
    // this.temp_min.set(this.data()?[0].main.temp_min);
    // this.temp_max.set(this.data()?[0].main.temp_max);
    // this.pressure.set(this.data()?[0].main.pressure);
    // this.humidity.set(this.data()?[0].main.humidity);
    // this.visibility.set(this.data()?[0].visibility);
    // this.wind_speed.set(this.data()?[0].wind.speed);
    // this.wind_deg.set(this.data()?[0].wind.deg);
    // this.rain.set(this.data()?[0].rain?.['1h']);
    // this.clouds.set(this.data()?[0].clouds.all);
    // this.sys_type.set(this.data()?[0].sys.type);
    // this.sys_id.set(this.data()?[0].sys.type);
    // this.sys_country.set(this.data()?[0].sys.country);
  }

  // convert unix to time
  convertUnix(unix: number): string {
    let date = new Date(unix * 1000);
    let res = date.toUTCString();
    return res;
  }

  // fetch weather data, units: standard, metric, imperial
  // fetchWeatherData(lat: number, lon: number, units: string, lang: string) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.http.get(`${weatherApi}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`)
  //         .subscribe((dataIn: any) => {
  //           this.data.set([dataIn]);
  //           console.log(this.data());
  //           this.extractData();
  //           resolve(dataIn);
  //           this.msgService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully Retrieved' });
  //         })
  //     } catch (error) {
  //       reject(error);
  //       this.msgService.add({ severity: 'warn', summary: 'Error', detail: 'Error Retrieving Data' });
  //     }
  //   })
  // };

  fetchWeatherData(lat: number, lon: number, units: string, lang: string) {
    const _self = this;
    this.http.get(`${weatherApi}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`)
    .subscribe({
      next(dataIn : any) {
        _self.data.set([dataIn]);
        console.log(_self.data());
        _self.extractData();
        _self.msgService.add({ severity: 'success', summary: 'Success Retrieving Weather Data', detail: 'Data Successfully Retrieved' });
      },error(err : any) {
        console.log(err);
        _self.msgService.add({ severity: 'warn', summary: 'Error Retrieving Weather Data', detail: err.message });
      }
    });
  }

  // city only
  fetchDirectGeocode(langCode: string, cityName?: string) {
    const _self = this;
    _self.showGeocodeList = false;
    this.http.get(`${directGeocodingApi}${cityName}&limit=3&appid=${apiKey}`)
      .subscribe({
        next(dataIn: any) {
          _self.directGeocodeList.set([]);
          console.log('Location Data Successfully Retrieved', dataIn);
          _self.msgService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Retrieved Direct Geocode' });
          dataIn.forEach((obj: any) => {
            let res : directGeocodeObj;
            if(obj.local_names){
              res = {
                name: obj.name,
                local_name: obj.local_names[langCode],
                lat: obj.lat,
                lon: obj.lon,
                country: obj.country,
                state: obj.state,
              };
            }else{
              res = {
                name: obj.name,
                lat: obj.lat,
                lon: obj.lon,
                country: obj.country,
                state: obj.state,
              };
            }
            _self.directGeocodeList.update((list : any) => [...list, res]);
            if(_self.directGeocodeList &&  _self.directGeocodeList()!.length > 1){
              _self.showGeocodeList = true;
            } // else call get weather data for the only value in the list straight away
            console.log('showgeocodelist', _self.showGeocodeList);
          });
          console.log(_self.directGeocodeList());
        }, error(err: any) {
          console.log('Error retrieving location', err);
          _self.msgService.add({ severity: 'warn', summary: 'Error', detail: 'Error Retrieving Direct Geocode' });
        },
      })
  };

  fetchReverseGeocode(lat: string, lon: string) {
    const _self = this;
    this.http.get(`${reverseGeocodingApi}lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
      .subscribe({
        next(dataIn: any) {
          console.log('Location Data Successfully Retrieved', dataIn);
          _self.msgService.add({ severity: 'success', summary: 'Success', detail: 'Data Successfully Retrieved' });
        }, error(err) {
          console.log('Error retrieving location', err);
          _self.msgService.add({ severity: 'warn', summary: 'Error', detail: 'Error Retrieving Location Data' });
        },
      })
  };
}