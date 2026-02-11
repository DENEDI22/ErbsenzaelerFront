import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Artikel } from '../models/artikel.model';
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
      (a) => (a.bestellt ?? 0) > 0,
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

    if (isNaN(Number(this.kunde.hausnr)) || isNaN(Number(this.kunde.plz))) {
      alert('Hausnummer und PLZ müssen gültige Zahlen sein!');
      return;
    }

    if (bestellteArtikel.length === 0) {
      alert('Bitte wähle mindestens einen Artikel aus!');
      return;
    }

    const gesamtpreis = bestellteArtikel.reduce((sum, a) => sum + a.preis * (a.bestellt ?? 0), 0);

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
        artikelnr: a.nr,
        menge: a.bestellt,
        preis: a.preis,
      })),
      gesamtpreis,
    };

    this.http.post<any>('/api/bestellung', bestellung).subscribe({
      next: (res) => {
        console.log('Antwort vom Backend:', res);

        if (res.message === 'Kunde existiert bereits') {
          alert(`Kunde existiert bereits!\nKundennr: ${res.kundennr}`);
        } else if (res.message === 'Kunde neu angelegt') {
          alert(`Kunde neu angelegt!\nKundennr: ${res.kundennr}`);
        }

        this.bestellService.init(this.bestellService.artikel.map((a) => ({ ...a, bestellt: 0 })));

        this.kunde = {
          vorname: '',
          nachname: '',
          strasse: '',
          hausnr: '',
          plz: '',
          ort: '',
        };

        if (res.message === 'Bestellung erfolgreich') {
          alert('Bestellung erfolgreich!');
        } else {
          alert('Bestellung fehlgeschlagen!');
        }

        this.sleep(5000);
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Absenden der Bestellung!');
      },
    });
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
