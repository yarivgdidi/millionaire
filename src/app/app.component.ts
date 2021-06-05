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

  ngOnInit() {
    this.items = [
      {label: 'Home', icon: 'pi pi-fw pi-home'}
    ];
  }
}
