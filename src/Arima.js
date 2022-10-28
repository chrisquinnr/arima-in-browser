import * as CSV from "csv-string";
import { useState, useRef, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import logo from './logo.png' 
import { flatten } from "./libs/utils";
import { initArima, initChart } from "./libs/init";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const ARIMAPromise = require('arima/async');

const Arima = () => {
  const chartComponent = useRef(null);
  const [arimaOptions, setARIMAOptions] = useState(initArima);
  const [options, setChartOptions] = useState({});

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [useAuto, setUseAuto] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [horizon, setHorizon] = useState(12);
  
  useEffect(() => {
    if(!data.length) {
      return;
    }
    setChartOptions({ ...initChart, series: data });
    setAppLoaded(false);
  }, [data]);

  setTimeout(()=>{
    setAppLoaded(true);
  },1000)
  
  const handleArimaOptionsSubmit = (event) => {
    event.preventDefault();
    const { p, d, q, P, D, Q, s } = event.target.elements;
    setARIMAOptions({
      ...initArima,
      p: p.value,
      d: d.value,
      q: q.value,
      P: P.value,
      D: D.value,
      Q: Q.value,
      s: s.value,
    })
    setShowApply(false);
  }

  const handleArimaOptionsChange = (event)=>{
    event.preventDefault();
    const { id, value } = event.currentTarget;
    if(initArima[id] !== value) setShowApply(true);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setData(false);
    setAppLoaded(false);
    setLoading(true);
    const { csv } = event.target.elements;
    const flat = flatten(CSV.parse(csv.value));
    const checked = flat.map((b)=> +b.trim())
    
    if(!checked.length) return
    

    
    await ARIMAPromise.then(ARIMA => {
      // Important:
      // Here we set s value to length of timeseries supplied
      // This ensures the whole time series is sampled
      const options = useAuto ? { auto: true, verbose: false} : { ...arimaOptions, s: checked.length };
     
      const [pred] = new ARIMA(options).fit(checked).predict(horizon);
      console.log(pred)
      setData([{
        name: 'Prediction',
        data: checked.concat(pred)
      },
      {
        name: 'Order data',
        data: checked
      }]);
    })
  };

  const handleHorizonChange = (event) =>{
    event.preventDefault();
    setHorizon(event.target.value)
  }

  return (
    <div class="container h-100">
      <div class="row h-100">
        <section className="line-page col-sm" >
        <img src={logo}  alt=''/>
          {!appLoaded && (
            <div>
              <p>Loading...</p>
            </div>
          )}
          {appLoaded && (
            <>
              <form onSubmit={handleSubmit}>
                <p>🐉🐉🐉<br/><em>Here be dragons! This is a prototype - complex options or large datasets may cause timeouts</em></p>
                <p>Add your CSV data here</p>
                <Form.Group className="mb-3" controlId="horizon">
                  <Form.Label>Horizon</Form.Label>
                  <Form.Control type="number" defaultValue="12" name="newHorizon" onChange={(e)=>handleHorizonChange(e)} placeholder="Add horizon, e.g. 12" />
                  <Form.Text className="text-muted">
                    This is the number of timesteps ahead we'll forecast
                  </Form.Text>
                </Form.Group>

                <Form.Check 
                  type="switch"
                  id="useAuto"
                  label="Use auto options"
                  defaultChecked={useAuto}
                  onChange={() => setUseAuto(!useAuto)}
                />
                <Form.Text className="text-muted">
                  Auto is fastest, but often returns odd results when working with sparse datasets. The prediction can sometimes change between runs too.
                </Form.Text>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Data"
                  className="mb-3 mt-3"
                >
                <Form.Control 
                  name="csv" 
                  as="textarea" 
                  style={{ height: '100px' }} 
                  defaultValue="10, 37, 38, 23, 3, 34, 33, 32, 4, 26, 30, 5, 0, 22, 18, 8, 25, 2, 31, 7, 27, 29, 25, 38, 10, 33, 1, 31, 37, 37, 19, 26, 30, 25, 31, 32, 17, 28, 3, 13, 40, 16, 16, 13, 30, 13, 28, 34, 14, 3, 18, 35"
                />
                <Form.Text className="text-muted">
                    Paste comma-separated values, spaces are allowed.
                    By default we use the count of each value (52 in the placeholder data above) as the length of the sample to run predictions on. This ensures the whole dataset is considered a "season".
                </Form.Text>
              </FloatingLabel>
                <Button variant="primary" type="submit">
                  {loading ? 'Running...' : 'Go'}
                </Button>
              </form>
              
              {!useAuto && (
                <>
                  <form style={{ marginTop: 30 }} onSubmit={handleArimaOptionsSubmit}>
                    <Form.Group className="mb-3 col-xs-2" controlId="horizon">
                      {Object.keys(arimaOptions).map((k)=>
                        (
                          <>
                            {k !== 'verbose' ? <Form.Label key={k}>{k}<Form.Control type="number" id={k} name={k} defaultValue={arimaOptions[k]} onChange={(e)=>handleArimaOptionsChange(e)} /></Form.Label> : '' }
                          </>
                        )
                      )}
                      {showApply && 
                        <Button variant="secondary" type="submit">
                          Apply
                        </Button>
                      }
                    </Form.Group>
                  </form>
                  <p>
                    An ARIMA model has three component functions: 
                  </p>
                  <ul>
                    <li key="p">AR (p), the number of lag observations or autoregressive terms in the model;</li> 
                    <li key="d">I (d), the difference in the nonseasonal observations; </li>
                    <li key="q">and MA (q), the size of the moving average window.</li>
                  </ul>
                  <p>
                    An ARIMA model order is depicted as (p,d,q) with values for the order or number of times the function occurs in running the model. Values of zero are acceptable.
                    The “AR” in ARIMA stands for autoregression, indicating that the model uses the dependent relationship between current data and its past values. In other words, it shows that the data is regressed on its past values.
                    The “I” stands for integrated, which means that the data is stationary. Stationary data refers to time-series data that’s been made “stationary” by subtracting the observations from the previous values.
                    The “MA” stands for moving average model, indicating that the forecast or outcome of the model depends linearly on the past values. Also, it means that the errors in forecasting are linear functions of past errors. Note that the moving average models are different from statistical moving averages.
                  </p>
                </>
              )}

            </>
          )}
        </section>
        <section className="line-page col-lg bg-light">
            {(appLoaded && !!data.length) ? (
              <section>
                <HighchartsReact ref={chartComponent} highcharts={Highcharts} options={options} />
              </section>
            ): <div className="jumbotron jumbotron-fluid">
                <div className="">
                  <p className="text-muted position-static">Enter your data on left, the series &amp; predictions will appear here</p>
                </div>
              </div>}
          </section>
      </div>
    </div>
  );
};

export default Arima;
