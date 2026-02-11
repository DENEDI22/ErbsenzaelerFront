import { Component } from '@angular/core';
import { Form } from "./form/form";
import { List } from "./list/list";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bestellen',
  imports: [Form, List, RouterLink],
  templateUrl: './bestellen.html',
  styleUrl: './bestellen.css',
})
export class Bestellen {

}
