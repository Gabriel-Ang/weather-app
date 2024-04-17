import { Routes } from '@angular/router'

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import("./layout/main-layout").then(m => m.MainLayoutComponent),
        children:[
            {
                path: 'weather',
                pathMatch: 'full',
                loadComponent: () => import("./components/weather/weather.component").then(m => m.WeatherComponent) 
            }
        ]
    }
];