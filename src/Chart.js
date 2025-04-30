// DONE -----------split rate of return before and after retirement
// DONE -----------show  adjusted retirement income for inflation under today's dollars
// DONE -----------make inflationa slider
// DONE -----------show change in post retirement income from  inflation when moving chart
// PARTLY DONE -- need to adjust monthly contributions calculations -------------anticipated inherittace feature
// DONE ------------Larger thicker graph lines, perhaps a coloured background?
// DONE ------------Bottom line should range from 18 to 99 and fixed
// DONE ------------Title on top FIN#
// DONE ------------All figures need comas. $1,234,000 not 1234000
// DONE ------------What is the future balance at date of departure? The graph should end there not at 0
// CONFLICTING WITH PREVIOUS --- Value son left side need to remain constant not change with calculations
// DONE ------------Make everything fit on one page. No need to scroll the page up and down
// DONE ------------Does the monthly retirement income factor in inflation?

//---Revision 2

// DONE ------------ Remove the negative amounts option, should only be as low as zero

// DONE ------------ Not sure why its asking for the monthly investment field to be filled out

// ? ---------------Not sure but I think the formulas are not accurately calculating stuff

// DONE ------------Can we show the existing pac if they have one and how it will not , in most cases, fulfil the needs

// YES -------------Does the monthly retirement income factor inflation?

// DONE ------------Add commas in money values

// DONE ------------ auto update for monthly investment

// DONE ------------- Bigger Fin number

// DONE ------------- move inheritance close in

// DONE ------------- add current monthly investments seprate from the needed monthly investment

// add an option to reduce desired retirmement income at selected age


import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ChartAnnotation from 'chartjs-plugin-annotation';
import { Range } from 'react-range';
import './investometer.css';
import CurrencyInput from 'react-currency-input-field';

Chart.register(
    ChartDataLabels,
    ChartAnnotation
);

const RealTimeGraph = () => {



    let isEnough = false; // If the FIN is high enough to support lifestyle without going broke
    const [postInterestRateValue, setPostInterestRateValue] = useState(5); // Initial intrest rate value
    const [preInterestRateValue, setPreInterestRateValue] = useState(5); // Initial intrest rate value
    const [averageInflationValue, setAverageInflationValue] = useState(2); // Initial intrest rate value
    const [ageValue, setAgeValue] = useState(18); // Initial age value
    const [retirementAgeValue, setRetirementAgeValue] = useState(65); // Initial retirement age value
    const [deathAgeValue, setDeathAgeValue] = useState(85); // Initial retirement age value
    const [initialInvestmentValue, setInitialInvestmentValue] = useState(100000); // Initial Investment value
    const [monthlyContibutionsValue, setMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [currentMonthlyContibutionsValue, setCurrentMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [retirementSalaryValue, setRetirementSalaryValue] = useState(2000); // monthlybudget after retirement
    const [inheritanceIsCollapsed, setInheritanceIsCollapsed] = useState(true); // State to track if inheritance collapsed
    const [midRetirementChangeIsCollapsed, setMidRetirementChangeIsCollapsed] = useState(true); // State to track if inheritance collapsed
    const [anticipatedInheritanceValue, setAnticipatedInheritanceValue] = useState(0); // Inheritance value 
    const [inheritanceAgeValue, setInheritanceAgeValue] = useState(0); // Inheritance Age
    const [newRetirementIncomeValue, setNewRetirementIncomeValue] = useState(0); // Inheritance value 
    const [newRetirementIncomeAgeValue, setNewRetirementIncomeAgeValue] = useState(0); // Inheritance Age
    const [ageValues, setageValues] = useState([18, 65, 85]); // low, middle, high values

    const FormatCurrency = (value) => {
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
        return formattedValue;
    };

    const handleChange = (ageValues) => {
        setageValues(ageValues); // Update the state when slider handles move
        setAgeValue(ageValues[0]);
        setRetirementAgeValue(ageValues[1]);
        setDeathAgeValue(ageValues[2]);
    };

    function calculateMonthlyContribution(
        initialInvestment,
        preInterestRate,
        postInterestRate,
        inflationRate,
        currentAge,
        retirementAge,
        ageOfDeparture,
        monthlyWithdrawal,
        ageOfInheritance,
        valueOfInheritance
    ) {
        const yearsUntilRetirement = (retirementAge - currentAge);
        const withdrawalDuration = (ageOfDeparture - retirementAge);
        const yearlyWithdrawl = monthlyWithdrawal * 12

        // Convert rates to decimals
        const preAnnualInterestRate = preInterestRate / 100;
        const postAnnualInterestRate = postInterestRate / 100;
        const actualAnnualInflationRate = inflationRate / 100;
        // Initialise total future value
        let totalFutureValueAtRetirement = initialInvestment * Math.pow(1 + preAnnualInterestRate, yearsUntilRetirement);
        let adjustedFutureValue = totalFutureValueAtRetirement / Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);

        if(ageOfInheritance>=currentAge){
            // Calculate the future value of the inheritance from the inheritance year to retirement
            const futureValueOfInheritance = valueOfInheritance * Math.pow(1 + preAnnualInterestRate, retirementAge-ageOfInheritance);
            //adjust inheritanmce for inflation
            const adjustedInheritanceFutureValue = futureValueOfInheritance / Math.pow(1 + actualAnnualInflationRate, retirementAge-ageOfInheritance);


            // Add the inheritance to the future falue
            adjustedFutureValue = adjustedFutureValue + adjustedInheritanceFutureValue;
        }
       
 console.log(adjustedFutureValue)
        // Adjusted withdrawal amount considering inflation
        const adjustedWithdrawal = yearlyWithdrawl * Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);

        // Amount still needed after accounting for future value of initial investment
        const presentValueWithInterest = adjustedWithdrawal * (1 - Math.pow(1 + postAnnualInterestRate, -withdrawalDuration)) / postAnnualInterestRate;
        // Calculate the remaining amount needed
        const remainingAmount = presentValueWithInterest - adjustedFutureValue;

        // Monthly interest rate and total number of payments
        const monthlyInterestRate = preAnnualInterestRate / 12;
        const totalPayments = yearsUntilRetirement * 12;

        // Calculate the monthly investment needed
        const adjustedAmount = remainingAmount * Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);
        const monthlyInvestment = (adjustedAmount * monthlyInterestRate) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);


        setMonthlyContributionsValue(monthlyInvestment > 0 ? monthlyInvestment.toFixed(2) : 0); // Ensure no negative contributions
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateMonthlyContribution(
            initialInvestmentValue,
            preInterestRateValue,
            postInterestRateValue,
            averageInflationValue,
            ageValue,
            retirementAgeValue,
            deathAgeValue,
            retirementSalaryValue,
            inheritanceAgeValue,
            anticipatedInheritanceValue
        );
    };


    function calculateCompoundInterest(initialInvestment, annualInterestRate, years, monthlyContribution, inflationValue, age) {

        if (years + age < inheritanceAgeValue || inheritanceAgeValue < age) {
            // Step 1: Calculate the future value of the initial investment
            const futureValueInitial = initialInvestment * Math.pow(1 + annualInterestRate / 100, years);

            // Step 2: Calculate the future value of the monthly contributions
            const monthlyRate = annualInterestRate / 100 / 12;
            const totalMonths = years * 12;

            const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

            // Step 3: Calculate the total future value
            const totalFutureValue = futureValueInitial + futureValueContributions;

            // Step 4: Adjust for inflation
            let adjustedFutureValue = totalFutureValue / Math.pow(1 + inflationValue / 100, years);

            return adjustedFutureValue;
        }
        //after inheritance
        else {
            // Step 1: Calculate the future value of the initial investment
            const futureValueInitial = initialInvestment * Math.pow(1 + annualInterestRate / 100, years);

            // Step 2: Calculate the future value of the monthly contributions
            const monthlyRate = annualInterestRate / 100 / 12;
            const totalMonths = years * 12;

            const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

            // Step 3: Calculate the total future value
            const totalInitialValue = futureValueInitial + futureValueContributions;

            // Step 4: Adjust for inflation
            const adjustedInitialFutureValue = totalInitialValue / Math.pow(1 + inflationValue / 100, years);

            //do calculations again for after inheritance
            // Step 1: Calculate the future value of the initial investment plus inheritance
            const futureValueInheritance = (anticipatedInheritanceValue) * Math.pow(1 + annualInterestRate / 100, (age + years) - inheritanceAgeValue);
            //Step 2: Adjust for inflation on inheritance
            const adjustedInheritanceFutureValue = futureValueInheritance / Math.pow(1 + inflationValue / 100, (age + years) - inheritanceAgeValue);

            // Step 3: Calculate the total future value
            const totalFutureValue = adjustedInheritanceFutureValue + adjustedInitialFutureValue;

            return totalFutureValue;
        }
    }

    function calculateCompoundInterestAfterRetirement(annualInterestRate, YearsBeforeRetirement, previousInvestment, annualInflationRate, monthlyWithdrawal, currentYear,retirementAge) {

        // Convert annual rates to decimals
        const r = annualInterestRate / 100;  // Convert to decimal
        const i = annualInflationRate / 100; // Convert to decimal
        let adjustedWithdrawals;
        // Calculate the adjusted monthly withdrawal amount
        if(currentYear >=newRetirementIncomeAgeValue   && newRetirementIncomeAgeValue >= retirementAge){
            adjustedWithdrawals = newRetirementIncomeValue * Math.pow(1 + i, YearsBeforeRetirement);
        }
        else{
            adjustedWithdrawals = monthlyWithdrawal * Math.pow(1 + i, YearsBeforeRetirement);
        }

        // Calculate the total amount after interest for the year
        const totalAfterInterest = previousInvestment * (1 + r);

        // Total withdrawals for the year
        const totalWithdrawals = adjustedWithdrawals * 12; // 12 months

        // Calculate the amount left at the end of the year
        let amountLeft = totalAfterInterest - totalWithdrawals;

        if(inheritanceAgeValue == currentYear){
            amountLeft = amountLeft + anticipatedInheritanceValue;
        }
        if (amountLeft < 0) {
            if (amountLeft < -20)
                isEnough = false;
            return 0;
        }
        else {
            isEnough = true;
            return amountLeft;
        }
    }

    const generateData = (count, initialInvestment, age, retirementAge, postInterestRate, preInterestRate, monthlyContibutions, inflation, monthlybudget) => {

        const data = [];
        for (let i = 0; i <= count; i++) {
            if (i > (retirementAge - age)) {
                data.push(calculateCompoundInterestAfterRetirement(postInterestRate, (retirementAge - age), data[i - 1], inflation, monthlybudget,age+i,retirementAge));
                continue;
            }
            data.push(calculateCompoundInterest(initialInvestment, preInterestRate, i, monthlyContibutions, inflation, age));
        }
        return data;
    };

    // Generate initial data
    const getData = generateData(deathAgeValue - ageValue, initialInvestmentValue, ageValue, retirementAgeValue, postInterestRateValue, preInterestRateValue, monthlyContibutionsValue, averageInflationValue, retirementSalaryValue);
    const getExistingPAC = generateData(deathAgeValue - ageValue, initialInvestmentValue, ageValue, retirementAgeValue, postInterestRateValue, preInterestRateValue, currentMonthlyContibutionsValue, averageInflationValue, retirementSalaryValue);

    // Chart data and options
    const [chartData, setChartData] = useState({
        labels: Array.from({ length: deathAgeValue + 1 - ageValue }, (_, i) => i + ageValue),
        datasets: [
            {
                label: 'Total Growth',
                fill: false,
                lineTension: 0.1,
                color: '29A3FF',
                borderColor: '#29A3FF',
                borderWidth: 10,
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#E61313',
                pointBackgroundColor: '#29A3FF',
                pointBorderWidth: 3,
                pointHoverRadius: 20,
                pointHoverBackgroundColor: '#E61313',
                pointHoverBorderColor: '#29A3FF',
                pointHoverBorderWidth: 2,
                pointRadius: 2,
                pointHitRadius: 10,
                data: getData
            },

            // New dataset for the existing PAC
            {
                label: 'Existing PAC',
                fill: false,
                lineTension: 0.1,
                borderColor: '#FF6347',
                borderWidth: 2,
                borderCapStyle: 'round',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#FF6347',
                pointBackgroundColor: '#FF6347',
                pointBorderWidth: 2,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#E61313',
                pointHoverBorderColor: '#FF6347',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: getExistingPAC
            }
        ],
    });

    useEffect(() => {
        setChartData({
            labels: Array.from({ length: deathAgeValue + 1 - ageValue }, (_, i) => i + ageValue),
            datasets: [
                {
                    label: 'Total Growth',
                    fill: false,
                    lineTension: 0.1,
                    color: 'BC8F8F',
                    borderColor: '#29A3FF',
                    borderWidth: 10,
                    borderCapStyle: 'round',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#8B4513',
                    pointBackgroundColor: '#BC8F8F',
                    pointBorderWidth: 2,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: '#E61313',
                    pointHoverBorderColor: '#29A3FF',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: getData
                },

                // New dataset for the existing PAC
                {
                    label: 'Existing PAC',
                    fill: false,
                    lineTension: 0.1,
                    borderColor: '#FF6347',
                    borderWidth: 2,
                    borderCapStyle: 'round',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#FF6347',
                    pointBackgroundColor: '#FF6347',
                    pointBorderWidth: 2,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: '#E61313',
                    pointHoverBorderColor: '#FF6347',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: getExistingPAC
                }
            ],
        });

        calculateMonthlyContribution(
            initialInvestmentValue,
            preInterestRateValue,
            postInterestRateValue,
            averageInflationValue,
            ageValue,
            retirementAgeValue,
            deathAgeValue,
            retirementSalaryValue,
            inheritanceAgeValue,
            anticipatedInheritanceValue
        );

    }, [ageValue, retirementAgeValue, deathAgeValue, initialInvestmentValue, preInterestRateValue, postInterestRateValue, retirementSalaryValue, averageInflationValue, currentMonthlyContibutionsValue, monthlyContibutionsValue, anticipatedInheritanceValue, inheritanceAgeValue,newRetirementIncomeValue,newRetirementIncomeAgeValue]);

    const calculateFutureValue = () => {
        const futureValue = retirementSalaryValue * Math.pow(1 + averageInflationValue / 100, retirementAgeValue - ageValue)
        return (FormatCurrency(futureValue));
    };
    const toggleCollapseInheritance = () => {
        if (!inheritanceIsCollapsed) {
            setAnticipatedInheritanceValue('');
            setInheritanceAgeValue('');
        }
        setInheritanceIsCollapsed(!inheritanceIsCollapsed); // Toggle collapse state  for inheritance bubble

    }
    const toggleCollapseMidRetirementChange = () => {
        if (!midRetirementChangeIsCollapsed) {
            setNewRetirementIncomeValue('');
            setNewRetirementIncomeAgeValue('');
        }
        setMidRetirementChangeIsCollapsed(!midRetirementChangeIsCollapsed); // Toggle collapse state  for inheritance bubble

    }
    return (
        <Container style={{ backgroundImage: 'linear-gradient(#f0f6fc, #9ec2e6)' }}>
            <Row className="mb-4">
                <Col>
                    <h1 style={{marginBottom:"0px"}} className="text-center">FIN#</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="form" className="p-4 border rounded shadow-sm bg-light">
                            <div style={{
                                position: 'absolute',
                                top: '10%',
                                right: '28%',
                                background: '#f8f9fa',
                                padding: '5px',
                                borderRadius: '8px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                                width: '200px',
                                zIndex: 100,
                                transition: 'all 0.3s ease',
                            }}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={toggleCollapseInheritance}
                                >
                                    <div style={{ marginRight: '10px' }}>
                                        {inheritanceIsCollapsed ? <FaPlus /> : <FaMinus />}
                                    </div>
                                    <h5 className="text-center mb-0" style={{ fontSize: '0.7rem' }}>
                                        Anticipated Inheritance
                                    </h5>
                                </div>
                                {!inheritanceIsCollapsed && (
                                    <>
                                        <Row className="mb-3">
                                            <Form.Label>Value of Inheritance:</Form.Label>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    value={anticipatedInheritanceValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setAnticipatedInheritanceValue(value === '' ? '' : Number(value));
                                                    }}
                                                    required
                                                    className="fun-input"
                                                    step={50000}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Age of Inheritance:</Form.Label>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    value={inheritanceAgeValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setInheritanceAgeValue(value === '' ? '' : Number(value));
                                                    }}
                                                    required
                                                    className="fun-input"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: '10%',
                                left: '28%',
                                background: '#f8f9fa',
                                padding: '5px',
                                borderRadius: '8px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                                width: '200px',
                                zIndex: 100,
                                transition: 'all 0.3s ease',
                            }}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                    onClick={toggleCollapseMidRetirementChange}
                                >
                                    <div style={{ marginRight: '10px' }}>
                                        {midRetirementChangeIsCollapsed ? <FaPlus /> : <FaMinus />}
                                    </div>
                                    <h5 className="text-center mb-0" style={{ fontSize: '0.7rem' }}>
                                        Mid retirement Income Change
                                    </h5>
                                </div>
                                {!midRetirementChangeIsCollapsed && (
                                    <>
                                        <Row className="mb-3">
                                            <Form.Label>New Monthly income:</Form.Label>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    value={newRetirementIncomeValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setNewRetirementIncomeValue(value === '' ? '' : Number(value));
                                                    }}
                                                    required
                                                    className="fun-input"
                                                    step={500}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Form.Label>Age of Income Change:</Form.Label>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    value={newRetirementIncomeAgeValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setNewRetirementIncomeAgeValue(value === '' ? '' : Number(value));
                                                    }}
                                                    required
                                                    className="fun-input"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>
                            <Row className="mb-3">
                                <Form.Label>Value of Current Retirement Investment:</Form.Label>
                                <Col>
                                    <Form.Group>
                                        <CurrencyInput
                                            value={initialInvestmentValue}
                                            decimalsLimit={2}        // Allow two decimals (e.g., cents)
                                            prefix="$"               // Currency symbol
                                            onValueChange={(value) => setInitialInvestmentValue(value)}  // Update state
                                            placeholder="Enter amount"
                                            required
                                            className="fun-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Form.Label>Desired Monthly Retirement Income:</Form.Label>
                                <Col>
                                    <Form.Group>
                                        <CurrencyInput
                                            value={retirementSalaryValue}
                                            decimalsLimit={2}        // Allow two decimals (e.g., cents)
                                            prefix="$"               // Currency symbol
                                            onValueChange={(value) => setRetirementSalaryValue(value)}  // Update state
                                            placeholder="Enter amount"
                                            required
                                            className="fun-input"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col style={{ paddingBottom: '10px' }}>
                                    <Form.Label style={{ fontWeight: 'bold' }}>
                                        Future Value: {calculateFutureValue()}
                                    </Form.Label>
                                </Col>
                            </Row>
                            {/* <Row className="mb-3">
                        <Col className="text-center">
                            <Button type="submit" variant="primary" className="fun-button">
                                Calculate Monthly Investment Needed
                            </Button>
                        </Col>
                    </Row> */}
                            <Row>
                            <Form.Label>Current Monthly Contributions:</Form.Label>
                            <Col>
                                    <Form.Group>
                                        <CurrencyInput
                                            value={currentMonthlyContibutionsValue}
                                            decimalsLimit={2}        // Allow two decimals (e.g., cents)
                                            prefix="$"               // Currency symbol
                                            onValueChange={(value) => setCurrentMonthlyContributionsValue(value)}  // Update state
                                            placeholder="Enter amount"
                                            required
                                            className="fun-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <div style={{ border: 'solid', display: 'inline-block', paddingLeft: '15px', paddingRight: '15px', borderRadius: "8px" }}>
                                    <Form.Label>Monthly Investment Needed: </Form.Label>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label style={{ fontWeight: 'bold' }}>
                                                {FormatCurrency(monthlyContibutionsValue)}
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                </div>
                            </Row>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col style={{ width: '55%', margin: '0 auto', position: 'relative' }}>
                    <Row className="mb-3">
                        <Col md={6} style={{ position: 'relative', textAlign: 'left' }}>
                            <Form.Label>Inflation Rate:</Form.Label>
                            <Form.Control
                                type="range"
                                min="1"
                                max="10"
                                step="0.5"
                                value={averageInflationValue}
                                onChange={(e) => setAverageInflationValue(Number(e.target.value))}
                                className="fun-range"
                            />
                            <Form.Text className="text-muted">{averageInflationValue}</Form.Text>
                        </Col>
                        <Col md={6} style={{ position: 'relative', textAlign: 'right' }}>
                            <Form.Label>Pre-Retirement Average Rate of Return:</Form.Label>
                            <Form.Control
                                type="range"
                                min="1"
                                max="10"
                                value={preInterestRateValue}
                                onChange={(e) => setPreInterestRateValue(Number(e.target.value))}
                                className="fun-range"
                            />
                            <Form.Text className="text-muted">{preInterestRateValue}</Form.Text>
                        </Col>
                        <Col md={6} style={{ position: 'relative', textAlign: 'right' }}>
                            <Form.Label>Post-Retirement Average Rate of Return:</Form.Label>
                            <Form.Control
                                type="range"
                                min="1"
                                max="10"
                                value={postInterestRateValue}
                                onChange={(e) => setPostInterestRateValue(Number(e.target.value))}
                                className="fun-range"
                            />
                            <Form.Text className="text-muted">{postInterestRateValue}</Form.Text>
                        </Col>
                    </Row>
                    <div style={{
                        backgroundImage: 'linear-gradient(GhostWhite, azure)', margin: 'auto', paddingTop: '10px',
                        borderRadius: '15px',
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',

                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}>
                        <Line
                            data={chartData}
                            options={{
                                scales: {
                                    y: {
                                        ticks: {
                                            beginAtZero: true
                                        },
                                        grid: {
                                            display: true, // Hide the grid lines for the y-axis
                                        }
                                    },
                                    x: {
                                        type: 'linear',
                                        min: 18,  // Starting value for x-axis
                                        max: 100, // Ending value for x-axis
                                        ticks: {
                                            stepSize: 1,  // Interval for ticks (e.g., 0, 10, 20, ...)
                                        },
                                        grid: {
                                            display: false,
                                        },
                                    }
                                },
                                plugins: {
                                    title: {
                                        display: false,
                                      },
                                    legend: {
                                        display: true,
                                        position: 'bottom',
                                        labels: {
                                            boxWidth: 20,     // default is 40
                                            boxHeight: 2,    // optional (only works in newer Chart.js versions)
                                            padding: 10,      // space between items
                                            font: {
                                              size: 14,       // reduce text size if needed
                                            },
                                          }
                                      },
                                    datalabels: {
                                        color: 'green',
                                        display: function (context) {
                                            return (context.datasetIndex === 0 && context.dataIndex === retirementAgeValue - ageValue);
                                        },
                                        anchor: 'end',
                                        align: 'end',
                                        font: {
                                            size: 15,  // Adjust this number to make the text bigger or smaller
                                            weight: 'bold',  // Optional: make the text bold
                                            family: 'Arial', // Optional: you can change the font family
                                        },
                                        offset: -2,
                                        formatter: (value) => {
                                            const formattedValue = new Intl.NumberFormat('en-CA', {
                                                style: 'currency',
                                                currency: 'CAD',
                                            }).format(value);

                                            return `FIN: ${formattedValue}`;
                                        }
                                    },
                                    annotation: {
                                        annotations: {
                                            lineAtZero: {
                                                type: 'line',  // Type of annotation (line)
                                                xMin: 0,  // Position at x = 0
                                                xMax: 0,  // End position at x = 0 (for vertical line)
                                                borderColor: 'blue',  // Line color
                                                borderWidth: 2,  // Line thickness
                                                label: {
                                                    content: 'Zero',  // Optional label at the line
                                                    position: 'top',  // Label position
                                                },
                                            },
                                        },
                                    }
                                },
                                layout: {
                                    padding: {
                                        top: 20,  // Add padding to the top
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="slider-container" style={{ marginLeft: '50px', marginRight: '25px' }}>

                        <Range
                            values={ageValues}
                            step={1}
                            min={18}
                            max={100}
                            onChange={handleChange}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '10px',
                                        backgroundColor: '#ddd',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ index, props, value }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '20px',
                                        width: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#007bff',
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    {/* Display the value below each thumb */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '25px',
                                            left: '-10px', // Adjust based on the thumb size
                                            fontSize: '14px',
                                            color: '#007bff',
                                            textAlign: 'center',
                                            width: '40px',
                                        }}
                                    >
                                        {value}
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default RealTimeGraph;