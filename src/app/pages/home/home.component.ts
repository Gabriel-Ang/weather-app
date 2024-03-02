import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// primeng
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

// services
import { DataService } from '../../services/data.service';

// components
import { WeatherComponent } from '../../components/weather/weather.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    DividerModule,
    WeatherComponent,
    MessagesModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  dataService = inject(DataService)
  constructor() {}
}
