import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'millionaire';
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: 'questioner' },
      {label: 'About', icon: 'pi pi-fw pi-question-circle', routerLink: 'about'}
    ];
  }
}
