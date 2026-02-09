import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { List } from './list/list';
import { Form } from './form/form';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,List, Form],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bestellen');
}
