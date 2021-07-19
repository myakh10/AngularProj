import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
      <div class="container">
        <p class="small"> Made by Mohamed Yaniss Akhrib </p>
      </div>
  `,
  styles: [`
    .container{
      height: 100;
    }
  `]
})
export class FooterComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
