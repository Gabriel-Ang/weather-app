// Angular
import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// PrimeNg
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
// Rxjs
import { interval } from 'rxjs';
// Services
import { DataService } from '../../services/data.service';

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  dataService = inject(DataService);
  timeNow = signal<any>(''); // current time, on 1 second
  selectedLang: Language = { name: 'English', code: 'EN' };
  inputText : string = '';
  langList : any = [
    { name: 'English', code: 'EN' },
    { name: 'Chinese Simplified', code: 'CN' },
    { name: 'French', code: 'FR' },
    { name: 'Japanese', code: 'JP' },
    { name: 'Korean', code: 'KR' },
    { name: 'Spanish', code: 'ES' },
  ];
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
  };

  inputTextEnter(event : Event){
    // add langlist to api call as well if selectedLang.code !== 'EN'
    this.dataService.fetchDirectGeocode(this.inputText.toLowerCase(), this.selectedLang.code.toLowerCase());
    this.inputText = '';
    // NOTIN SYNC , WHEN THIS EXECUTES THE LIST IS STILL EMPTY
    if(this.dataService.directGeocodeList().length > 1){
      // this.listboxVisible = true;
      // this.dialogVisible = true;
      // this.confirm(event);
      console.log('citiesList: ', this.citiesList());
    };
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
}
