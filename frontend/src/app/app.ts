import { Component, signal } from '@angular/core';
import { List } from './list/list';
import { Form } from './form/form';


@Component({
  selector: 'app-root',
  imports: [List, Form],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bestellen');
}
