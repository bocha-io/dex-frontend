$.get("http://79.157.14.252:7000/pairs", function (data) {
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


$.get("http://79.157.14.252:7000/last_txns", function (data) {

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

        // let $tdstatus = document.createElement("td");
        // var status = tx.status;
        // if(status == 1) {
        //     $tdstatus.textContent = 'success';
        // $tr.appendChild($tdstatus);
        // };
        // if(status == 0) {
        //     $tdstatus.textContent = 'canceled';
        // $tr.appendChild($tdstatus);
        // } 


        // <tr
        $cuerpoTabla.appendChild($tr);

    });

});

function setpairs(token1, token2) {

    $("#buyTable").empty()
    $("#sellTable").empty()



    $.get("http://79.157.14.252:7000/txns/" + token1 + '-' + token2, function (data) {

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


        const buy = data.values.reverse().slice(0, 5);

        const $buyTable = document.querySelector("#buyTable");
        buy.forEach(buy => {
            //<tr>
            console.log(buy)
            if (buy.status != 0) {
                const $tr = document.createElement("tr");

                let $tdprice = document.createElement("td");
                var price = parseFloat(buy.tokens_payed_for_the_exchange_normalized / buy.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tdprice.textContent = price;
                $tdprice.style.color = "greenyellow"
                $tr.appendChild($tdprice);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(buy.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtotal);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(buy.tokens_payed_for_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtokenbo);

                let $tddate = document.createElement("td");
                $tddate.textContent = new Date(buy.timestamp).toLocaleTimeString()
                $tr.appendChild($tddate);
                // <tr
                $buyTable.appendChild($tr);




            }
        });

    });

    $.get("http://79.157.14.252:7000/txns/" + token2 + '-' + token1, function (data) {

        const sell = data.values.reverse().slice(0, 5);

        const $sellTable = document.querySelector("#sellTable");
        sell.forEach(sell => {

            if (sell.status != 0) {
                //<tr>
                // if(token_being_bought_symbol)
                const $tr = document.createElement("tr");

                let $tdprice = document.createElement("td");
                var price = parseFloat(sell.tokens_payed_for_the_exchange_normalized / sell.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tdprice.textContent = price;
                $tdprice.style.color = "red"
                $tr.appendChild($tdprice);

                let $tdtokenbo = document.createElement("td");
                $tdtokenbo.textContent = parseFloat(sell.tokens_bought_from_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtokenbo);

                let $tdtotal = document.createElement("td");
                $tdtotal.textContent = parseFloat(sell.tokens_payed_for_the_exchange_normalized).toFixed(8);
                $tr.appendChild($tdtotal);

                let $tddate = document.createElement("td");
                $tddate.textContent = new Date(sell.timestamp).toLocaleTimeString()
                $tr.appendChild($tddate);

                // <tr
                $sellTable.appendChild($tr);
            }
        });

    });

}


//chart



function getStats(token1, token2) {
    $.get("http://79.157.14.252:7000/txns/" + token1 + '-' + token2, function (data1) {
        //grafdata = [data1.stats]
        $.get("http://79.157.14.252:7000/historic/" + token1 + '-' + token2, function (data2) {
            console.log(data2.stats)
            console.log(grafdata)

            // var data = [
            //     [Date.UTC(2007, 07, 23), 23.55, 23.88, 23.38, 23.62],
            //     [Date.UTC(2007, 07, 24), 22.65, 23.7, 22.65, 23.36],
            //     [Date.UTC(2007, 07, 25), 22.75, 23.7, 22.69, 23.44],
            //     [Date.UTC(2007, 07, 26), 23.2, 23.39, 22.87, 22.92],
            //     [Date.UTC(2007, 07, 27), 23.98, 24.49, 23.47, 23.49],
            //     [Date.UTC(2007, 07, 30), 23.55, 23.88, 23.38, 23.62],
            //     [Date.UTC(2007, 07, 31), 23.88, 23.93, 23.24, 23.25],
            //     [Date.UTC(2007, 08, 01), 23.17, 23.4, 22.85, 23.25],
            //     [Date.UTC(2007, 08, 02), 22.65, 23.7, 22.65, 23.36],
            //     [Date.UTC(2007, 08, 03), 23.2, 23.39, 22.87, 22.92],
            //     [Date.UTC(2007, 08, 06), 23.03, 23.15, 22.44, 22.97],
            //     [Date.UTC(2007, 08, 07), 22.75, 23.7, 22.69, 23.44]
            //   ];
              
              

            //   chart = anychart.data.set(data);
              
            //   // create a japanese candlestick series and set the data
            //   var series = chart.candlestick(data);
              
            //   // set the container id
            //   chart.container("container");
              
            //   // initiate drawing the chart
            //   chart.draw();
            
            grafdata[0].date = new Date(grafdata[0].date).toLocaleTimeString()

            // var dataTable = anychart.data.table(0, 'MM, dd, yyyy');
            // dataTable.addData(grafdata);

            // // map data
            // var mapping = dataTable.mapAs({
            //     'open': 2,
            //     'high': 3,
            //     'low': 4,
            //     'close': 1
            // });

            // // set the chart type
            // var chart = anychart.stock();

            // // set the series
            // var series = chart.plot(0).candlestick(mapping);
            // series.name("Trade Data");

            // // set the chart title
            // chart.title("Historical Trade Data");

            // // create a plot
            // var plot = chart.plot(0);
            // // create an EMA indicator with period 20
            // var ema20 = plot.ema(mapping, 20).series();
            // // set the EMA color
            // ema20.stroke('orange');

            // // disable the scroller axis
            // chart.scroller().xAxis(false);
            // // map "open" values for the scroller
            // openValue = dataTable.mapAs();
            // openValue.addField('value', 2);
            // // create a scroller series with the mapped data
            // chart.scroller().column(openValue);

            // // modify the color of candlesticks making them black and white
            // series.fallingFill("#4EDA35");
            // series.fallingStroke("#4EDA35");
            // series.risingFill("red");
            // series.risingStroke("red");

            // // set the container id
            // chart.container('container');

            // //background
            // chart.background().fill("transparent");

            // // draw the chart
            // chart.draw();


        })
    })
}

anychart.onDocumentReady(function () {



    anychart.data.loadJsonFile("http://79.157.14.252:7000/historic/WETH-USDT", function (data) {

        // // load data
        // anychart.data.loadCsvFile(
        //   "https://static.anychart.com/git-storage/word-press/data/candlestick-chart-tutorial/EUR_USDHistoricalData2year.csv",
        //   function (data) {

        // create a data table

    });


});


setpairs("WETH", "USDT")