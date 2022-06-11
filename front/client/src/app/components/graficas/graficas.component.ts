import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  private intervalUpdate: any = null;
  public chart: any = null;
  public chart2: any = null;
  public chart4: any = null;

  constructor() {
  }


  gas: number;
  temperatura: number;
  humidity: number;

  ppm_co2: any = 0;
  ppm_co: any = 0;
  ppm_alcohol: any = 0;
  ppm_NH4: any = 0;
  ppm_tolueno: any = 0;
  ppm_acetone: any = 0;

  ngOnInit(): void {
    this.intervalUpdate = setInterval(function () {
      this.fill();
    }.bind(this), 1000);

    this.start();

    this.chart = new Chart('Altura', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Calidad el aire(ppm)',
            fill: false,
            data: [],
            backgroundColor: '#fff',
            borderColor: '#1AA43E'
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.chart2 = new Chart('Temperatura', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Temperatura (°C)',
            fill: false,
            data: [],
            backgroundColor: '#fff',
            borderColor: '#1AA43E'
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.chart4 = new Chart('PresionB', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Humedad del aire',
            fill: false,
            data: [],
            backgroundColor: '#727272',
            borderColor: '#1AA43E'
          }
        ]
      },
      options: {
        tooltips: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            fontColor: 'white'
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'white'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'white',
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  private ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
  }

  private fill(): void {
    let horaChart: any = new Date();
    horaChart = horaChart.getHours() + ':'
      + ((horaChart.getMinutes() < 10) ? '0' + horaChart.getMinutes() : horaChart.getMinutes()) + ':'
      + ((horaChart.getSeconds() < 10) ? '0' + horaChart.getSeconds() : horaChart.getSeconds());

    this.chart.data.labels.push(horaChart);
    this.chart2.data.labels.push(horaChart);
    this.chart4.data.labels.push(horaChart);


    if (this.chart.data.labels.length > 15) {
      this.chart.data.labels.shift();
      this.chart.data.datasets[0].data.shift();
      this.chart2.data.labels.shift();
      this.chart2.data.datasets[0].data.shift();
      this.chart4.data.labels.shift();
      this.chart4.data.datasets[0].data.shift();
    }
    this.chart.data.datasets[0].data.push(this.gas);
    this.chart2.data.datasets[0].data.push(this.temperatura);
    this.chart4.data.datasets[0].data.push(this.humidity);

    this.chart.update();
    this.chart2.update();
    this.chart4.update();
  }


  start() {
    const socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.device) {
        case 'MQ135':
          this.gas = data.data.gas - 450;
          this.co2(this.gas);
          this.co(this.gas);
          this.alcohol(this.gas);
          this.NH4(this.gas);
          this.Tolueno(this.gas);
          this.acetone(this.gas);
          break;
        case 'DH11':
          this.temperatura = data.data.temp;
          this.humidity = data.data.humidity;

          break;
        default:
          break;
      }
      console.log(data);

    };
    socket.onclose = () => {
    };
  }

  co2(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_co2 = (179.074 - 71.885 * (rs / r0)).toFixed(2);
  }

  co(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_co = (235.774 - 77.3198 * (rs / r0)).toFixed(2);
  }

  alcohol(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_alcohol = (182.8 - 92.0001 * (rs / r0)).toFixed(2);
  }

  NH4(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_NH4 = (146.107 - 46.1065 * (rs / r0)).toFixed(2);
  }


  Tolueno(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_tolueno = (159.103 - 141.732 * (rs / r0)).toFixed(2);
  }

  acetone(ppm) {
    var r0 = 176;
    var r2 = 1000;
    var volts = ppm * 5 / 1023;
    var rs = r2 * (1 - volts);
    rs = rs / volts;
    this.ppm_acetone = (159.6 - 133.33 * (rs / r0)).toFixed(2);
  }
}
