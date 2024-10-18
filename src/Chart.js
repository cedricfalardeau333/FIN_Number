
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
    const [ageValue, setAgeValue] = useState(25); // Initial age value
    const [retirementAgeValue, setRetirementAgeValue] = useState(65); // Initial retirement age value
    const [deathAgeValue, setDeathAgeValue] = useState(85); // Initial retirement age value
    const [initialInvestmentValue, setInitialInvestmentValue] = useState(50000); // Initial Investment value
    const [monthlyContibutionsValue, setMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [retirementSalaryValue, setRetirementSalaryValue] = useState(2000); // monthlybudget after retirement

    function calculateMonthlyContribution(
      initialInvestment,
      annualInterestRate,
      inflationRate,
      currentAge,
      retirementAge,
      ageOfDeparture,
      monthlyWithdrawal
  ) {
      const monthsUntilRetirement = (retirementAge - currentAge) * 12;
      const withdrawalDuration = (ageOfDeparture - retirementAge) * 12;
  
      // Convert rates to decimals
      const monthlyInterestRate = annualInterestRate / 100 / 12;
      const monthlyInflationRate = inflationRate / 100 / 12;
  
      // Future value of initial investment at retirement
      const futureValueAtRetirement = initialInvestment * Math.pow(1 + monthlyInterestRate, monthsUntilRetirement);
  
      // Adjusted monthly withdrawal amount considering inflation
      const adjustedWithdrawal = monthlyWithdrawal * Math.pow(1 + inflationRate / 100, retirementAge - currentAge);
  
      // Present value of withdrawals needed at retirement
      const presentValueWithdrawals = adjustedWithdrawal * (1 - Math.pow(1 + monthlyInterestRate, -withdrawalDuration)) / monthlyInterestRate;
  
      // Amount still needed after accounting for future value of initial investment
      const amountNeeded = presentValueWithdrawals - futureValueAtRetirement;
  
      // Monthly contribution required to reach the needed amount
      const monthlyContribution = amountNeeded * monthlyInterestRate / (Math.pow(1 + monthlyInterestRate, monthsUntilRetirement) - 1);
  
      setMonthlyContributionsValue( monthlyContribution > 0 ? monthlyContribution : 0); // Ensure no negative contributions
  }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      calculateMonthlyContribution(
        initialInvestmentValue,
          intrestRateValue,
          averageInflationValue,
          ageValue,
          retirementAgeValue,
          deathAgeValue,
          retirementSalaryValue
      );
    };
  

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
      
      const amount = principal * Math.pow((1 + r),t);
      const interest = amount - principal;

      let A = (P * Math.pow((1 + r), t) +
      PMT * ((Math.pow((1 + r / n), (n * t)) - 1) / (r / n)))
      /(Math.pow(1+(averageInflationValue/100), t)); //adjust for inflation
    
      return  A.toFixed(2)

    }

    function calculateCompoundInterestAfterRetirement(annualInterestRate, time, previousTotal) {
      // Validate input
      if (annualInterestRate <= 0 || time < 0) {
        throw new Error('All inputs must be positive numbers.');
      }
    
    // Convert rates to decimal
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const monthlyInflationRate = averageInflationValue / 100 / 12;

    // Calculate total amount after 12 months with monthly compounding interest
    let totalWithInterest = previousTotal;
    for (let i = 0; i < 12; i++) {
        totalWithInterest *= (1 + monthlyInterestRate);
    }

    // Calculate adjusted spending for inflation over 12 months
    let totalSpending = 0;
    for (let i = 0; i < 12; i++) {
        totalSpending += retirementSalaryValue * Math.pow(1 + monthlyInflationRate, i);
    }

    // Adjust the total for inflation-adjusted spending
    let adjustedTotal = totalWithInterest - totalSpending;

    if(adjustedTotal<0){
      adjustedTotal = 0;
      isEnough = false;
    }
    else
      isEnough = true;
      return adjustedTotal.toFixed(2)
    }
    
    const generateData = (count, initialInvestment, age, retirementAge, intrestRate, monthlyContibutions) => {
      console.log(count)
      console.log(initialInvestment)
      console.log(age)
      console.log(retirementAge)
      console.log(intrestRate)
      console.log(monthlyContibutions)

      const data = [];
      for (let i = 0; i <= count; i++) {
        if(i > (retirementAge -  age)){
          data.push(calculateCompoundInterestAfterRetirement(intrestRate,i,data[i-1]));
          continue;
        }
        data.push(calculateCompoundInterest(initialInvestment,intrestRate,i,12,monthlyContibutionsValue));
      }
      return data;
    };
  
    // Generate initial data
    const getData = generateData(deathAgeValue-ageValue, initialInvestmentValue, ageValue, retirementAgeValue, intrestRateValue, monthlyContibutionsValue);
  
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
    }, [ageValue,retirementAgeValue,deathAgeValue,initialInvestmentValue,intrestRateValue,retirementSalaryValue,averageInflationValue,monthlyContibutionsValue]);
    useEffect(() => {setMonthlyContributionsValue(null)},[ageValue,retirementAgeValue,deathAgeValue,initialInvestmentValue,intrestRateValue,retirementSalaryValue,averageInflationValue])
  
    return (
      <Container>
                <Row>
          <Col>
            <h2>Investometer</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="form">
                <Row>
                <Form.Label>Average Interest Rate:</Form.Label>
                <Form.Control
                  type="range"
                  min="1"
                  max="10"
                  value={intrestRateValue}
                  onChange={(e) => setIntrestRateValue(Number(e.target.value))}
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
                  onChange={(e) => setInitialInvestmentValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Average Inflation:</Form.Label>
                <Form.Control
                  type="text"
                  value={averageInflationValue}
                  onChange={(e) => setAverageInflationValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Current Age:</Form.Label>
                <Form.Control
                  type="text"
                  value={ageValue}
                  onChange={(e) => setAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Retirement Age:</Form.Label>
                <Form.Control
                  type="text"
                  value={retirementAgeValue}
                  onChange={(e) => setRetirementAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Age of Death:</Form.Label>
                <Form.Control
                  type="text"
                  value={deathAgeValue}
                  onChange={(e) => setDeathAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Retirement Salary:</Form.Label>
                <Form.Control
                  type="text"
                  value={retirementSalaryValue}
                  onChange={(e) => setRetirementSalaryValue(Number(e.target.value))} required
                />
                </Row>
              </Form.Group>
              <button type="submit">Calculate Monthly Payment</button>
              
      {monthlyContibutionsValue !== null && (
        <h2>Monthly Payment Needed: ${monthlyContibutionsValue.toFixed(2)}</h2>
      )}
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