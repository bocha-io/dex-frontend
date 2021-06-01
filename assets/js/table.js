var apiEndPoint = "https://test.hanchon.live/api/"

$.get(apiEndPoint + "pairs", function (data) {
    var str = ''; // variable to store the options

    // var pair = new Array("WETH/MILF","February","March","April","May","June","July","August",
    // "September","October","November","December");
    var pair = data.values;
    for (var i = 0; i < pair.length; ++i) {
        str += '<option value="' + pair[i].replace('-', '/') + '" />'; // Storing options in variable
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

// $( document ).ready(function() {
//     $('#uniswap-trade').modal('toggle')

//     setTimeout(vamosKun, 2000)

//     function vamosKun() {
//         console.log("hola")
        
//         console.log(document.querySelector ("div.sc-33m4yg-4.hPbfqi"))
//         console.log(document.getElementById ("#swap-currency-input"))
//         var iframe = document.getElementById("src-tk");
//         console.log(iframe.contentWindow.document.getElementsById("swap-currency-input"))

//         // document.querySelectorAll('iframe').forEach( item =>
//         //     console.log(item.contentWindow.document.body.querySelectorAll('a'))
//         // )
//     }
// });


$.get(apiEndPoint + "last_txns", function (data) {

    const txs = data.values;

    // last tx table
    const $cuerpoTabla = document.querySelector("#cuerpoTabla");
    txs.forEach(tx => {
        //<tr>
        const $tr = document.createElement("tr");

        let $tdnames = document.createElement("td");
        $tdnames.textContent = (tx.token_being_bought_symbol + '/' + tx.token_used_for_payment_symbol);
        $tr.appendChild($tdnames);

        let $tdtokenb = document.createElement("td");
        var tokend = tx.tokens_bought_from_the_exchange_normalized;
        tokend = parseFloat(tokend).toFixed(4)
        $tdtokenb.textContent = (tokend);
        $tr.appendChild($tdtokenb);
        $tdtokenb.style.textAlign = "right"

        let $tdtokenp = document.createElement("td");
        var tokenpy = tx.tokens_payed_for_the_exchange_normalized;
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
                if(historic[i].price != 0) { 
                    const $tr = document.createElement("tr");

                    // let $tdtotal = document.createElement("td");
                    // $tdtotal.textContent = parseFloat(historic[i].tokens_bought_from_the_exchange_normalized).toFixed(8);
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
        document.getElementById("src-tk").src = "https://app.uniswap.org/#/swap?theme=dark&outputCurrency=" + token1

        localStorage.setItem('tk-1', token1);

        const buy = data.values.reverse();

        console.log(buy)

        const $buyTable = document.querySelector("#buyTable");
        buy.forEach(buy => {
            //<tr>
            if (buy.status != 0) {
                const $tr = document.createElement("tr");

                let $tdprice = document.createElement("td");
                var price = parseFloat(buy.tokens_payed_for_the_exchange_normalized / buy.tokens_bought_from_the_exchange_normalized).toFixed(10);
                $tdprice.textContent = price;
                $tdprice.style.color = "#77dd77"
                $tr.appendChild($tdprice);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(buy.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtotal);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(buy.tokens_payed_for_the_exchange_normalized).toFixed(8);
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
                var price = parseFloat(sell.tokens_payed_for_the_exchange_normalized / sell.tokens_bought_from_the_exchange_normalized).toFixed(10);
                $tdprice.textContent = price;
                $tdprice.style.color = "#c23b22"
                $tr.appendChild($tdprice);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(sell.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtokenbo);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(sell.tokens_payed_for_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtotal);
                $tdtotal.style.textAlign = "right"

                // <tr
                $sellTable.appendChild($tr);
            }
        });

    });

    $.get( apiEndPoint + "price/" + token1 + '/' + token2, function (data) {
        console.log(data.price.toFixed(10))
        console.log(data.price2)

        document.getElementById("priceToken1").innerHTML = data.price.toFixed(10);
        document.getElementById("priceToken2").innerHTML = data.price2.toFixed(10);
    });

    //chart

    anychart.onDocumentReady(function () {

        $.get(apiEndPoint + "historic/" + token1 + '-' + token2, function (data) {

            const historic = data.values.reverse();
            var data = [];

            let backup = []

            for (i = 0; i < historic.length; i++) {
                if(historic[i].price == 0 || historic[i].open == 0) {
                    if(backup != []) {
                        backup.date = backup.date-900
                    }
                } else {
                    var d = moment.utc(parseFloat(historic[i].date) * 1000).local().format("YYYY-MM-DD HH:mm:ss")
                    backup = [d, historic[i].open, historic[i].high, historic[i].low, historic[i].price]
                }
                if(backup != []) {
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


            // create volume series on the first plot
            var volumeSeries = plot.column(valueMapping);
            volumeSeries.name('Volume');

            // set max height of volume series and attach it to the bottom of plot
            volumeSeries.maxHeight('30%').bottom(0);

            var plot = chart.plot(0);
            // set grid settings

            // create EMA indicators with period 50
            var plot = chart.plot(0);
            // create an EMA indicator with period 20
            var ema20 = plot.ema(ohlcMapping, 20).series();
            // set the EMA color
            ema20.stroke('1 orange');


            // modify the color of candlesticks making them black and white
            ohlcSeries.fallingFill("#c23b22");
            ohlcSeries.fallingStroke("#c23b22");
            ohlcSeries.risingFill("#77dd77");
            ohlcSeries.risingStroke("#77dd77");

            // create indicator plot
            // var indicatorPlot = chart.plot(1);

            // // set indicator plot height
            // indicatorPlot.height('25%');

            // // create KDJ indicator
            // indicatorPlot.kdj(ohlcMapping);

            // // get tooltip
            // var tooltip = chart.tooltip();

            // // create scroller series with mapped data
            // chart.scroller().line(ohlcMapping);
            // // set container id for the chart
            chart.container('container');
            // initiate chart drawing
            chart.draw();

            // set values for selected range
            chart.selectRange('qtd', 1, 'last-date');

            // // create range picker
            // var rangePicker = anychart.ui.rangePicker();
            // // init range picker
            // rangePicker.render(chart);

            // // create range selector
            // var rangeSelector = anychart.ui.rangeSelector();
            // // init range selector
            // rangeSelector.render(chart);

            //background
            chart.background().fill("transparent");


        })
    })

}

setpairs("SHIB", "WETH")