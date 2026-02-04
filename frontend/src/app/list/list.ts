import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List implements OnInit {
  artikel$!: Observable<any[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.artikel$ = this.http.get<any[]>('http://localhost:3000/artikel');
  }
}
