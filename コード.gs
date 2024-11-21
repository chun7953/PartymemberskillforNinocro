function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index'); // HTMLファイルを返す
}

function getHeaderAndData() {
  const sheetId = PropertiesService.getScriptProperties().getProperty('sheet_ID'); // プロパティからシートIDを取得
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet(); // シートを開く
  const lastColumn = sheet.getLastColumn(); // 最後の列を動的に取得
  const header = sheet.getRange(1, 1, 1, lastColumn).getValues()[0]; // ヘッダーを取得
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastColumn).getValues(); // データを取得
  return { header, data }; // ヘッダーとデータを返す
}

function getRowByValue(selectedValue) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('sheet_ID'); // プロパティからシートIDを取得
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet(); // シートを開く
  const data = sheet.getDataRange().getValues(); // シートの全データを取得
  for (let i = 1; i < data.length; i++) { // ヘッダーを除くため i=1 から開始
    if (data[i][1] === selectedValue) { // B列 (インデックス1) が選択された値と一致するか
      return data[i]; // 一致した行を返す
    }
  }
  return []; // 一致しない場合は空配列を返す
}

function updateRowByValue(selectedName, newValuesMap) {
    const sheetId = PropertiesService.getScriptProperties().getProperty('sheet_ID'); // プロパティからシートIDを取得
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet(); // シートを開く
    const data = sheet.getDataRange().getValues();
    let rowUpdated = false; // 行が更新されたかどうかのフラグ

    for (let i = 1; i < data.length; i++) {
        if (data[i][1] === selectedName) { // B列が選択された名前と一致するか
            for (const [header, newValue] of Object.entries(newValuesMap)) {
                const columnIndex = data[0].indexOf(header); // ヘッダーから列インデックスを取得
                // 新しい値が存在する場合のみ更新、かつヘッダーが「名前」でない場合
                if (columnIndex !== -1 && newValue && newValue !== "選択" && header !== "名前") {
                    sheet.getRange(i + 1, columnIndex + 1).setValue(newValue); // 更新
                    Logger.log(`行: ${i + 1}, 列: ${columnIndex + 1} に新しい値 '${newValue}' を設定しました。`);
                    rowUpdated = true; // 行が更新されたとフラグを立てる
                }
            }
        }
    }

    if (!rowUpdated) {
        Logger.log(`名前 '${selectedName}' に一致する行が見つかりませんでした。`);
    }
}