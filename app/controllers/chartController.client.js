'use strict';

(function () {
  var ctx = document.getElementById('stock-chart').getContext('2d');
  var data = {
    labels: [],
    datasets: [{
      label: "AMZN",
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
      lineTension: 0,
      fill: false,
    }]
  };
  // var data;
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', '/common/mock.json', function (response) {
    var parsedResponse = JSON.parse(response);
    data.datasets[0].data = parsedResponse.dataset_data.data.map(function (item) {
      data.labels.push(item[0])
      return {
        x: item[0],
        y: item[1]
      }
    });
    initChart(data);
  }));
  function initChart (data) {
    var stockChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
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
          intersect: false
        }
      }
    })
  }

})();