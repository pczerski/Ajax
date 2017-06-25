'use strict';

// Definicja funkcji Ajax
function ajax(ajaxOptions) {
    // Opcje połączenia i jego typu
    var options = {
        type: ajaxOptions.type || "POST",
        url: ajaxOptions.url || '',
        onError: ajaxOptions.onError || function() {},
        onSuccess: ajaxOptions.onSuccess || function() {},
        dataType: ajaxOptions.dataType || 'text'
    }
    
    function httpSuccess(httpRequest) {
        try {
            return (httpRequest.status >= 200 && httpRequest.status < 300 ||                 httpRequest.status == 304 || navigator.userAgent.indexOf('Safari') >= 0 && typeof httpRequest.status == 'undefined');
        } catch (e) {
            return false;
        }
    }
    
    // Utworzenie obiektu XMLHTTPRequest - konieczne do użycia Ajaxu
    var httpReq = new XMLHttpRequest();
    
    // Otwarcie połączenia
    httpReq.open(options.type, options.url, true);
    
    // Sprawdzenie stanu połączenia - wywoływane za każdym razem gdy zmienia się ready state - od 0 do 4
    httpReq.onreadystatechange = function() {
        if (this.readyState == 4) {
            // Sprawdza status połczenie
            if (httpSuccess(this)) {
                //console.log('Połączenie działa');
                //console.log(this.readyState);
                //console.log(this.status);
                
                // Jesli dane w formacie XML, to zwróć obiekt responseXML, w innym razie responseText (JSON to tekst)
                var returnData = (options.dataType == 'xml')? this.responseXML : this.responseText;
                //console.log(returnData); // Dostajemy na razie czysty tekst, który trzeba sparsować do JSONa
                
                options.onSuccess(returnData);
                
                httpReq = null; // Zerowanie połączenia, aby pobrać kolejne elementy
            } else {
                options.onError(console.log('błąd!'));
            }
        }
    }
    
    httpReq.send(); // Bez tego połączenie nie zadziała
}

ajax({
    type: "GET",
    url: 'http://echo.jsontest.com/userId/108/userName/Akademia108/userURL/akademia108.pl',
    onError: function(msg) {
    console.log(msg);
    },
    onSuccess: function(response) {
        var jsonObj = JSON.parse(response); // Objekt sparsowany do JSONa - response = returnData
        console.log(jsonObj);
        console.log(jsonObj.userId); // Odwołania do poszczególnych pól JSONa
        
        var userID = jsonObj.userId;
        // $('#testowy').text(userID); // jQuery
        document.getElementById('testowy').innnerHTML = userID;
    } 
    
});