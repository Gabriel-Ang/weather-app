import { Component, OnInit, computed } from '@angular/core';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// services
import { DataService, weatherData } from '../../services/data.service';

// primeng
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

// rxjs
import { interval } from 'rxjs';

interface Language{
  name: string,
  code: string
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
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit{

  constructor(private http : HttpClient) {}

  dataService = inject(DataService);
  data = signal<weatherData|null>(null);
  dividerFlag = signal<boolean>(false);
  dividerIcon = signal<string>('pi pi-angle-down');
  timeNow = signal<any>('');
  langList : Language[] = [];
  selectedLang : Language = {name: 'English', code: 'EN'};

  ngOnInit() {
    this.getData();
    this.getTimeNow();
    this.langList = [
      {name: 'English', code: 'EN'},
      {name: 'Chinese Simplified', code: 'CN'},
      {name: 'French', code: 'FR'},
      {name: 'Japanese', code: 'JP'},
      {name: 'Korean', code: 'KR'},
      {name: 'Spanish', code: 'ES'},
    ]
  }

  getData(){
    this.dataService.fetchWeatherData(1.3477394782902952, 103.74652122700614, 'metric', 'eng');
    this.data.set(this.dataService.data()[0]);
  }

  toggleDivider(){
    this.dividerFlag.set(!this.dividerFlag());
    if(this.dividerIcon() === 'pi pi-angle-down'){
      this.dividerIcon.set('pi pi-angle-up');
    }else{
      this.dividerIcon.set('pi pi-angle-down');
    }
  }

  // rxjs interval to show live time
  getTimeNow(){
    let intervalObservable : any = interval(1000);
    intervalObservable.subscribe((int : any) => {
      const dateNow = Date.now();
      const today = new Date(dateNow);
      today.toDateString();
      this.timeNow.set(today);
    })
  }

  // stopBubbling(event : Event, op : any){
  //   event.stopPropagation();
  //   op.toggle(event);
  // }
}
