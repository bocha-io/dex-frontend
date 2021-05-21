$.get("http://190.123.23.7:7000/pairs", function (data) {
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


$.get("http://190.123.23.7:7000/last_txns", function (data) {

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

function setpairs(token1, token2) {

    $("#buyTable").empty()
    $("#sellTable").empty()
    $("#historicTable").empty()
    $.get("http://190.123.23.7:7000/historic/" + token1 + '-' + token2, function (data) {

        const historic = data.values.reverse();

        const $historicTable = document.querySelector("#historicTable");
        for (i = 0; i < historic.length; i++) {
            //<tr>

            if (historic[i].status != 0) {
                const $tr = document.createElement("tr");

                // let $tdtotal = document.createElement("td");
                // $tdtotal.textContent = parseFloat(historic[i].tokens_bought_from_the_exchange_normalized).toFixed(8);
                // $tr.appendChild($tdtotal);

                let $tdprice = document.createElement("td");
                var price = parseFloat(historic[i].price).toFixed(10);
                $tdprice.textContent = price;
                if (i < historic.length - 1) {
                    if (price > historic[i + 1].price) {
                        $tdprice.style.color = "#77dd77"
                    } else {
                        $tdprice.style.color = "#c23b22"
                    }
                }
                $tr.appendChild($tdprice);

                let $tddate = document.createElement("td");
                $tddate.textContent = new Date(parseFloat(historic[i].date)).toLocaleTimeString()
                $tr.appendChild($tddate);
                // <tr
                $historicTable.appendChild($tr);
            }
        };
    })


    $.get("http://190.123.23.7:7000/txns/" + token1 + '-' + token2, function (data) {

        document.getElementById("title-1").innerHTML = "SWAP " + token1 + "/" + token2
        document.getElementById("span-1").innerHTML = token2 + "/" + token1
        document.getElementById("amount-1").innerHTML = "(" + token1 + ")"
        document.getElementById("title-2").innerHTML = "SWAP " + token2 + "/" + token1
        document.getElementById("span-2").innerHTML = token1 + "/" + token2
        document.getElementById("amount-2").innerHTML = "(" + token2 + ")"
        document.getElementById("price-1").innerHTML = token1
        document.getElementById("price-2").innerHTML = token2
        document.getElementById("price-1-2").innerHTML = token1
        document.getElementById("price-2-2").innerHTML = token2
        document.getElementById("title-pairs").innerHTML = token2 + "/" + token1



        const buy = data.values.reverse();

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

                // <tr
                $buyTable.appendChild($tr);




            }
        });

    });

    $.get("http://190.123.23.7:7000/txns/" + token2 + '-' + token1, function (data) {

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

                // <tr
                $sellTable.appendChild($tr);
            }
        });

    });

    $.get("http://190.123.23.7:7000/price/" + token1 + '/' + token2, function (data) {
    
        document.getElementById("priceToken1").innerHTML = data.price;
        document.getElementById("priceToken2").innerHTML = data.price2;
    });

    //chart

    anychart.onDocumentReady(function () {
        
        $.get("http://190.123.23.7:7000/historic/" + token1 + '-' + token2, function (data) {

            console.log('hola')    

            const historic = data.values.reverse();
            var data = [];
            
            for (i = 0; i < historic.length; i++) {
                var d = moment.utc(parseFloat(historic[i].date) * 1000).local().format("YYYY-MM-DD HH:mm:ss")
                data.push([d, historic[i].open, historic[i].high, historic[i].low, historic[i].price])
            }
            console.log(data)

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
            var chart = anychart.stock();

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
            plot
            .ema(dataTable.mapAs({ value: 4 }))
            .series()
            .stroke('1 orange');

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

            // // setup formatters for the title and content of the tooltip using HTML
            // tooltip.useHtml(true);
            // tooltip.titleFormat(function () {
            //     return (
            //         '<h3>' +
            //         anychart.format.dateTime(this.x, 'dd MMMM yyyy') +
            //         '</h3>'
            //     );

            // });
            // tooltip.unionFormat(function () {
            //     return (
            //         '<table>' +
            //         '<tr><td>Open</td><td>$' +
            //         anychart.format.number(this.points[0].open, 2) +
            //         '</td></tr>' +
            //         '<tr><td>High</td><td>$' +
            //         anychart.format.number(this.points[0].high, 2) +
            //         '</td></tr>' +
            //         '<tr><td>Low</td><td>$' +
            //         anychart.format.number(this.points[0].low, 2) +
            //         '</td></tr>' +
            //         '<tr><td>Close</td><td>$' +
            //         anychart.format.number(this.points[0].close, 2) +
            //         '</td></tr>' +
            //         '<tr><td>Volume</td><td>$' +
            //         anychart.format.number(this.points[1].value, 2) +
            //         '</td></tr>' +
            //         '<tr><td><span class="k-square">◼</span>%K(14, 5)</td><td>$' +
            //         anychart.format.number(this.points[2].value, 2) +
            //         '</td></tr>' +
            //         '<tr><td><span class="d-square">◼</span>%D(5)</td><td>$' +
            //         anychart.format.number(this.points[3].value, 2) +
            //         '</td></tr>' +
            //         '<tr><td><span class="j-square">◼</span>%J</td><td>$' +
            //         anychart.format.number(this.points[4].value, 2) +
            //         '</td></tr>' +
            //         '</table>'
            //     );
            // });

            // // create scroller series with mapped data
            // chart.scroller().line(ohlcMapping);
            // // set container id for the chart
            chart.container('container');
            // initiate chart drawing
            chart.draw();

            // // set values for selected range
            // chart.selectRange('qtd', 1, 'last-date');

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
            //}
        })
    });

}






// anychart.onDocumentReady(function () {

//     // load data
//     var data = [
//         [Date.UTC(2007, 07, 23), 23.55, 23.88, 23.38, 23.62],
//         [Date.UTC(2007, 07, 24), 22.65, 23.7, 22.65, 23.36],
//         [Date.UTC(2007, 07, 25), 22.75, 23.7, 22.69, 23.44],
//         [Date.UTC(2007, 07, 26), 23.2, 23.39, 22.87, 22.92],
//         [Date.UTC(2007, 07, 27), 23.98, 24.49, 23.47, 23.49],
//         [Date.UTC(2007, 07, 30), 23.55, 23.88, 23.38, 23.62],
//         [Date.UTC(2007, 07, 31), 23.88, 23.93, 23.24, 23.25],
//         [Date.UTC(2007, 08, 01), 23.17, 23.4, 22.85, 23.25],
//         [Date.UTC(2007, 08, 02), 22.65, 23.7, 22.65, 23.36],
//         [Date.UTC(2007, 08, 03), 23.2, 23.39, 22.87, 22.92],
//         [Date.UTC(2007, 08, 06), 23.03, 23.15, 22.44, 22.97],
//         [Date.UTC(2007, 08, 07), 22.75, 23.7, 22.69, 23.44],
//         [Date.UTC(2007, 09, 05), 24.55, 23.88, 23.38, 23.62],
//         [Date.UTC(2007, 09, 06), 24.88, 23.93, 23.24, 23.25],
//         [Date.UTC(2007, 09, 07), 23.17, 23.4, 22.85, 23.25],
//         [Date.UTC(2007, 09, 08), 21.65, 23.7, 22.65, 23.36],
//         [Date.UTC(2007, 09, 09), 25.2, 23.39, 22.87, 22.92],
//         [Date.UTC(2007, 09, 10), 23.03, 23.15, 22.44, 22.97],
//         [Date.UTC(2007, 09, 11), 25.75, 23.7, 22.69, 23.44]
//     ];

//     var dataTable = anychart.data.table();
//     dataTable.addData(data);

//     // map data
//     var mapping = dataTable.mapAs({
//         'open': 2,
//         'high': 3,
//         'low': 4,
//         'close': 1
//     });

//     // set the chart type
//     var chart = anychart.stock();

//     // set the series
//     var series = chart.plot(0).candlestick(mapping);
//     series.name("Trade Data");

//     // set the chart title
//     chart.title("Historical Trade Data");

//     // create a plot
//     var plot = chart.plot(0);
//     // create an EMA indicator with period 20
//     var ema20 = plot.ema(mapping, 20).series();
//     // set the EMA color
//     ema20.stroke('orange');

//     // disable the scroller axis
//     chart.scroller().xAxis(false);
//     // map "open" values for the scroller
//     openValue = dataTable.mapAs();
//     openValue.addField('value', 2);
//     // create a scroller series with the mapped data
//     chart.scroller().column(openValue);

//     // modify the color of candlesticks making them black and white
//     series.fallingFill("#4EDA35");
//     series.fallingStroke("#4EDA35");
//     series.risingFill("red");
//     series.risingStroke("red");

//     // set the container id
//     chart.container('container');

//     //background
//     chart.background().fill("transparent");

//     // draw the chart
//     chart.draw();
// });





setpairs("WETH", "USDT")