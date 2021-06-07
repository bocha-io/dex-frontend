function add_to_buy(element) {
    return add_to_table("#buyTable", element, "#77dd77");
}

function add_to_sell(element) {
    return add_to_table("#sellTable", element, "#c23b22");
}

function add_to_table(tabla_id, element, color) {
    const table = document.querySelector(tabla_id);
    if (element.status != 0) {
        const $tr = table.insertRow(0);
        let $tdprice = document.createElement("td");
        var price = parseFloat(
            element.token_in_normalized / element.token_out_normalized
        ).toFixed(10);
        $tdprice.textContent = price;
        $tdprice.style.color = color;
        $tr.appendChild($tdprice);

        let $tdtotal = document.createElement("td");
        $tdtotal.textContent = parseFloat(element.token_out_normalized).toFixed(8);
        $tr.appendChild($tdtotal);

        let $tdtokenbo = document.createElement("td");
        $tdtokenbo.textContent = parseFloat(element.token_in_normalized).toFixed(8);
        $tr.appendChild($tdtokenbo);
        $tdtokenbo.style.textAlign = "right";

        var rowCount = table.rows.length;
        if (rowCount > 25) {
            table.deleteRow(rowCount - 1);
        }
    }
}

async function add_to_last_transactions(tx) {
    const $cuerpoTabla = document.querySelector("#cuerpoTabla");
    let img_token_out = localStorage.getItem(tx.token_out);
    if (img_token_out == null) {
        let url_Req =
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
            tx.token_out +
            "/logo.png";

        var myRequest = new Request(url_Req);
        var response = await fetch(myRequest);
        if (response.status == 200) {
            img_token_out =
                "'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
                tx.token_out +
                "/logo.png'";
        } else {
            img_token_out = "'/assets/img/ethereum.png'";
        }
        localStorage.setItem(tx.token_out, img_token_out);
    }

    let img_token_in = localStorage.getItem(tx.token_in);
    if (img_token_in == null) {
        let url_Req2 =
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
            tx.token_in +
            "/logo.png";
        var myRequest2 = new Request(url_Req2);

        var response = await fetch(myRequest2);
        if (response.status == 200) {
            img_token_in =
                "'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" +
                tx.token_in +
                "/logo.png'";
        } else {
            img_token_in = "'/assets/img/ethereum.png'";
        }
        localStorage.setItem(tx.token_in, img_token_in);
    }

    const $tr = $cuerpoTabla.insertRow(0);

    let $tdnames = document.createElement("td");
    let img1 = "<img width='12' src=" + img_token_out + "/>";
    let img2 = "<img width='12' src=" + img_token_in + "/>";

    $tdnames.innerHTML =
        img1 + img2 + " - " + tx.token_out_symbol + "/" + tx.token_in_symbol;
    $tr.appendChild($tdnames);

    let $tdtokenb = document.createElement("td");
    var tokend = tx.token_out_normalized;
    tokend = parseFloat(tokend).toFixed(4);
    $tdtokenb.textContent = tokend;
    $tr.appendChild($tdtokenb);
    $tdtokenb.style.textAlign = "right";

    let $tdtokenp = document.createElement("td");
    var tokenpy = tx.token_in_normalized;
    tokenpy = parseFloat(tokenpy).toFixed(4);
    $tdtokenp.textContent = tokenpy;
    $tr.appendChild($tdtokenp);
    $tdtokenp.style.textAlign = "right";

    let $tdtx_hash = document.createElement("td");
    $tdtx_hash.textContent = tx.tx_hash;
    $tr.appendChild($tdtx_hash);
    $tdtx_hash.style.textAlign = "right";
}


// var apiEndPoint = "test.hanchon.live/api"
var wsEndPoint = "test.hanchon.live/api";
console.log();

const ws = new WebSocket(`ws://${wsEndPoint}/ws`);
ws.onmessage = async (e) => {
    t1 = document.getElementById("token1").value;
    t2 = document.getElementById("token2").value;

    data = JSON.parse(e.data);
    if (data.pair_in == t1 && data.pair_out == t2) {
        add_to_buy(JSON.parse(data.value));
    } else if (data.pair_in == t2 && data.pair_out == t1) {
        add_to_buy(JSON.parse(data.value));
    }

    await add_to_last_transactions(JSON.parse(data.value));
};