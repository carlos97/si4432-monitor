import { Component } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'si4432-monitor';

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
    AOS.init();
  }
}
