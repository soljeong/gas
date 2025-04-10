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


function useSecrets() {
  const props = PropertiesService.getDocumentProperties().getProperties();
  Logger.log(props.apiKey);
  Logger.log(props.clientId);
  Logger.log(props.clientSecret); 
}


// 스프레드시트가 열릴 때 메뉴를 생성합니다.
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('추가메뉴')
      .addItem('플토재고','fetchAndRecordOrders')
      .addToUi();
}

function fetchAndRecordOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const props = PropertiesService.getDocumentProperties().getProperties();
  const apiKey = props.apiKey;

  var token = getToken(apiKey, props.clientId, props.clientSecret);
//   var orderData = getOrders(token, apiKey, searchWord);
  var stockData = getStock(token, apiKey);
    if (stockData.length > 0) {
    recordData(sheet, stockData);
  } else {  
    Logger.log("No stock found.");
    }
}

function getToken(apiKey, clientId, clientSecret) {
  var url = "https://openapi.playauto.io/api/auth";
  var payload = {
    "email": clientId,
    "password": clientSecret
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "x-api-key": apiKey
    },
    "payload": JSON.stringify(payload)
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  if (json && json.length > 0 && json[0].token) {
    Logger.log("Token obtained successfully.");
    return json[0].token;
  } else {
    throw new Error("Failed to obtain token");
  }
}
function getStock(token, apiKey) {
    var url = "https://openapi.playauto.io/api/stock/condition";
    
 
    var payload = {
        "start": 0,
        "limit": 1000,
        "date_type": "wdate",
        "sdate": "2023-12-01",  
    };
    
    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": {
        "x-api-key": apiKey,
        "Authorization": "Token " + token
      },
      "payload": JSON.stringify(payload)
    };
  
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
  
    return processStock(json);
  }

    function processStock(stockList) {
        var results = stockList.results || [];

    
        return results;
      }

function getOrders(token, apiKey, searchWord) {
  var url = "https://openapi.playauto.io/api/orders";
  
  var now = new Date();
  var threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  var payload = {
    "sdate": formatDate(threeMonthsAgo),
    "edate": formatDate(now),
    "start": 0,
    "length": 500,
    "date_type": "wdate",
    "status": ["ALL"],
    "multi_type": "invoice_no",
    "multi_search_word": searchWord
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "x-api-key": apiKey,
      "Authorization": "Token " + token
    },
    "payload": JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  return processOrders(json);
}

function processOrders(orderList) {
  var results = orderList.results || [];
  var resultsProd = orderList.results_prod || [];

  var resultsDict = {};
  results.forEach(function(item) {
    resultsDict[item.uniq] = item;
  });

  var joinedData = resultsProd.map(function(prod) {
    var uniq = prod.uniq;
    return resultsDict[uniq] ? Object.assign({}, resultsDict[uniq], prod) : prod;
  });

  return joinedData;
}

function recordData(sheet, data) {
  sheet.clear(); // 기존 데이터 삭제
  
  if (data.length === 0) {
    return;
  }

  // 헤더 생성
  var headers = Object.keys(data[0]);
  var values = data.map(row => headers.map(header => row[header] || ""));

  // 시트에 한 번에 기록
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]); // 첫 번째 행(헤더)
  sheet.getRange(2, 1, values.length, headers.length).setValues(values); // 데이터
}

function formatDate(date) {
  return date.getFullYear() + "-" +
         ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
         ("0" + date.getDate()).slice(-2);
}
