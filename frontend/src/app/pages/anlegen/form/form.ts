import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css'],
})
export class Form {
  artikel = {
    name: '',
    messeinheit: '',
    preis: -1,
  };

  constructor(private http: HttpClient) {}

  addArtikel() {
    if (!this.artikel.name || !this.artikel.messeinheit || this.artikel.preis < 0) {
      alert('Bitte alle Felder korrekt ausfüllen!');
      return;
    }

    this.http.post<any>('/api/artikel', this.artikel).subscribe({
      next: (res) => {
        console.log('Antwort vom Backend:', res);

        if (res.message === 'Artikel existiert bereits') {
          alert(`Artikel existiert bereits!`);
        } else {
          alert(`Artikel erfolgreich hinzugefügt!`);
        }

        this.artikel = { name: '', messeinheit: '', preis: -1 };
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Hinzufügen des Artikels!');
      },
    });
  }
}
