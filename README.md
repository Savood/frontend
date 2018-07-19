# Savood
## save the food and the world

Savood (**Sa**ve f **ood**) hat das Ziel die Welt durch eine Verringerung der Essensverschwendung zu verbessern.
Jährlich werden [mehr als 18 Millionen Tonnen genießbares Essen verschwendet - allein in Deutschland](https://mobil.wwf.de/themen-projekte/landwirtschaft/ernaehrung-konsum/lebensmittelverschwendung-bundeslaender-im-vergleich/).  
Als dualer Student lässt sich aus Erfahrung sagen, dass auch Studenten daran nicht unbeteiligt sind.
Bei ständigen Umzügen bleibt einiges an Essen auf der Strecke, sei es weil es vergessen wurde oder weil es einfach nicht transportiert werden kann.

**Doch damit ist nun Schluss!**

**Savood** ist perfekt auf Studenten zugeschnitten und bietet ihnen die Möglichkeit schnell und unkompliziert Essen abzugeben, welches sonst weggeworfen werden würde.

## Was ist Savood?

**Savood** ist eine mit Ionic enteickelte App, die sowohl im Web als auch auf Android und iOS genutzt werden kann.
Sie bietet jedem die Möglichkeit Essen abzugeben, welches sonst im Müll landen würde.
Hierzu bieten sich vier Seiten, die auf diese einzigartige Weise nur in **Savood** zusammenfinden.

* **Savoods** - Eine Übersicht alles zu rettenden Essens und die Möglichkeit eigenes anzubieten
* **Rettungskarte** - Eine Karte um die nächszen Savoods schnell zu finden
* **Chats** - Der beste Weg um mit anderen Rettern zu kommunizieren
* **Account** - Personalisierung von allen Bestandteilen, die dich zum Retter machen

## Wie startet man Savood?

Einfach die APK [hier]() herunterladen und los savooden

Zum Testen im Browser, einfach dieses Repository herunterladen, in den Ordner gehen und `npm i` und `ionic serve` ausführen!


## Viel Spaß beim Welt retten

# Weitere Informationen für Dozenten die dieses Projekt potenziell bewerten

Diese App verwendet **i18n** um sowohl in **deutscher Sprache** als auch in **Englisch** und **Esperanto** ein angemessenes Nutzungserlebnis zu bieten.
Eine solche Maßnahme ist für eine geplante Globalisierung der App von großer Bedeutung.

## Komponenten

Die einzelnen Komponenten (Seiten bzw. Unterseiten) finden sich in dem Ordner `src/pages`.  
Hierzu gehören:

* **chats** - Die "Nachrichten"-Seite, mit Hilfe derer die Kommunikation mit den anderen Savoodern möglich ist.
* **chat-overview** - Eine Übersicht über alle Chats, die sich in zwei Formen darstellen lässt:
  * **Savoods** - Ein nach Savoods sortierter Überblick, der savoodspezifische Chats gruppiert
  * **Chats** - Alle Chats einzeln, um die schnelle Kontaktaufnahme zu bestimmten Savoodern zu ermöglichen
* **create-offering** - Die Seite auf der neue Angebote mit allen notwendigen Angaben erstellt werden können
* **forgot-password** - Das Zurücksetzen des Passwortes, falls man seine Logindaten vergessen hat
* **login** - Die Startseite der App und das Login
* **offering-detail** - Eine detaillierte Ansicht eines Angebotes, die alle Kerndaten zusammenfasst und anzeigt
* **offering-map** - Eine Karte auf der alle Savoods in der Nähe angezeigt sind um 
* **offeringlist** - Eine Liste die alle relevanten Offerings in zwei Ansichten darstellt:
  * **Eigene Savoods** - Alle Savoods die vom Savooder selbst erstellt wurden
  * **Angefragte Savoods** - Alle Savoods die vom Savooder angefragt wurden
* **offerings** - Eine Liste aller Angebote aus der Nähe
* **settings** - Die Einstellungs und Profil Seite, welche auf für fremde Profile "wiederverwende" wird und mehrere Unetrseiten besitzt
* **signup** - Die Seite um sich für die Weltrettung zu registrieren
* **tabs** - Das Hauptnavigationsmenü der App, mehrere Tabs am unteren Rand die das Aufrufen der vier Hauptseiten ermöglichen
* **web-upload** - Eine Seite um das Hochladen von Bildern im Profil zu ermöglichen
* **welcome** - Die Willkommensslides nach dem ersten Login, um erweiterte Nutzerdaten anzugeben
	
## Services

Die Seiten werden in ihrer Logik durch Services unterstützt.
Die Services sind im Ordner `src/providers` zu finden.
Sie teilen sich auf in `api`, `auth` und `maps`.

#### API

Jegliche Kommunikation mit dem "normalen" Backend wird über diese Klassen vorgenommen.
Die API ist in die Klassen `messages`, `offerings` und `user` aufgeteilt.
Durch sie wird die Kommunikation mit den verschiedenen Endpunkten durchgeführt.
Für weitere Informationen zur Funktion der Services sind findet sich im Code eine ausführliche Dokumentation.

#### Auth

Da die Authentifizierung über einen erweiterten Service stattfindet, besteht hierfür ein eigenes System.
Dieses teilt sich auf in die Klassen `auth` und `auth_interceptor`.  
Der `auth`-Service wird für die allgemeine Registrierung und das Login verwendet.  
Der `auth_interceptor` dient zur Überprüfung des Logins beim Aufruf der einzelnen Seiten und blockiert gegebenenfalls die Anfragen.

#### Maps

Da die Lokation der Savoods eine besondere Rolle für eine gute Usability spielt, werden die Kontrollen für alle Kartenanfragen in ein eigenes System gruppiert.
Dieses teilt sich in die Hauptklasse `maps` und die Unterklassen `jsMaps` und `nativeMaps`auf.
Alle Anfragen der einzelnen Seiten greifen auf den `MapsService` zu. 
Dieser fasst die Inhalte der anderen beiden Klassen zusammen und lässt die Applikation, je nach Plattform, mit unterschiedlichen APIs arbeiten.
Diese plattformspezifischen APIs finden sich in den beiden Unterklassen wieder.
Für weitere Informationen zur Funktion des MapsServices sind findet sich im Code eine ausführliche Dokumentation.