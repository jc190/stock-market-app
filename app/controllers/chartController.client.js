'use strict';

(function () {
  var socket = io.connect(window.location.href);
  var ctx = document.getElementById('stock-chart').getContext('2d');

  var palette = ['rgb(255, 0, 41)', 'rgb(55, 126, 184)', 'rgb(102, 166, 30)', 'rgb(152, 78, 163)', 'rgb(0, 210, 213)', 'rgb(255, 127, 0)'];

  Chart.defaults.global.elements.point.radius = 0;

  var chart = initChart();
  reloadChart(chart, addCloseButtons);

  socket.on('reloadChart', function () {
    reloadChart(chart, addCloseButtons);
  });

  function initChart () {
    var options = {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 32,
          bottom: 32
        }
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: 'series',
          ticks: {
            source: 'auto'
          },
          time: {
            unit: 'month'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Closing price ($)'
          }
        }]
      },
      tooltips: {
        enabled: true,
        intersect: false
      }
    };
    var data = {
      labels: [],
      datasets: []
    };
    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
  }

  function reloadChart (chart, cb) {
    $('.loader').addClass('active');
    $('#chartLabels').empty();
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', '/stocks', function (response) {
      var parsedResponse = JSON.parse(response);
      var stockData;
      console.log(parsedResponse)
      chart.data.datasets = parsedResponse.stocks.map(function (stock, i) {
        stockData = stock.data.map(function (d) {
          return {
            x: d[0],
            y: d[1]
          }
        });
        $('#chartLabels').append(
          `
          <div class="col-sm-4">
            <div class="card shadow-level--1">
              <div class="card-color--side" style="background-color: ${palette[i]};"></div>
              <div class="card-body">
                <button class="close close-stock" type="button" data-symbol="${stock.symbol}">
                  <span>&times;</span>
                </button>
                <h5 class="title">${stock.symbol}</h5>
                <p class="text-muted">${stock.name}</p>
              </div>
            </div>
          </div>
          `
        )
        return {
          label: stock.symbol,
          lineTension: 0,
          fill: false,
          backgroundColor: palette[i],
          borderColor: palette[i],
          data: stockData
        }
      })
      chart.update();
      if (cb) {
        cb();
      }
    }));
  }

  function addCloseButtons () {
    var closeButtons = document.querySelectorAll('.close-stock');

    for(var i = 0; i < closeButtons.length; i++) {
      closeButtons[i].addEventListener('click', function (e) {
        e.preventDefault();
        $('.loader').addClass('active');
        var url = 'http://localhost:3000/stocks?s=' + this.dataset.symbol
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('DELETE', url, function(response) {
          response = JSON.parse(response);
          if (response.error) {
            toastr.error(response.error);
          }
          if (response.ok) {
            toastr.success(response.ok);
          }
        }));
      });
    }
    $('.loader').removeClass('active');
  }

})();