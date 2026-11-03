import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import News from "../models/newsModel";
import Analysis from "../models/analyzeModel";
import Comments from "../models/commentModel";
import Users from "../models/userModel";
import { makeSvg, ImageKind } from "./seedImages";

type Item = { slug: string; kind: ImageKind; title: string; text: string[]; views: number };

const news: Item[] = [
  { slug: "halving", kind: "bars", views: 412, title: "Bitcoin-Halving erklärt: Warum die Blockbelohnung regelmäßig sinkt",
    text: ["Alle 210.000 Blöcke halbiert sich die Belohnung, die Miner für einen neuen Block erhalten. Bei einer durchschnittlichen Blockzeit von zehn Minuten passiert das etwa alle vier Jahre.",
      "Das Ziel ist eine planbare, abnehmende Ausgabe neuer Coins. Die Gesamtmenge ist auf 21 Millionen begrenzt, der letzte Bruchteil wird erst um das Jahr 2140 geschürft.",
      "Wichtig: Ein Halving ist ein bekanntes Ereignis. Welche Wirkung es auf den Kurs hat, lässt sich nicht verlässlich vorhersagen, weil der Markt es lange vorher einpreist." ] },
  { slug: "blockchain-basics", kind: "chain", views: 388, title: "Was ist eine Blockchain? Die Grundlagen in fünf Minuten",
    text: ["Eine Blockchain ist eine Kette von Datenblöcken. Jeder Block enthält Transaktionen und den Hash des vorherigen Blocks. Wird ein alter Block verändert, passt die Kette nicht mehr zusammen.",
      "Viele Rechner (Nodes) halten eine Kopie und prüfen neue Blöcke nach denselben Regeln. Dadurch braucht es keine zentrale Stelle, der alle vertrauen müssen.",
      "Die Kehrseite: Transaktionen sind in der Regel endgültig. Wer eine falsche Adresse eingibt, bekommt sein Geld nicht zurück." ] },
  { slug: "stablecoins", kind: "coins", views: 301, title: "Stablecoins: Wie sie funktionieren und welche Risiken bleiben",
    text: ["Stablecoins sind an eine Referenzgröße gekoppelt, meist an den US-Dollar oder Euro. Es gibt drei Grundtypen: durch Bargeld und Anleihen gedeckte, durch Krypto überbesicherte und algorithmische Modelle.",
      "Gedeckte Stablecoins hängen davon ab, dass der Herausgeber die Reserven tatsächlich hält und Rücknahmen erfüllt. Prüfberichte und Regulierung sind deshalb entscheidend.",
      "Auch ein Stablecoin kann seine Bindung verlieren. Wer ihn als Parkplatz nutzt, sollte Herausgeber, Reserven und Börsenplatz prüfen." ] },
  { slug: "wallet-sicherheit", kind: "shield", views: 527, title: "Wallet-Sicherheit: Seed-Phrase, Hardware-Wallet und typische Fehler",
    text: ["Wer die Seed-Phrase kennt, kontrolliert das Guthaben. Sie gehört offline auf Papier oder Metall, niemals in Screenshots, Cloud-Notizen oder Chats.",
      "Hardware-Wallets halten die privaten Schlüssel auf einem getrennten Gerät. Signiert wird dort, am Rechner bestätigt man nur, was auf dem Display steht.",
      "Häufige Fehler: Phishing-Seiten mit täuschend echter Adresse, 'Support'-Nachrichten mit Fernwartung und das Signieren unbekannter Verträge. Kein seriöser Dienst fragt nach der Seed-Phrase." ] },
  { slug: "staking", kind: "rings", views: 246, title: "Staking verständlich: Erträge, Sperrfristen und Slashing",
    text: ["Bei Proof-of-Stake sichern Validatoren das Netzwerk, indem sie Coins hinterlegen. Dafür erhalten sie Belohnungen, die sich aus Netzwerkgebühren und neuer Ausgabe speisen.",
      "Der angegebene Ertrag ist keine Garantie. Er schwankt mit der Zahl der Teilnehmer, und der Kurs des Coins kann einen Ertrag leicht überlagern.",
      "Zu beachten sind Sperrfristen beim Auszahlen, Gebühren des Anbieters und Slashing: Verhält sich ein Validator fehlerhaft, kann ein Teil des Einsatzes einbehalten werden." ] },
  { slug: "defi", kind: "line", views: 219, title: "DeFi in der Übersicht: Börsen, Kredite und Smart Contracts",
    text: ["Dezentrale Finanzanwendungen laufen als Smart Contracts auf einer Blockchain. Nutzer tauschen Token über Liquiditätspools oder leihen und verleihen gegen Sicherheiten.",
      "Die Vorteile sind Offenheit und Transparenz, die Risiken liegen in Programmierfehlern, manipulierbaren Preisquellen und der Gefahr, bei starken Kursbewegungen liquidiert zu werden.",
      "Für Einsteiger gilt: Klein anfangen, Verträge nur nutzen, deren Code geprüft wurde, und nie Mittel einsetzen, die man kurzfristig braucht." ] },
  { slug: "marktkapitalisierung", kind: "candles", views: 334, title: "Marktkapitalisierung richtig lesen: Was die Zahl aussagt und was nicht",
    text: ["Die Marktkapitalisierung ist der Kurs multipliziert mit der umlaufenden Menge. Sie dient als Größenvergleich, nicht als Preis, den man für den gesamten Bestand erzielen könnte.",
      "Ein niedriger Kurs bedeutet nicht, dass ein Coin günstig ist. Entscheidend ist die Menge: Ein Coin mit Milliarden Einheiten kann trotz kleinem Kurs hoch bewertet sein.",
      "Ergänzend lohnt der Blick auf Handelsvolumen und Verteilung. Dünne Märkte lassen sich leicht bewegen." ] },
  { slug: "steuern", kind: "document", views: 463, title: "Krypto und Steuern in Deutschland: Die wichtigsten Grundregeln",
    text: ["Private Veräußerungsgeschäfte mit Kryptowerten sind steuerpflichtig, wenn zwischen Kauf und Verkauf weniger als ein Jahr liegt. Nach einem Jahr Haltedauer sind Gewinne für Privatpersonen in der Regel steuerfrei.",
      "Auch das Tauschen von Coins und das Bezahlen mit Coins kann ein Verkauf sein. Wer handelt, sollte jede Transaktion mit Datum, Menge und Kurs festhalten.",
      "Dieser Text ist eine allgemeine Orientierung und keine Steuerberatung. Die Rechtslage ändert sich, im Zweifel hilft eine Steuerberatung." ] },
];

const analyses: Item[] = [
  { slug: "support-resistance", kind: "candles", views: 355, title: "Unterstützung und Widerstand: Zonen statt einzelner Linien",
    text: ["Unterstützung ist ein Preisbereich, in dem Käufer bisher häufig eingestiegen sind, Widerstand einer, in dem Verkäufer überwogen. Je öfter ein Bereich getestet wurde, desto beachteter ist er.",
      "Zeichne Zonen mit etwas Spielraum statt exakter Linien, denn Kurse reagieren selten auf den Cent genau. Hochs und Tiefs auf höheren Zeitebenen wiegen mehr als solche im Minutenchart.",
      "Wird ein Widerstand nachhaltig überschritten, wird er oft zur Unterstützung. Ein einzelner Docht über der Zone zählt dabei noch nicht als Ausbruch, ein Schlusskurs darüber eher." ] },
  { slug: "gleitende-durchschnitte", kind: "line", views: 298, title: "Gleitende Durchschnitte: SMA, EMA und ihre Grenzen",
    text: ["Ein gleitender Durchschnitt glättet den Kurs über eine feste Zahl von Kerzen. Der SMA gewichtet alle Werte gleich, der EMA gibt jüngeren Kursen mehr Gewicht und reagiert schneller.",
      "Üblich sind 20, 50 und 200 Perioden. Liegt der Kurs dauerhaft über dem 200er, spricht man von einem intakten Aufwärtstrend. Kreuzen sich zwei Durchschnitte, gilt das als Signal.",
      "Die Schwäche: Durchschnitte hinken hinterher. In Seitwärtsphasen erzeugen sie viele Fehlsignale. Sie beschreiben, was war, und sagen nicht, was kommt." ] },
  { slug: "rsi", kind: "bars", views: 276, title: "RSI richtig einsetzen: Überkauft ist nicht gleich Verkaufssignal",
    text: ["Der Relative-Stärke-Index misst auf einer Skala von 0 bis 100, wie stark Kursgewinne gegenüber Verlusten über meist 14 Perioden ausfallen. Werte über 70 gelten als überkauft, unter 30 als überverkauft.",
      "In starken Trends kann der RSI wochenlang im überkauften Bereich bleiben. Nützlicher sind oft Divergenzen: Der Kurs macht ein neues Hoch, der RSI nicht.",
      "Betrachte den RSI als Zusatzinformation neben Trend und Marktstruktur und nie als alleinigen Auslöser für eine Order." ] },
  { slug: "risikomanagement", kind: "shield", views: 410, title: "Positionsgröße und Stop-Loss: Das Risiko pro Trade begrenzen",
    text: ["Bestimme zuerst, wie viel du pro Trade maximal verlieren willst, etwa ein Prozent des Kapitals. Aus Einstieg und Stop-Loss ergibt sich dann die Positionsgröße.",
      "Beispiel: Bei 5.000 Euro Kapital und einem Prozent Risiko sind 50 Euro der Maximalverlust. Liegt der Stop zwei Prozent unter dem Einstieg, beträgt die Position 2.500 Euro.",
      "Das Chance-Risiko-Verhältnis sollte vor dem Einstieg feststehen. Wer Verluste klein hält, übersteht auch eine Serie von Fehlversuchen." ] },
  { slug: "volatilitaet", kind: "rings", views: 231, title: "Volatilität messen: ATR und Schwankungsbreite im Alltag",
    text: ["Die Average True Range gibt die durchschnittliche Spanne einer Kerze an, inklusive Kurslücken. Sie sagt nichts über die Richtung, nur über die Schwankungsbreite.",
      "Praktisch dient sie dazu, Stops an die Marktlage anzupassen: Ein Stop in doppelter ATR-Entfernung liegt außerhalb des üblichen Rauschens.",
      "Hohe Volatilität bedeutet größere Chancen und größere Risiken. Die Positionsgröße sollte entsprechend sinken." ] },
  { slug: "onchain", kind: "chain", views: 207, title: "On-Chain-Daten lesen: Aktive Adressen, Gebühren und Bestände",
    text: ["Weil Transaktionen öffentlich sind, lassen sich Kennzahlen direkt aus der Blockchain berechnen, etwa die Zahl aktiver Adressen, Transaktionsvolumen oder gezahlte Gebühren.",
      "Steigende Aktivität bei steigendem Kurs stützt einen Trend, ein Kursanstieg ohne Nutzung wirkt dagegen dünner. Bewegungen großer Bestände auf Börsen können auf Verkaufsabsicht hindeuten.",
      "Adressen sind nicht gleich Personen, eine Person kann viele nutzen. Die Daten sind ein Hinweis, kein Beweis." ] },
  { slug: "dominanz", kind: "coins", views: 188, title: "Bitcoin-Dominanz verstehen: Was der Anteil am Gesamtmarkt zeigt",
    text: ["Die Dominanz gibt an, welchen Anteil Bitcoin an der gesamten Marktkapitalisierung aller Kryptowerte hat. Steigt sie, fließt relativ mehr Kapital in Bitcoin.",
      "Fällt sie bei steigenden Kursen, spricht man von Phasen, in denen Alternativen stärker laufen. In Abschwüngen steigt sie oft, weil Anleger in den größten Wert umschichten.",
      "Beachte, dass Stablecoins den Wert verzerren: Wandert Kapital in Stablecoins, steigt die Dominanz rechnerisch, ohne dass jemand Bitcoin gekauft hat." ] },
  { slug: "trading-journal", kind: "document", views: 342, title: "Trading-Journal führen: Welche Angaben wirklich helfen",
    text: ["Ein Journal macht Entscheidungen überprüfbar. Notiere pro Trade Datum, Instrument, Einstieg, Stop, Ziel, Ergebnis und den Grund für den Einstieg.",
      "Wichtiger als die Zahlen ist die Auswertung: Welche Setups funktionieren, zu welcher Tageszeit, nach welcher Serie? Eine monatliche Durchsicht zeigt Muster, die man im Alltag übersieht.",
      "Halte auch fest, wann du von deinem Plan abgewichen bist. Meist liegt dort der größte Hebel." ] },
];

const run = async () => {
  const reset = process.argv.includes("--reset");
  const base = (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3005}`).replace(/\/$/, "");
  const dir = path.join(process.cwd(), "public", "uploads", "seed");
  fs.mkdirSync(dir, { recursive: true });

  await mongoose.connect(process.env.MONGODB_URL ?? "");
  const author =
    (await Users.findOne({ isAdmin: true })) ||
    (await Users.findOne({ canAnalyze: true })) ||
    (await Users.findOne());
  if (!author) throw new Error("Kein Benutzer vorhanden. Bitte zuerst ein Konto registrieren.");

  if (reset) {
    const n = await News.deleteMany({});
    const a = await Analysis.deleteMany({});
    await Comments.deleteMany({});
    console.log(`Gelöscht: ${n.deletedCount} News, ${a.deletedCount} Analysen`);
  }

  const save = async (model: any, prefix: string, items: Item[]) => {
    for (const it of items) {
      const file = `${prefix}-${it.slug}.svg`;
      fs.writeFileSync(path.join(dir, file), makeSvg(it.kind, `${prefix}-${it.slug}`));
      const image = `${base}/uploads/seed/${file}`;
      const exists = await model.findOne({ title: it.title });
      const doc = { title: it.title, description: it.text.join("\n\n"), image, user: author._id, numViews: 0 };
      if (exists) await model.updateOne({ _id: exists._id }, doc);
      else await model.create(doc);
    }
  };
  await save(News, "news", news);
  await save(Analysis, "analyse", analyses);
  console.log(`Fertig: ${news.length} News, ${analyses.length} Analysen, Autor ${author.get("email") ?? author._id}`);
  await mongoose.disconnect();
};

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
