import { Component, OnInit, computed } from '@angular/core';
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// services
import { DataService, weatherData } from '../../services/data.service';

// primeng
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    ButtonModule,
    InputTextModule,
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
  // time = this.dataService.time();

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.dataService.fetchWeatherData(1.3477394782902952, 103.74652122700614, 'metric', 'eng');
    this.data.set(this.dataService.data()[0]);
    console.log('hello');
  }

  toggleDivider(){
    this.dividerFlag.set(!this.dividerFlag());

    if(this.dividerIcon() === 'pi pi-angle-down'){
      this.dividerIcon.set('pi pi-angle-up');
    }else{
      this.dividerIcon.set('pi pi-angle-down');
    }
  }

  // stopBubbling(event : Event, op : any){
  //   event.stopPropagation();
  //   op.toggle(event);
  // }
}
