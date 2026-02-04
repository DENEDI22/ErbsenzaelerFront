import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
})
export class List implements OnInit {
  artikel: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchArtikel();
  }

  fetchArtikel(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:3000/artikel').subscribe({
      next: (data) => {
        console.log('Artikel vom Backend:', data);
        this.artikel = data ?? [];
      },
      error: (err) => {
        console.error('Fehler beim Laden der Artikel:', err);
        this.artikel = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
