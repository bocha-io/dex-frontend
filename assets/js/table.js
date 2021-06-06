var apiEndPoint = "https://test.hanchon.live/api/"



$.get(apiEndPoint + "pairs", function (data) {
    var str = '';
    var pair = data.values;
    for (var i = 0; i < pair.length; ++i) {
        str += '<option value="' + pair[i].replace('-', '/') + '" />';
    }
    var my_list = document.getElementById("pairs");
    my_list.innerHTML = str;

})

function getData(obj) {
    if (obj.value != '') {
        setpairs(obj.value.split("/")[0], obj.value.split("/")[1])
        obj.value = ''
    }
}


$.get(apiEndPoint + "last_txns", function (data) {

    const txs = data.values;

    // last tx table
    const $cuerpoTabla = document.querySelector("#cuerpoTabla");
    txs.forEach(tx => {
        //<tr>

        let url_Req = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + tx.token_out + '/logo.png';

        let img_token_out;
        var myRequest = new Request(url_Req);
        fetch(myRequest).then(function (response) {
            if (response.status != 404) {
                img_token_out = "'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" + tx.token_out + "/logo.png'"
            } else {
                img_token_out = "'/assets/img/ethereum.png'"
            }

            let url_Req2 = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/' + tx.token_in + '/logo.png';
            let img_token_in;
            var myRequest2 = new Request(url_Req2);

            fetch(myRequest2).then(function (response) {
                if (response.status != 404) {
                    img_token_in = "'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/" + tx.token_in + "/logo.png'"
                } else {
                    img_token_in = "'/assets/img/ethereum.png'"
                }


                const $tr = document.createElement("tr");

                let $tdnames = document.createElement("td");
                let img1 = "<img width='12' src=" + img_token_out + "/>";
                let img2 = "<img width='12' src=" + img_token_in + "/>";


                $tdnames.innerHTML = (img1 + img2 + ' - ' + tx.token_out_symbol + '/' + tx.token_in_symbol);
                $tr.appendChild($tdnames);


                let $tdtokenb = document.createElement("td");
                var tokend = tx.token_out_normalized;
                tokend = parseFloat(tokend).toFixed(4)
                $tdtokenb.textContent = (tokend);
                $tr.appendChild($tdtokenb);
                $tdtokenb.style.textAlign = "right"

                let $tdtokenp = document.createElement("td");
                var tokenpy = tx.token_in_normalized;
                tokenpy = parseFloat(tokenpy).toFixed(4)
                $tdtokenp.textContent = (tokenpy);
                $tr.appendChild($tdtokenp);
                $tdtokenp.style.textAlign = "right"

                let $tdtx_hash = document.createElement("td");
                $tdtx_hash.textContent = tx.tx_hash;
                $tr.appendChild($tdtx_hash);
                $tdtx_hash.style.textAlign = "right"

                // <tr
                $cuerpoTabla.appendChild($tr);

            });
        });


    });

});

var chart = null;

function setpairs(token1, token2) {

    $("#buyTable").empty()
    $("#sellTable").empty()
    $("#historicTable").empty()
    $.get(apiEndPoint + "historic/" + token1 + '-' + token2, function (data) {

        var historic = data.values.reverse();
        historic = historic.filter(h => parseFloat(h.price) != 0);

        const $historicTable = document.querySelector("#historicTable");
        for (i = 0; i < historic.length; i++) {
            //<tr>

            if (historic[i].status != 0) {
                if (historic[i].price != 0) {
                    const $tr = document.createElement("tr");

                    // let $tdtotal = document.createElement("td");
                    // $tdtotal.textContent = parseFloat(historic[i].token_out_normalized).toFixed(8);
                    // $tr.appendChild($tdtotal);

                    let $tdprice = document.createElement("td");

                    if (i < historic.length - 1) {
                        if (historic[i].price > historic[i + 1].price) {
                            $tdprice.style.color = "#77dd77"
                        } else {
                            $tdprice.style.color = "#c23b22"
                        }
                    }
                    var price = parseFloat(historic[i].price).toFixed(10);
                    $tdprice.textContent = price;
                    $tr.appendChild($tdprice);

                    let $tddate = document.createElement("td");
                    $tddate.textContent = moment.utc(parseFloat(historic[i].date) * 1000).local().format("YYYY-MM-DD HH:mm:ss")
                    $tr.appendChild($tddate);
                    $tddate.style.textAlign = "right"
                    // <tr
                    $historicTable.appendChild($tr);
                }
            }
        };
    })


    $.get(apiEndPoint + "txns/" + token1 + '-' + token2, function (data) {

        document.getElementById("title-1").innerHTML = "SWAP " + token1 + "/" + token2
        document.getElementById("span-1").innerHTML = "(" + token2 + "/" + token1 + ")"
        document.getElementById("amount-1").innerHTML = "(" + token1 + ")"
        document.getElementById("title-2").innerHTML = "SWAP " + token2 + "/" + token1
        document.getElementById("span-2").innerHTML = "(" + token1 + "/" + token2 + ")"
        document.getElementById("amount-2").innerHTML = "(" + token2 + ")"
        document.getElementById("price-1").innerHTML = token1
        document.getElementById("price-2").innerHTML = token2
        document.getElementById("price-1-2").innerHTML = token1
        document.getElementById("price-2-2").innerHTML = token2
        document.getElementById("title-pairs").innerHTML = token1 + "/" + token2
        let tk1 = token1.toLowerCase()

        document.getElementById("img-1").src = "https://cryptoicon-api.vercel.app/api/icon/" + tk1.toLowerCase()
        document.getElementById("img-2").src = "https://cryptoicon-api.vercel.app/api/icon/" + token2.toLowerCase()

        localStorage.setItem('tk-1', token1);

        const buy = data.values.reverse();

        const $buyTable = document.querySelector("#buyTable");
        buy.forEach(buy => {
            //<tr>
            if (buy.status != 0) {
                const $tr = document.createElement("tr");

                let $tdprice = document.createElement("td");
                var price = parseFloat(buy.token_in_normalized / buy.token_out_normalized).toFixed(10);
                $tdprice.textContent = price;
                $tdprice.style.color = "#77dd77"
                $tr.appendChild($tdprice);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(buy.token_out_normalized).toFixed(8);
                $tr.appendChild($tdtotal);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(buy.token_in_normalized).toFixed(8);
                $tr.appendChild($tdtokenbo);
                $tdtokenbo.style.textAlign = "right"
                // <tr
                $buyTable.appendChild($tr);
            }
        });

    });

    $.get(apiEndPoint + "txns/" + token2 + '-' + token1, function (data) {

        const sell = data.values.reverse();

        const $sellTable = document.querySelector("#sellTable");
        sell.forEach(sell => {

            if (sell.status != 0) {
                //<tr>
                const $tr = document.createElement("tr");

                let $tdprice = document.createElement("td");
                var price = parseFloat(sell.token_in_normalized / sell.token_out_normalized).toFixed(10);
                $tdprice.textContent = price;
                $tdprice.style.color = "#c23b22"
                $tr.appendChild($tdprice);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(sell.token_out_normalized).toFixed(8);
                $tr.appendChild($tdtokenbo);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(sell.token_in_normalized).toFixed(8);
                $tr.appendChild($tdtotal);
                $tdtotal.style.textAlign = "right"

                // <tr
                $sellTable.appendChild($tr);
            }
        });

    });

    $.get(apiEndPoint + "price/" + token1 + '/' + token2, function (data) {

        document.getElementById("src-tk").firstChild.remove();

        console.log(data)

        document.getElementById("priceToken1").innerHTML = data.price_in.toFixed(10);
        document.getElementById("priceToken2").innerHTML = data.price_out.toFixed(10);

        var token_in = data.address_in;

        if (data.address_in == '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
            token_in = 'eth'
        }
        var token_out = data.address_out;

        if (data.address_out == '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') {
            token_out = 'eth'
        }
        var iframe = document.createElement("iframe")
        iframe.src = "https://app.uniswap.org/#/swap?theme=dark&inputCurrency=" + token_in + "&outputCurrency=" + token_out;
        iframe.height = '600px';
        iframe.width = '133%';
        iframe.className = 'iframe';
        document.getElementById("src-tk").appendChild(iframe)
    });

    //chart

    anychart.onDocumentReady(function () {

        $.get(apiEndPoint + "historic/" + token1 + '-' + token2, function (data) {

            const historic = data.values.reverse();
            var data = [];

            let backup = []

            for (i = 0; i < historic.length; i++) {
                if (historic[i].price == 0 || historic[i].open == 0) {
                    if (backup != []) {
                        backup.date = backup.date - 900
                    }
                } else {
                    var d = moment.utc(parseFloat(historic[i].date) * 1000).local().format("YYYY-MM-DD HH:mm:ss")
                    backup = [d, historic[i].open, historic[i].high, historic[i].low, historic[i].price, historic[i].volume]
                }
                if (backup != []) {
                    data.push(backup)
                }
            }


            var dataTable = anychart.data.set(data);
            var dataTable = anychart.data.table();
            dataTable.addData(data);

            // map data for the candlestick series
            var ohlcMapping = dataTable.mapAs({
                open: 1,
                high: 2,
                low: 3,
                close: 4,
            });

            // map data for scroller and volume series
            var valueMapping = dataTable.mapAs({
                value: 5
            });

            // create stock chart
            if (chart != null)
                chart.dispose();
            chart = anychart.stock(dataTable);

            var plot = chart.plot(0);

            // create and setup candlestick series on the first plot
            var ohlcSeries = plot.candlestick(ohlcMapping);
            ohlcSeries.name('data');
            ohlcSeries.legendItem().iconType('risingfalling');

            var plot1 = chart.plot(1);
            plot1.maxHeight('30%')
            // create volume series on the second plot
            var volumeSeries = plot1.column(valueMapping);
            volumeSeries.name('Volume');

            // set max height of volume series and attach it to the bottom of plot
            volumeSeries.maxHeight('100%').bottom(0);

            // create an EMA indicator
            var ema5 = plot.ema(ohlcMapping, 5).series();
            // set the EMA color
            ema5.stroke('1 blue');

            var ema9 = plot.ema(ohlcMapping, 9).series();
            // set the EMA color
            ema9.stroke('1 violet');

            var ema21 = plot.ema(ohlcMapping, 21).series();
            // set the EMA color
            ema21.stroke('1 orange');


            // modify the color of candlesticks
            ohlcSeries.fallingFill("#c23b22");
            ohlcSeries.fallingStroke("#c23b22");
            ohlcSeries.risingFill("#77dd77");
            ohlcSeries.risingStroke("#77dd77");
            volumeSeries.fallingFill("#c23b22");
            volumeSeries.fallingStroke("#c23b22");
            volumeSeries.risingFill("#77dd77");
            volumeSeries.risingStroke("#77dd77");


            // create indicator plot
            // var indicatorPlot = chart.plot(1);

            // // set indicator plot height
            // indicatorPlot.height('25%');

            // // create KDJ indicator
            // indicatorPlot.kdj(ohlcMapping);

            // // get tooltip
            // var tooltip = chart.tooltip();

            // create scroller series with mapped data
            chart.scroller().line(valueMapping);
            // // set container id for the chart
            chart.container('container');
            // initiate chart drawing
            chart.draw();

            // set values for selected range
            chart.selectRange('qtd', 1, 'last-date');

            // create range picker
            var rangePicker = anychart.ui.rangePicker();
            // init range picker
            rangePicker.render(chart);

            // create range selector
            var rangeSelector = anychart.ui.rangeSelector();
            // init range selector
            rangeSelector.render(chart);

            //background
            chart.background().fill("transparent");


        })
    })


}

setpairs("WETH", "USDT")