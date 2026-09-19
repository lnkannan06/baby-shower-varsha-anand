// Paste into Extensions > Apps Script from your private response spreadsheet.
// Run setup once before deploying. Never put sheet credentials in website code.
function setup() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Open this script from your Google Sheet via Extensions > Apps Script.');
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', book.getId());
  let sheet = book.getSheetByName('RSVPs');
  if (!sheet) sheet = book.insertSheet('RSVPs');
  if (!sheet.getLastRow()) sheet.appendRow(['Request ID','Received','Household','Email','Attendance','Adults','Children','Other guest names','Dietary needs','Message']);
  sheet.setFrozenRows(1);
}
function doGet() { return reply_({ok:true,service:'Baby shower RSVP'}); }
function reply_(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 12000) return reply_({ok:false,error:'Invalid submission.'});
    const d = JSON.parse(e.postData.contents);
    if (!d || typeof d !== 'object' || d.website) return reply_({ok:false,error:'Invalid submission.'});
    const text = (key, max) => {
      if (typeof d[key] !== 'string' || d[key].length > max) throw new Error('validation');
      return d[key].trim();
    };
    const id=text('requestId',80), name=text('name',120), email=text('email',200), attendance=text('attendance',10);
    if(!/^[a-zA-Z0-9-]{20,80}$/.test(id) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['yes','no'].includes(attendance)) throw new Error('validation');
    const adults=attendance==='yes'?Number(d.adults):0, children=attendance==='yes'?Number(d.children):0;
    if(!Number.isInteger(adults)||!Number.isInteger(children)||adults<(attendance==='yes'?1:0)||adults>20||children<0||children>20) throw new Error('validation');
    const optional=(key,max)=>d[key]===undefined?'':text(key,max);
    const guests=optional('guests',500), dietary=optional('dietary',1000), message=optional('message',1500);
    lock=LockService.getScriptLock(); lock.waitLock(15000);
    const sheet=SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName('RSVPs');
    if(!sheet) throw new Error('setup');
    if(sheet.getLastRow()>1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).findNext()) return reply_({ok:true});
    // Store submitted text literally, including values resembling spreadsheet formulas.
    const safe=value=>/^[\s]*[=+\-@]/.test(value)?"'"+value:value;
    sheet.appendRow([id,new Date(),safe(name),safe(email),attendance,adults,children,safe(guests),safe(dietary),safe(message)]);
    SpreadsheetApp.flush();
    return reply_({ok:true});
  } catch(error) {
    return reply_({ok:false,error:error.message==='validation'?'Please check your name, email, and guest counts.':'Unable to save your response. Please retry or Contact Host Lakshmi Kannan at +1-510-953-1593.'});
  } finally {if(lock && lock.hasLock()) lock.releaseLock();}
}
