import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageService } from 'primeng/api';
import moment from 'moment';

const weatherApi = environment.weatherApi;
const apiKey = environment.apiKey;
const directGeocodingApi = environment.directGeocodingApi;
const reverseGeocodingApi = environment.reverseGeocodingApi;
const forecastAPI = environment.forecastAPI;
const iconURL = 'https://openweathermap.org/img/wn/'

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

export interface mainData {
  label  : string;
  value : number;
  unit : string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http: HttpClient, private msgService: MessageService) { }

  // raw data (json)
  data = signal<weatherData[] | undefined>(undefined);
  forecastData = signal<any>('');
  dailyForecastData = signal<any>('');
  directGeocodeList = signal<directGeocodeObj[] | undefined>(undefined);
  directGeocode = signal<directGeocodeObj | undefined>(undefined);
  showGeocodeList : boolean = false;

  // user current location data
  userLon : number |  undefined = undefined;
  userLat : number | undefined = undefined;

  // extracted data
  cityName : string = '';
  // weather_id = signal<number | undefined>(undefined);
  // weather_main = signal<string>('');
  // weather_desc = signal<string>('');
  // weather_icon = signal<string>('');
  // temp = signal<number | undefined>(undefined);
  // feels_like = signal<number | undefined>(undefined);
  // temp_min = signal<number | undefined>(undefined);
  // temp_max = signal<number | undefined>(undefined);
  // pressure = signal<number | undefined>(undefined);
  // humidity = signal<number | undefined>(undefined);
  // visibility = signal<number | undefined>(undefined);
  // wind_speed = signal<number | undefined>(undefined);
  // wind_deg = signal<number | undefined>(undefined);
  // rain = signal<number | undefined>(undefined);
  // clouds = signal<number | undefined>(undefined);
  // dt_time = signal<string>(''); // unix converted to time
  // sys_type = signal<number | undefined>(undefined);
  // sys_id = signal<number | undefined>(undefined);
  // sys_country = signal<string>('');
  // sunrise_time = signal<string>(''); // unix converted to time
  // sunset_time = signal<string>(''); // unix converted to time
  // timezone = signal<number | undefined>(undefined)
  // id = signal<number | undefined>(undefined);
  // name = signal<string>('');

  weather_id : number | undefined = undefined;
  weather_main : string = '';
  weather_desc : string = '';
  weather_icon = signal<string>('');
  temp : number | undefined = undefined;
  feels_like : number | undefined = undefined;
  temp_min : number | undefined = undefined;
  temp_max : number | undefined = undefined;
  pressure : number | undefined = undefined;
  humidity : number | undefined = undefined;
  visibility : number | undefined = undefined;
  wind_speed : number | undefined = undefined;
  wind_deg : number | undefined = undefined;
  rain : number | undefined = undefined;
  clouds : number | undefined = undefined;
  dt_time : string = '';
  sys_type : number | undefined = undefined;
  sys_id : number | undefined = undefined;
  sys_country : string = '';
  sunrise_time : string = '';
  sunset_time : string = '';
  timezone : number | undefined = undefined;
  id : number | undefined = undefined;
  name : string = '';
  _iconUrl = computed<string>(() => `${iconURL}${this.weather_icon()}@2x.png`);
  mainData : mainData[] = [];

  extractData() {
    // this.dt_time.set(this.convertUnix(this.data()![0].dt))
    // this.sunrise_time.set(this.convertUnix(this.data()![0].sys.sunrise));
    // this.sunset_time.set(this.convertUnix(this.data()![0].sys.sunset));
    // this.weather_id.set(this.data()![0].weather[0].id);
    // this.weather_main.set(this.data()![0].weather[0].main);
    // this.weather_desc.set(this.data()![0].weather[0].description);
    // this.weather_icon.set(this.data()![0].weather[0].icon);
    // this.temp.set(this.data()![0].main.temp);
    // this.feels_like.set(this.data()![0].main.feels_like);
    // this.temp_min.set(this.data()![0].main.temp_min);
    // this.temp_max.set(this.data()![0].main.temp_max);
    // this.pressure.set(this.data()![0].main.pressure);
    // this.humidity.set(this.data()![0].main.humidity);
    // this.visibility.set(this.data()![0].visibility);
    // this.wind_speed.set(this.data()![0].wind.speed);
    // this.wind_deg.set(this.data()![0].wind.deg);
    // this.rain.set(this.data()![0].rain?.['1h']);
    // this.clouds.set(this.data()![0].clouds.all);
    // this.sys_type.set(this.data()![0].sys.type);
    // this.sys_id.set(this.data()![0].sys.type);
    // this.sys_country.set(this.data()![0].sys.country);

    this.dt_time = this.convertUnix(this.data()![0].dt);
    this.sunrise_time = this.convertUnix(this.data()![0].sys.sunrise);
    this.sunset_time = this.convertUnix(this.data()![0].sys.sunset);
    this.weather_id = this.data()![0].weather[0].id;
    this.weather_main = this.data()![0].weather[0].main;
    this.weather_desc = this.data()![0].weather[0].description;
    this.weather_icon.set(this.data()![0].weather[0].icon);
    this.temp = this.data()![0].main.temp;
    this.feels_like = this.data()![0].main.feels_like;
    this.temp_min = this.data()![0].main.temp_min;
    this.temp_max = this.data()![0].main.temp_max;
    this.pressure = this.data()![0].main.pressure;
    this.humidity = this.data()![0].main.humidity;
    this.visibility = this.data()![0].visibility;
    this.wind_speed = this.data()![0].wind.speed;
    this.wind_deg = this.data()![0].wind.deg;
    this.rain = this.data()![0].rain?.['1h'];
    this.clouds = this.data()![0].clouds.all;
    this.sys_type = this.data()![0].sys.type;
    this.sys_id = this.data()![0].sys.type;
    this.sys_country = this.data()![0].sys.country;
    this.name = this.data()![0].name;

    this.mainData = [
      {
        label : 'Temperature',
        value : this.temp,
        unit : '&#8451;'
      },
      {
        label : 'Feels Like',
        value : this.feels_like,
        unit : '&#8451;'
      },
      {
        label : 'Humidity',
        value : this.humidity,
        unit : '%'
      },
      {
        label : 'Wind Speed',
        value : this.wind_speed,
        unit : 'km/h'
      },
    ]
  }

  // convert unix to time
  convertUnix(unix: number): string {
    let date = new Date(unix * 1000);
    let res = date.toUTCString();
    return res;
  }

  fetchWeatherData(lat: number, lon: number, units: string, lang: string) {
    const _self = this;
    this.http.get(`${weatherApi}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}&lang=${lang}`)
    .subscribe({
      next(dataIn : any) {
        _self.data.set([dataIn]);
        _self.extractData();
        // _self.msgService.add({ severity: 'success', summary: 'Success Retrieving Weather Data', detail: 'Data Successfully Retrieved' });
      },error(err : any) {
        console.log(err);
        // _self.msgService.add({ severity: 'warn', summary: 'Error Retrieving Weather Data', detail: err.message });
      }
    });
  }

  fetchForecastData(lat: number, lon: number){
    const _self = this;
    this.http.get(`${forecastAPI}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .subscribe({
      next(dataIn : any) {
        _self.forecastData.set(dataIn.list);
        let res = dataIn.list.filter((data : any) => data.dt_txt.includes('00:00:00'));
        let _res = res.map((data : any) => {
          let dateWithoutTime = data.dt_txt.split(" ")[0];
          let date = moment(dateWithoutTime);
          data.dt_txt = date.format('dddd');
        });
        _self.dailyForecastData.set(res);
        console.log('daily forecast data: ', _self.dailyForecastData() );
      }, error(err : any) {
        _self.msgService.add({ severity: 'warn', summary: 'Error Retrieving Forecast Data', detail: err.message });
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
            _self.directGeocode.set(res);
          });
          _self.cityName = _self.directGeocodeList()![0]?.name;
          _self.fetchWeatherData(_self.directGeocodeList()![0]?.lat, _self.directGeocodeList()![0]?.lon, 'metric', langCode);
          _self.fetchForecastData(_self.directGeocodeList()![0]?.lat, _self.directGeocodeList()![0]?.lon);
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

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        this.userLon = pos.coords.longitude;
        this.userLat = pos.coords.latitude;
      });
      this.fetchWeatherData(this.userLon!, this.userLat!, 'metric', 'en');
    }
  }

  setIconUrl(icon : string){
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}