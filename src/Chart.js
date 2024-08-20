
import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col, Form } from 'react-bootstrap';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(
  ChartDataLabels
);

const RealTimeGraph = () => {
  const currentcyFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  
    let isEnough = false; // If the FIN is high enough to support lifestyle without going broke
    const [intrestRateValue, setIntrestRateValue] = useState(5); // Initial intrest rate value
    const [averageInflationValue, setAverageInflationValue] = useState(2.67); // Initial intrest rate value
    const [ageValue, setAgeValue] = useState(18); // Initial age value
    const [retirementAgeValue, setRetirementAgeValue] = useState(65); // Initial retirement age value
    const [deathAgeValue, setDeathAgeValue] = useState(85); // Initial retirement age value
    const [initialInvestmentValue, setInitialInvestmentValue] = useState(50000); // Initial Investment value
    const [monthlyContibutionsValue, setMonthlyContributionsValue] = useState(100); // Initial Investment value
    const [retirementSalaryValue, setRetirementSalaryValue] = useState(50000); // Initial Investment value

    function calculateCompoundInterest(principal, rate, time, compoundingFreq,PMT) {
      // Validate input
      if (rate <= 0 || time < 0 || compoundingFreq <= 0) {
        throw new Error('All inputs must be positive numbers.');
      }
    
      // Calculate compound interest
      const n = compoundingFreq;
      const r = rate / 100; // Convert rate percentage to decimal
      const t = time;
      const P = principal;
      
      const amount = principal * Math.pow((1 + r / n), n * t);
      const interest = amount - principal;

      let A = (P * Math.pow((1 + r / n), (n * t)) +
      PMT * ((Math.pow((1 + r / n), (n * t)) - 1) / (r / n)))
      /(Math.pow(1+(averageInflationValue/100), t)); //adjust for inflation
    
      return {
        principal: principal,
        rate: rate,
        time: time,
        compoundingFreq: compoundingFreq,
        amount: A.toFixed(2),
        interest: interest.toFixed(2)
      };
    }

    function calculateCompoundInterestAfterRetirement(principal, rate, time, compoundingFreq, previousYearTotal) {
      // Validate input
      if (rate <= 0 || time < 0 || compoundingFreq <= 0) {
        throw new Error('All inputs must be positive numbers.');
      }
    
      // Calculate compound interest
      const n = compoundingFreq;
      const r = rate / 100; // Convert rate percentage to decimal

      //use the previous years total minus your yearly post retirement spending and go per year hence the *1 at the end since we are using the previous years total
      // and not the initial total multiplied by time
      let amountAfterRetiring = (previousYearTotal-retirementSalaryValue) * Math.pow((1 + r / n), n * 1);
    if(amountAfterRetiring<0){
      amountAfterRetiring = 0;
      isEnough = false;
    }
    else
      isEnough = true;
      return {
        principal: principal,
        rate: rate,
        time: time,
        compoundingFreq: compoundingFreq,
        amountAfterRetiring: amountAfterRetiring.toFixed(2),
      };
    }
    

    // Function to generate data based on slider value
    const generateData = (count, initialInvestment, age, retirementAge, intrestRate, monthlyContibutions) => {
      const data = [];
      for (let i = 0; i <= count; i++) {
        if(i > (retirementAge -  age)){
          data.push(calculateCompoundInterestAfterRetirement(initialInvestment,intrestRate,i,12,data[i-1]).amountAfterRetiring);
          continue;
        }
        data.push(calculateCompoundInterest(initialInvestment,intrestRate,i,12,monthlyContibutions).amount);
      }
      console.log(data)
      return data;
    };
  
    // Generate initial data
    const getData = generateData(deathAgeValue-ageValue, initialInvestmentValue, ageValue, retirementAgeValue, intrestRateValue,monthlyContibutionsValue);
  
    // Chart data and options
    const [chartData, setChartData] = useState({
      labels: Array.from({ length: deathAgeValue + 1 - ageValue }, (_, i) => i + ageValue),
      datasets: [
        {
          NumberFormat:currentcyFormat.format,
          label: 'Total Growth',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#E61313',
          borderColor: '#29A3FF',
          borderCapStyle: 'round',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#E61313',
          pointBackgroundColor: '#E61313',
          pointBorderWidth: 1,
          pointHoverRadius: 20,
          pointHoverBackgroundColor: '#E61313',
          pointHoverBorderColor: '#29A3FF',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: getData,
        },
      ],
    });

    useEffect(() => {
      setChartData({
        labels: Array.from({ length: deathAgeValue + 1 - ageValue }, (_, i) => i + ageValue),
        datasets: [
          {
            NumberFormat:currentcyFormat.format,
            label: 'Total Growth',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#29A3FF',
            borderColor: '#29A3FF',
            borderCapStyle: 'round',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#E61313',
            pointBackgroundColor: '#29A3FF',
            pointBorderWidth: 1,
            pointHoverRadius: 20,
            pointHoverBackgroundColor: '#E61313',
            pointHoverBorderColor: '#29A3FF',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: getData,
          },
        ],
      })
    }, [ageValue,retirementAgeValue,deathAgeValue,initialInvestmentValue,intrestRateValue,monthlyContibutionsValue,retirementSalaryValue,averageInflationValue]);
    
  
    // Update chart data when slider value changes
    // const handleSliderChange = (event) => {
    //   const value = parseInt(event.target.value, 10) || "";
    //   setSliderValue(value);
    //   const newData = generateData(retirementAgeValue-ageValue, initialInvestmentValue);
    //   setChartData({
    //     labels: Array.from({ length: retirementAgeValue + 1  - ageValue }, (_, i) => i + ageValue),
    //     datasets: [
    //       {
    //         ...chartData.datasets[0], // Keep other dataset properties unchanged
    //         data: newData,
    //       },
    //     ],
    //   });
    // };

    const handleInitialInvestmentChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setInitialInvestmentValue(value);
    };

    const handleMonthlyContributionsChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setMonthlyContributionsValue(value);
    };

    const handleIntrestRateChange = (event) => {
      const value = parseInt(event.target.value, 10) || 1;
      setIntrestRateValue(value);
    };
    
    const handleAverageInflationChange = (event) => {
      const value = event.target.value || "";
      setAverageInflationValue(value);
    };

    const handleAgeChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setAgeValue(value);
    };
  
    const handleRetirementAgeChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setRetirementAgeValue(value);
    };
    const handleDeathAgeChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setDeathAgeValue(value);
    };
    const handleRetirementSalaryChange = (event) => {
      const value = parseInt(event.target.value, 10) || "";
      setRetirementSalaryValue(value);
    };
    return (
      <Container>
        <Row>
          <Col>
            <h2>Investometer</h2>
            <Form>
              <Form.Group controlId="form">
                <Row>
                <Form.Label>Average Interest Rate:</Form.Label>
                <Form.Control
                  type="range"
                  min="1"
                  max="10"
                  value={intrestRateValue}
                  onChange={handleIntrestRateChange}
                />
                <Form.Text className="text-muted">
                  {intrestRateValue}
                </Form.Text>
                </Row>
                <Row>
                <Form.Label>Initial Investment:</Form.Label>
                <Form.Control
                  type="text"
                  value={initialInvestmentValue}
                  onChange={(e) => handleInitialInvestmentChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Average Inflation:</Form.Label>
                <Form.Control
                  type="text"
                  value={averageInflationValue}
                  onChange={(e) => handleAverageInflationChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Current Age:</Form.Label>
                <Form.Control
                  type="text"
                  value={ageValue}
                  onChange={(e) => handleAgeChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Retirement Age:</Form.Label>
                <Form.Control
                  type="text"
                  value={retirementAgeValue}
                  onChange={(e) => handleRetirementAgeChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Age of Death:</Form.Label>
                <Form.Control
                  type="text"
                  value={deathAgeValue}
                  onChange={(e) => handleDeathAgeChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Monthly Contributions:</Form.Label>
                <Form.Control
                  type="text"
                  value={monthlyContibutionsValue}
                  onChange={(e) => handleMonthlyContributionsChange(e)}
                />
                </Row>
                <Row>
                <Form.Label>Retirement Salary:</Form.Label>
                <Form.Control
                  type="text"
                  value={retirementSalaryValue}
                  onChange={(e) => handleRetirementSalaryChange(e)}
                />
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Line
              data={chartData}
              options={{
                scales: {
                  y: {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                },
                plugins:{
                  datalabels:{
                    color:isEnough?'green':'red',
                    display: function(context){
                      return (context.dataIndex === retirementAgeValue-ageValue)
                    },
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => {
                      return `FIN: $${value}`;
                    },
                  }
                }
              }}
            />
          </Col>
        </Row>
      </Container>
    );
  };
  
export default RealTimeGraph;