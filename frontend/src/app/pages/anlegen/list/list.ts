import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Artikel } from '../../bestellen/models/artikel.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List implements OnInit {
  private artikelSubject = new BehaviorSubject<Artikel[]>([]);
  artikel$ = this.artikelSubject.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Artikel[]>('/api/artikel').subscribe((data) => {
      this.artikelSubject.next(data);
    });
  }
}
