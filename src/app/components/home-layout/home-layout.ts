import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.html',
  styleUrls: ['./home-layout.css'],
  imports: [RouterLink], // Importante para que funcionen los enlaces
  standalone: true
})
export class HomeLayout {
}
