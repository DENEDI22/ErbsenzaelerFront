import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Form } from './form/form';

@Component({
  selector: 'app-anlegen',
  imports: [RouterLink, Form],
  templateUrl: './anlegen.html',
  styleUrl: './anlegen.css',
})
export class Anlegen {
  
}
