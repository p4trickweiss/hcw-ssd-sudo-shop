# Sudo-Shop

Fiktiver Labubu-Shop und Lernplattform für Websicherheit. SvelteKit 3, Svelte 5, TypeScript und PostgreSQL. Die vorhandene Projektstruktur bleibt bestehen. Buttons und Eingaben basieren auf shadcn-svelte, gestaltet mit Tailwind 4 und lokalem CSS. Keine echten Zahlungen, Lieferungen oder externen Dienste.

## Alles mit einem Docker-Befehl starten

Im Projektverzeichnis genügt:

```sh
docker compose up --build -d --wait
```

Shop: http://127.0.0.1:4173

Der Befehl baut und startet **Shop und PostgreSQL**. Die Anwendung wartet auf die gesunde Datenbank und legt beim allerersten Start automatisch Schema, Testkonten, Produkte und zufällige Flags an. Ein weiterer Start erhält vorhandene Bestellungen und Fortschritte. Auf dem Host sind dafür weder Node noch pnpm oder eine `.env` erforderlich.

```sh
docker compose logs -f app       # Logs
docker compose down             # Alles stoppen, Daten bleiben erhalten
docker compose exec app ./scripts/reset.sh  # Alle Testdaten zurücksetzen
```

PostgreSQL-Daten und lokale Flags bleiben in den benannten Volumes `postgres_data` und `flags_data` erhalten. Ein Reset löscht Sitzungen, Bestellungen und Challenge-Fortschritt. Danach neu anmelden. Die App läuft im Container als Benutzer `node`.

## Svelte lokal entwickeln, PostgreSQL in Docker

Für lokale Codeänderungen kann Svelte mit automatischem Neuladen gestartet werden. Die bestehende Docker-Datenbank wird weiterverwendet:

```sh
docker compose stop app
docker compose up -d db
pnpm dev
```

`pnpm dev` lädt die lokale `.env` und startet auf http://127.0.0.1:4173.

## Testkonten

| Benutzer | Passwort  | Fiktives Guthaben nach Reset |
| -------- | --------- | ---------------------------- |
| alice    | labubu123 | 100,00 €                     |
| bob      | labubu123 | 20,00 €                      |

## Start, Stop, Reset

- Start / Neubau: `docker compose up --build -d --wait`.
- Stop: `docker compose down` (Daten bleiben in den Volumes).
- Reset: `docker compose exec app ./scripts/reset.sh`. Setzt alle Testkonten, Guthaben, Produkte, Sessions, Gutscheine, Bestellungen, Leaks und Lösungen zurück. Danach neu anmelden.
- Ausgangszustand: sechs Produkte, drei Beispielbestellungen (Admin, Bob, Alice), Code `LABUBU20` und leere Warenkörbe. Bob startet mit 20 €, Alice mit 100 €.
- Flags werden automatisch unter `/app/local/flags.sql` im Container erzeugt und im Volume `flags_data` gespeichert. Weitere Starts und Resets verwenden dieselben Flags.

## Funktionen und Aufbau

| Bereich         | Dateien / Routen                         | Aufgabe                                                              |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Katalog / Suche | `/products`, `/products/[id]`, `/search` | Sechs Figuren, lokale SVGs, Filter, Details, Suche                   |
| Anmeldung       | `/login`, `/logout`, `hooks.server.ts`   | Serverseitige Sessions mit zufälligem Cookie, Login-/Flag-Rate-Limit |
| Einkauf         | `/cart`, `/checkout`                     | Mengen ändern, entfernen, Gutschein, serverseitige Cent-Berechnung   |
| Bestellungen    | `/orders`, `/orders/[id]`                | Eigene Liste, Preis-Snapshots, simulierte Zahlung, Bestellnotiz      |
| Lernplattform   | `/challenges`                            | Drei Aufgaben, CWE-/CVE-Quellen, Hinweise, Flag-Prüfung, Fortschritt |
| Datenbank       | `db/schema.sql`, `db/testdaten.sql`      | Kleine SQL-Tabellen, parametrisierte Queries mit `pg`                |
| Reset           | `scripts/reset.ts`                       | Schema, Testdaten, Passwort-Hashes und lokale Flags                  |

Server-Load-Funktionen lesen Daten. Form-Actions schreiben Daten und leiten nach erfolgreichem Checkout weiter. Es gibt kein globales Client-State-Management. Warenkörbe gehören zum angemeldeten Testkonto und bleiben auch nach erneutem Login erhalten. Bestellungen, Preis-Snapshots, Rabattpositionen, Guthaben und das Leeren des Warenkorbs werden zusammen in einer Transaktion gespeichert.

Preise bleiben ganzzahlige Cent. Mengen sind auf ganze Zahlen von 1 bis 99 begrenzt und zusätzlich durch einen DB-Constraint gesichert. Vom Client übermittelte Preise werden nicht verwendet. Es gibt kein Lager- oder Zahlungssystem.

## Challenges und sichere Variante

Spielbare Steckbriefe stehen unter `/challenges`. C1 ist A01:2025 / CWE-639, C2 A05:2025 / CWE-79, C3 A06:2025 / CWE-841 (ergänzend CWE-799). Die CWE-/CVE-Links stehen direkt an den Aufgaben. C1 und C2 sind didaktische Nachbildungen, C3 ist eine eigene Umsetzung.

`SECURE_MODE=false` ist der Standard mit drei dokumentierten Schwachstellen. Für die sichere Variante:

```sh
SECURE_MODE=true docker compose up -d --wait
```

Zurück zum Challenge-Modus: `SECURE_MODE=false docker compose up -d --wait`. Optional kann der Wert in einer `.env` gespeichert werden (siehe `.env.example`).

- C1 prüft in der Detailquery zusätzlich `user_id`; fremde IDs liefern 404.
- C2 gibt den Suchbegriff als Text aus; die CSP erlaubt dort keine Inline-Event-Handler mehr.
- C3 verhindert denselben Code ein zweites Mal. Checkout prüft zusätzlich bereits gespeicherte doppelte Codes.
