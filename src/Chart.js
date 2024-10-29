// split rate of return before and after retirement
//  show  adjusted retirement income for inflation under today's dollars
// make inflationa slider
//  show change in post retirement income from  inflation when moving chart
// anticipated inherittace feature



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
    const [averageInflationValue, setAverageInflationValue] = useState(1); // Initial intrest rate value
    const [ageValue, setAgeValue] = useState(''); // Initial age value
    const [retirementAgeValue, setRetirementAgeValue] = useState(''); // Initial retirement age value
    const [deathAgeValue, setDeathAgeValue] = useState(''); // Initial retirement age value
    const [initialInvestmentValue, setInitialInvestmentValue] = useState(''); // Initial Investment value
    const [monthlyContibutionsValue, setMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [retirementSalaryValue, setRetirementSalaryValue] = useState(''); // monthlybudget after retirement

    function calculateMonthlyContribution(
      initialInvestment,
      annualInterestRate,
      inflationRate,
      currentAge,
      retirementAge,
      ageOfDeparture,
      monthlyWithdrawal
  ) {
      const yearsUntilRetirement = (retirementAge - currentAge);
      const withdrawalDuration = (ageOfDeparture - retirementAge);
      const yearlyWithdrawl = monthlyWithdrawal *12
  
      // Convert rates to decimals
      const actualAnnualInterestRate = annualInterestRate / 100;
  
      // Future value of initial investment at retirement
      const futureValueAtRetirement = initialInvestment * Math.pow(1 + actualAnnualInterestRate, yearsUntilRetirement);
      const adjustedFutureValue = futureValueAtRetirement / Math.pow(1 + averageInflationValue/100, yearsUntilRetirement);

      // Adjusted withdrawal amount considering inflation
      const adjustedWithdrawal = yearlyWithdrawl * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);
      //interest after retirement
      let interestEarned = 0;
      let  yearlyValue = adjustedFutureValue
        for (var i = 0 ; i<withdrawalDuration; i++){
          interestEarned += (yearlyValue * (1 + actualAnnualInterestRate)-yearlyValue);
          if(yearlyValue -adjustedWithdrawal<=0)
            break;
          else{
            yearlyValue += (yearlyValue * (1 + actualAnnualInterestRate)-yearlyValue);
            yearlyValue -= adjustedWithdrawal;
          }
      }
      let start  = adjustedWithdrawal;
      for (var i = 1 ; i<withdrawalDuration; i++){
        start += adjustedWithdrawal - start/(1 + actualAnnualInterestRate)
      }
      // Present value of withdrawals needed at retirement
      const presentValueWithdrawals = adjustedWithdrawal * withdrawalDuration;
  
      // Amount still needed after accounting for future value of initial investment
      const amountNeeded = start - adjustedFutureValue;
      const presentValue = adjustedWithdrawal * (1 - Math.pow(1 + actualAnnualInterestRate, -withdrawalDuration)) / actualAnnualInterestRate;

    // Calculate the remaining amount needed
    const remainingAmount = presentValue - adjustedFutureValue;

    // Monthly interest rate and total number of payments
    const monthlyInterestRate = actualAnnualInterestRate / 12;
    const totalPayments = yearsUntilRetirement * 12;

    // Calculate the monthly investment needed
    const adjustedAmount = remainingAmount * Math.pow(1 + averageInflationValue/100, yearsUntilRetirement);
    const monthlyInvestment = (adjustedAmount * monthlyInterestRate) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  
      setMonthlyContributionsValue( monthlyInvestment > 0 ? monthlyInvestment : 0); // Ensure no negative contributions
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
  

    function calculateCompoundInterest(initialInvestment, annualInterestRate, years,monthlyContribution) {

    // Step 1: Calculate the future value of the initial investment
    const futureValueInitial = initialInvestment * Math.pow(1 + annualInterestRate/100, years);
    
    // Step 2: Calculate the future value of the monthly contributions
    const monthlyRate = annualInterestRate/100 / 12;
    const totalMonths = years * 12;
    
    const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    // Step 3: Calculate the total future value
    const totalFutureValue = futureValueInitial + futureValueContributions;
    
    // Step 4: Adjust for inflation
    const adjustedFutureValue = totalFutureValue / Math.pow(1 + averageInflationValue/100, years);
    
    return adjustedFutureValue;

    }

    function calculateCompoundInterestAfterRetirement(annualInterestRate, YearsBeforeRetirement, previousInvestment, annualInflationRate, monthlyWithdrawal) {
      
    // Convert annual rates to decimals
    const r = annualInterestRate / 100;  // Convert to decimal
    const i = annualInflationRate / 100; // Convert to decimal

    // Calculate the adjusted monthly withdrawal amount
    const adjustedWithdrawals = monthlyWithdrawal * Math.pow(1 + i, YearsBeforeRetirement);

    // Calculate the total amount after interest for the year
    const totalAfterInterest = previousInvestment * (1 + r);
    // Adjust for inflation
  const adjustedFutureValue = totalAfterInterest / Math.pow(1 + i, 1);
    // Total withdrawals for the year
    const totalWithdrawals = adjustedWithdrawals * 12; // 12 months

    // Calculate the amount left at the end of the year
    const amountLeft = totalAfterInterest - totalWithdrawals;

    return amountLeft;
    }
    // if(adjustedValue<0){
    //   adjustedValue = 0;
    //   isEnough = false;
    // }
    // else
    //   isEnough = true;
    //   return adjustedValue;
    // }
    
    const generateData = (count, initialInvestment, age, retirementAge, intrestRate, monthlyContibutions, inflation,monthlybudget) => {

      const data = [];
      for (let i = 0; i <= count; i++) {
        if(i > (retirementAge -  age)){
          data.push(calculateCompoundInterestAfterRetirement(intrestRate,(retirementAge-age),data[i-1],inflation,monthlybudget));
          continue;
        }
        data.push(calculateCompoundInterest(initialInvestment,intrestRate,i,monthlyContibutions));
      }
      return data;
    };
  
    // Generate initial data
    const getData = generateData(deathAgeValue-ageValue, initialInvestmentValue, ageValue, retirementAgeValue, intrestRateValue, monthlyContibutionsValue,averageInflationValue,retirementSalaryValue);
  
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
                <Form.Label>Average Rate of Return:</Form.Label>
                <Form.Control
                  type="range"
                  min="1"
                  max="10"
                  value={intrestRateValue}
                  onChange={(e) => setIntrestRateValue(Number(e.target.value.replace(/^0+(?!$)/, '')))}
                />
                <Form.Text className="text-muted">
                  {intrestRateValue}
                </Form.Text>
                </Row>
                <Row>
                <Form.Label>Value of Current Retirement Investment:</Form.Label>
                <Form.Control
                  type="number"
                  value={initialInvestmentValue}
                  onChange={(e) => setInitialInvestmentValue(Number(e.target.value.replace(/^0+(?!$)/, '')))} required
                />
                </Row>
                <Row>
                <Form.Label>Inflation Rate:</Form.Label>
                <Form.Control
                  type="number"
                  value={averageInflationValue}
                  onChange={(e) => setAverageInflationValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Current Age:</Form.Label>
                <Form.Control
                  type="number"
                  value={ageValue}
                  onChange={(e) => setAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Retirement Age:</Form.Label>
                <Form.Control
                  type="number"
                  value={retirementAgeValue}
                  onChange={(e) => setRetirementAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Date of Departure:</Form.Label>
                <Form.Control
                  type="number"
                  value={deathAgeValue}
                  onChange={(e) => setDeathAgeValue(Number(e.target.value))} required
                />
                </Row>
                <Row>
                <Form.Label>Gross Monthly  Retirement Income:</Form.Label>
                <Form.Control
                  type="number"
                  value={retirementSalaryValue}
                  onChange={(e) => setRetirementSalaryValue(Number(e.target.value))} required
                />
                </Row>
              </Form.Group>
              <button type="submit">Calculate Monthly Payment</button>
              
      {monthlyContibutionsValue !== null && (
        <h2>Monthly Investment Required: ${monthlyContibutionsValue.toFixed(2)}</h2>
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
                      return `FIN: $${value.toFixed(2)}`;
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