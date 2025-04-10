function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('💡 내 메뉴')
    .addItem('인사하기', 'sayHello')
    .addToUi();
}

function sayHello() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('안녕하세요! 👋');
}

function writeTestString() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.getRange(1, 1).setValue('테스트 22333322문자열');
}