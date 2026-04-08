// ============================================
// GOOGLE APPS SCRIPT — vložit do spreadsheet
// Extensions → Apps Script → Code.gs
// ============================================
// Po vložení: Deploy → New deployment → Web app
// Execute as: Me, Who has access: Anyone
// Zkopíruj URL a vlož do index.html místo 'GOOGLE_APPS_SCRIPT_URL'
// ============================================

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CRM – Zájemci');
  var data = JSON.parse(e.postData.contents);

  // Najdi poslední ID
  var lastRow = sheet.getLastRow();
  var lastId = 0;
  if (lastRow >= 5) {
    var idVal = sheet.getRange(lastRow, 1).getValue();
    lastId = typeof idVal === 'number' ? idVal : lastRow - 4;
  }
  var newId = lastId + 1;

  // Datum
  var today = Utilities.formatDate(new Date(), 'Europe/Prague', 'dd.MM.yyyy');

  // Zápis do řádku (odpovídá sloupcům CRM)
  var row = [
    newId,                        // A: ID
    today,                        // B: Datum přidání
    data.jmeno || '',             // C: Jméno
    data.prijmeni || '',          // D: Příjmení
    data.mesto || '',             // E: Město bydliště
    'Ostrava 23.4.',              // F: Akce / Město
    '',                           // G: Kompatibilita
    data.telefon || '',           // H: Telefon
    data.email || '',             // I: Email
    data.vek || '',               // J: Věk
    data.pohlavi || '',           // K: Pohlaví
    data.povolani || '',          // L: Povolání
    data.cohleda || '',           // M: Co hledá
    data.konicky || '',           // N: Koníčky
    'Web',                        // O: Zdroj
    'Zájem',                      // P: Stav
    '—',                          // Q: Schválen/a
    '—',                          // R: Zaplatil/a
    '',                           // S: Cena zaplacena
    data.dieta ? 'Dieta: ' + data.dieta : '',  // T: Poznámka
    data.gdpr || '',              // U: GDPR souhlas
    today,                        // V: Posl. kontakt
    '✗ Ne',                       // W: Opak. účastník
    data.linkedin || '',          // X: LinkedIn
    data.instagram || ''          // Y: Instagram
  ];

  sheet.appendRow(row);

  // Potvrzovací e-mail účastníkovi
  if (data.email) {
    var subject = 'Děkujeme za přihlášku — TVŮJ ČLOVĚK 23. 4. 2026';
    var body = 'Dobrý den, ' + (data.jmeno || '') + ',\n\n'
      + 'děkujeme za Vaši přihlášku na akci TVŮJ ČLOVĚK, která se koná 23. dubna 2026 v Ostravě.\n\n'
      + 'Vaše údaje:\n'
      + '• Jméno: ' + (data.jmeno || '') + ' ' + (data.prijmeni || '') + '\n'
      + '• Email: ' + (data.email || '') + '\n'
      + '• Telefon: ' + (data.telefon || '') + '\n'
      + '• Město: ' + (data.mesto || '') + '\n'
      + '• Věk: ' + (data.vek || '') + '\n'
      + '• Povolání: ' + (data.povolani || '') + '\n\n'
      + 'Každý účastník prochází výběrem — záleží nám na složení skupiny. '
      + 'Ozveme se Vám e-mailem s potvrzením účasti.\n\n'
      + 'V případě dotazů nás neváhejte kontaktovat na jana@walance.cz.\n\n'
      + 'Těšíme se na Vás!\n\n'
      + 'Jana Štěpaníková\n'
      + 'Tel: +420 601 584 901\n'
      + 'NetWalking Pro s.r.o.';

    MailApp.sendEmail(data.email, subject, body, {
      name: 'TVŮJ ČLOVĚK — Jana Štěpaníková',
      replyTo: 'jana@walance.cz',
      bcc: 'jana.stepanikova@nwpro.cz'
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
