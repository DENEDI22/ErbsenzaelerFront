import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Artikel } from '../models/artikel.model';
import { BestellService } from '../services/bestell.service';

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
  bestellService = inject(BestellService);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Artikel[]>('http://localhost:3000/artikel').subscribe((data) => {
      this.artikelSubject.next(data);
      this.bestellService.init(data);
    });
  }

  erhoeheMenge(artikel: Artikel) {
    this.bestellService.erhoeheMenge(artikel);
  }

  verringerMenge(artikel: Artikel) {
    this.bestellService.verringerMenge(artikel);
  }
}
