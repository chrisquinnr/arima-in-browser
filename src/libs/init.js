export const initChart = {
    title: {
      text: "Prediction",
    },
    xAxis: {
      labels:   {
        enabled: false
      },
      text: false,
    },
    yAxis: {
      title: {
        text:  "Y-Axis",
      },
    },
    series: [],
    navigation: {
      buttonOptions: {
          theme: {
              // Good old text links
              style: {
                  color: '#039',
                  textDecoration: 'underline'
              }
          }
      }
    },
    exporting: {
      buttons: {
          contextButton: {
              enabled: false
          },
          exportButton: {
              text: 'Download',
              // Use only the download related menu items from the default
              // context button
              menuItems: [
                  'downloadPNG',
                  'downloadJPEG',
                  'downloadPDF',
                  'downloadSVG'
              ]
          }
      }
    },
    theme: {
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
                 '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                ]
            },
        },
        title: {
            style: {
                color: '#000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            style: {
                color: '#666666',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle:{
                color: 'gray'
            }
        }
    }
  };
  
  export const initArima = {
    p: 2,
    d: 1,
    q: 1,
    P: 1,
    D: 0,
    Q: 1,
    s: 52,
    verbose: false,
    method: 0, // ARIMA method (Default: 0)
    optimizer: 6, // Optimization method (Default: 6)
  };
  