import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Form } from './form/form';
import { List } from './list/list';

@Component({
  selector: 'app-anlegen',
  imports: [RouterLink, Form, List],
  templateUrl: './anlegen.html',
  styleUrl: './anlegen.css',
})
export class Anlegen {}
