import { Component, OnInit, computed } from '@angular/core';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// services
import { DataService, weatherData, directGeocodeObj } from '../../services/data.service';

// primeng
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ListboxModule } from 'primeng/listbox';

// rxjs
import { interval } from 'rxjs';

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    MessagesModule,
    ListboxModule,
    ToastModule,
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  constructor(private http: HttpClient, private msgService: MessageService) {}

  dataService = inject(DataService);
  data = computed(() => this.dataService.data());
  dividerFlag = signal<boolean>(false);
  dividerIcon = signal<string>('pi pi-angle-down');
  timeNow = signal<any>(''); // current time, on 1 second
  langList: Language[] = [];
  selectedLang: Language = { name: 'English', code: 'EN' };
  inputText : string = ''; // city/postcode input weather-input-text
  listboxVisible : boolean = false;
  selectedCity : any;

  citiesList = computed(() => {
    let arr : any = [];
    this.dataService.directGeocodeList().map((city : any) => {
      let res = {
        name: `${city.name}, ${city.country}`, code:`${city.lat}${city.lon}`
      };
      arr = [res, ...arr];
    })
    return arr;
  })

  ngOnInit() {
    this.getTimeNow();
    this.langList = [
      { name: 'English', code: 'EN' },
      { name: 'Chinese Simplified', code: 'CN' },
      { name: 'French', code: 'FR' },
      { name: 'Japanese', code: 'JP' },
      { name: 'Korean', code: 'KR' },
      { name: 'Spanish', code: 'ES' },
    ];
  };

  handleListBoxSubmit(){
    this.listboxVisible = false;
    const obj = this.dataService.directGeocodeList().find((obj : directGeocodeObj) => {
      let string = obj.lat.toString() + obj.lon.toString();
      if(string === this.selectedCity.code){
        return obj;
      }else{
        return undefined;
      }
    });
    this.dataService.fetchWeatherData(obj!.lat, obj!.lon,'metric',this.selectedLang.code.toLowerCase());
  }

  inputTextEnter(){
    // add langlist to api call as well if selectedLang.code !== 'EN'
    this.dataService.fetchDirectGeocode(this.inputText.toLowerCase(), this.selectedLang.code.toLowerCase());
    this.getData();
    this.inputText = '';
    // NOTIN SYNC , WHEN THIS EXECUTES THE LIST IS STILL EMPTY
    if(this.dataService.directGeocodeList().length > 1){
      this.listboxVisible = true;
      console.log('citiesList: ', this.citiesList());
    };
  }

  getData() {
  }

  toggleDivider() {
    this.dividerFlag.set(!this.dividerFlag());
    if (this.dividerIcon() === 'pi pi-angle-down') {
      this.dividerIcon.set('pi pi-angle-up');
    } else {
      this.dividerIcon.set('pi pi-angle-down');
    }
  }

  // rxjs interval to show live time
  getTimeNow() {
    let intervalObservable: any = interval(1000);
    intervalObservable.subscribe((int: any) => {
      const dateNow = Date.now();
      const today = new Date(dateNow);
      today.toDateString();
      this.timeNow.set(today);
    });
  }

  // stopBubbling(event : Event, op : any){
  //   event.stopPropagation();
  //   op.toggle(event);
  // }
}
