import { Injectable } from '@angular/core';
import { Artikel } from '../models/artikel.model';

@Injectable({
  providedIn: 'root',
})
export class BestellService {
  public gesamtpreis = 0;
  artikel: Artikel[] = [];

  init(artikel: Artikel[]) {
    this.artikel = artikel;
  }

  erhoeheMenge(artikel: Artikel) {
    const found = this.artikel.find((a) => a.nr === artikel.nr);
    if (!found) return;

    found.bestellt = (found.bestellt ?? 0) + 1;
    this.berechneGesamtpreis();
  }

  verringerMenge(artikel: Artikel) {
    const found = this.artikel.find((a) => a.nr === artikel.nr);
    if (!found) return;

    found.bestellt = Math.max((found.bestellt ?? 0) - 1, 0);
    this.berechneGesamtpreis();
  }

  berechneGesamtpreis() {
    this.gesamtpreis = this.artikel.reduce((sum, a) => sum + a.preis * (a.bestellt ?? 0), 0);
  }
}
