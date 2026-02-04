import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Form } from './form/form';
import { List } from './list/list';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,Form, List],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bestellen');
}
