import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Artikel } from '../models/bestellung.model';
import { BestellService } from '../services/bestell.service';
import { Kunde } from '../models/kunde.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  bestellService = inject(BestellService);
  private http = inject(HttpClient);

  kunde: Kunde = {
    vorname: '',
    nachname: '',
    strasse: '',
    hausnr: '',
    plz: '',
    ort: '',
  };

  submitOrder() {
    const bestellteArtikel: Artikel[] = this.bestellService.artikel.filter(
      (a) => (a.menge ?? 0) > 0,
    );

    if (
      [
        this.kunde.vorname,
        this.kunde.nachname,
        this.kunde.strasse,
        this.kunde.hausnr,
        this.kunde.plz,
        this.kunde.ort,
      ].some((field) => field === undefined || field === null || String(field).trim() === '')
    ) {
      alert('Bitte alle Felder des Formulars ausfüllen!');
      return;
    }

    if (bestellteArtikel.length === 0) {
      alert('Bitte wähle mindestens einen Artikel aus!');
      return;
    }

    const gesamtpreis = bestellteArtikel.reduce((sum, a) => sum + a.preis * (a.menge ?? 0), 0);

    const bestellung = {
      kunde: {
        vorname: this.kunde.vorname,
        nachname: this.kunde.nachname,
        strasse: this.kunde.strasse,
        hausnr: this.kunde.hausnr,
        plz: this.kunde.plz,
        ort: this.kunde.ort,
      },
      artikel: bestellteArtikel.map((a) => ({
        artikelnr: a.id,
        menge: a.menge,
        preis: a.preis,
      })),
      gesamtpreis,
    };

    this.http.post<any>('http://localhost:3000/bestellung', bestellung).subscribe({
      next: (res) => {
        console.log('Antwort vom Backend:', res);

        alert(`Bestellung erfolgreich!\nKundennr: ${res.kundennr}\nBestellnr: ${res.bestellnr}`);

        this.bestellService.init(this.bestellService.artikel.map((a) => ({ ...a, menge: 0 })));

        this.kunde = {
          vorname: '',
          nachname: '',
          strasse: '',
          hausnr: '',
          plz: '',
          ort: '',
        };

        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Absenden der Bestellung!');
      },
    });
  }
}
