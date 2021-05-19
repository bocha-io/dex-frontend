
$.get( "http://79.157.14.252:7000/last_txns", function( data ) {

    console.log(data)

    const txs = data.values;

    // last tx table
    const $cuerpoTabla = document.querySelector("#cuerpoTabla");
    txs.forEach(tx => {
    //<tr>
    const $tr = document.createElement("tr");

    let $tdtx_hash = document.createElement("td");
    $tdtx_hash.textContent = tx.tx_hash; 
    $tr.appendChild($tdtx_hash);

    let $tdtokenp= document.createElement("td");
    var tokenpy = tx.tokens_payed_for_the_exchange_normalized;
    tokenpy = parseFloat(tokenpy).toFixed(4)
    $tdtokenp.textContent = (tokenpy + ' ' + tx.token_used_for_payment_symbol);
    $tr.appendChild($tdtokenp);

    let $tdtokenb = document.createElement("td");
    var tokend = tx.tokens_bought_from_the_exchange_normalized;
    tokend = parseFloat(tokend).toFixed(4)
    $tdtokenb.textContent = (tokend + ' ' + tx.token_being_bought_symbol) ;
    $tr.appendChild($tdtokenb);

    let $tdstatus = document.createElement("td");
    var status = tx.status;
    if(status == 1) {
        $tdstatus.textContent = 'success';
    $tr.appendChild($tdstatus);
    };
    if(status == 0) {
        $tdstatus.textContent = 'canceled';
    $tr.appendChild($tdstatus);
    } 


    // <tr
    $cuerpoTabla.appendChild($tr);

    });

});

$.get( "http://79.157.14.252:7000/txns/MILF-WETH", function( data ) {

    console.log(data)

    const buy = data.values.reverse().slice(0,5);

    const $buyTable = document.querySelector("#buyTable");
    buy.forEach(buy => {
    //<tr>
    // if(token_being_bought_symbol)
    const $tr = document.createElement("tr");

    let $tdprice = document.createElement("td");
    var price = parseFloat(buy.tokens_payed_for_the_exchange_normalized / buy.tokens_bought_from_the_exchange_normalized).toFixed(8);
    $tdprice.textContent = price;
    $tr.style.color = "greenyellow" 
    $tr.appendChild($tdprice);

    let $tdtokenbo = document.createElement("td");
    $tdtokenbo.textContent = parseFloat(buy.tokens_bought_from_the_exchange_normalized).toFixed(8); 
    $tr.appendChild($tdtokenbo);

    let $tdtotal = document.createElement("td");
    $tdtotal.textContent = parseFloat(buy.tokens_payed_for_the_exchange_normalized).toFixed(8); 
    $tr.appendChild($tdtotal);
    // <tr
    $buyTable.appendChild($tr);

    });

});

$.get( "http://79.157.14.252:7000/txns/WETH-MILF", function( data ) {

    console.log(data)

    const sell = data.values.reverse().slice(0,5);

    const $sellTable = document.querySelector("#sellTable");
    sell.forEach(buy => {
    //<tr>
    // if(token_being_bought_symbol)
    const $tr = document.createElement("tr");

    let $tdprice = document.createElement("td");
    var price = parseFloat(buy.tokens_payed_for_the_exchange_normalized / buy.tokens_bought_from_the_exchange_normalized).toFixed(8);
    $tdprice.textContent = price;
    $tr.style.color = "greenyellow" 
    $tr.appendChild($tdprice);

    let $tdtokenbo = document.createElement("td");
    $tdtokenbo.textContent = parseFloat(buy.tokens_bought_from_the_exchange_normalized).toFixed(8); 
    $tr.appendChild($tdtokenbo);

    let $tdtotal = document.createElement("td");
    $tdtotal.textContent = parseFloat(buy.tokens_payed_for_the_exchange_normalized).toFixed(8); 
    $tr.appendChild($tdtotal);
    // <tr
    $buyTable.appendChild($tr);

    });

});