// DONE -----------split rate of return before and after retirement
// DONE -----------show  adjusted retirement income for inflation under today's dollars
// DONE -----------make inflationa slider
// DONE -----------show change in post retirement income from  inflation when moving chart
// DONE -- need to adjust monthly contributions calculations -------------anticipated inherittace feature
// DONE ------------Larger thicker graph lines, perhaps a coloured background?
// DONE ------------Bottom line should range from 18 to 99 and fixed
// DONE ------------Title on top FIN#
// DONE ------------All figures need comas. $1,234,000 not 1234000
// DONE ------------What is the future balance at date of departure? The graph should end there not at 0
// CONFLICTING WITH PREVIOUS --- Values on left side need to remain constant not change with calculations
// DONE ------------Make everything fit on one page. No need to scroll the page up and down
// DONE ------------Does the monthly retirement income factor in inflation?

//---Revision 2

// DONE ------------ Remove the negative amounts option, should only be as low as zero

// DONE ------------ Not sure why its asking for the monthly investment field to be filled out

// ? --------------- Not sure but I think the formulas are not accurately calculating stuff

// DONE ------------ Can we show the existing pac if they have one and how it will not , in most cases, fulfil the needs

// YES ------------- Does the monthly retirement income factor inflation?

// DONE ------------ Add commas in money values

// DONE ------------ auto update for monthly investment

// DONE ------------- Bigger Fin number

// DONE ------------- move inheritance close in

// DONE ------------- add current monthly investments seprate from the needed monthly investment

// DONE ------------- add an option to reduce desired retirmement income at selected age

// DONE  ------------ adjust mid retirement income change for calculating FIN 

// DONE ------------- Remove cents

// round off to thousands

// add shortfall. Show how much they need if they don't have enough money. Or inverse if theres excess

//Possible pension 

// DONE ------------- adjust monthly income to be adjusted with time and inflation after
 

import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Row, Col, Form } from 'react-bootstrap';
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



    const [postInterestRateValue, setPostInterestRateValue] = useState(5); // Initial intrest rate value
    const [preInterestRateValue, setPreInterestRateValue] = useState(8); // Initial intrest rate value
    const [averageInflationValue, setAverageInflationValue] = useState(2); // Initial intrest rate value
    const [ageValue, setAgeValue] = useState(18); // Initial age value
    const [retirementAgeValue, setRetirementAgeValue] = useState(65); // Initial retirement age value
    const [deathAgeValue, setDeathAgeValue] = useState(85); // Initial retirement age value
    const [initialInvestmentValue, setInitialInvestmentValue] = useState(0); // Initial Investment value
    const [monthlyContibutionsValue, setMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [currentMonthlyContibutionsValue, setCurrentMonthlyContributionsValue] = useState(0); // Initial Investment value
    const [retirementSalaryValue, setRetirementSalaryValue] = useState(0); // monthlybudget after retirement
    const [inheritanceIsCollapsed, setInheritanceIsCollapsed] = useState(true); // State to track if inheritance collapsed
    const [midRetirementChangeIsCollapsed, setMidRetirementChangeIsCollapsed] = useState(true); // State to track if inheritance collapsed
    const [anticipatedInheritanceValue, setAnticipatedInheritanceValue] = useState(''); // Inheritance value 
    const [inheritanceAgeValue, setInheritanceAgeValue] = useState(''); // Inheritance Age
    const [newRetirementIncomeValue, setNewRetirementIncomeValue] = useState(''); // New retirement income value 
    const [newRetirementIncomeAgeValue, setNewRetirementIncomeAgeValue] = useState(''); // New retirement income Age
    const [ageValues, setageValues] = useState([18, 65, 85]); // low, middle, high values

    const FormatCurrency = (value) => {
        const formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
        return formattedValue;
    };

    const handleChange = (ageValues) => {
        const min = 18;
        const max = 100;
        const minGap = 1;
    
        // Destructure the values from the incoming array
        let [start, middle, end] = ageValues;
    

    
        // Prevent overlap by enforcing a minimum gap of 1 unit
        if (middle <= start + minGap) {
            middle = start + minGap;  // Move middle forward if too close to start
        }
        if (end <= middle + minGap) {
            end = middle + minGap;  // Move end forward if too close to middle
        }
        if (start >= middle - minGap) {
            start = middle - minGap;  // Move start backward if too close to middle
        }
        if (middle >= end - minGap) {
            middle = end - minGap;  // Move middle backward if too close to end
        }
            // Clamp each value to the valid range [18, 100]
        start = Math.max(min, Math.min(start, max-2));
        middle = Math.max(min, Math.min(middle, max-1));
        end = Math.max(min, Math.min(end, max));
        // Set the updated values
        setageValues([start, middle, end]);
        setAgeValue(start);
        setRetirementAgeValue(middle);
        setDeathAgeValue(end);
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
        const withdrawalDuration = (ageOfDeparture - retirementAge)*12;

        // Convert rates to decimals
        const preMonthlyInterestRate = preInterestRate / 100 / 12;
        const postMonthlyInterestRate = postInterestRate / 100 /12 ;
        const actualAnnualInflationRate = inflationRate / 100;
        // Initialise total future value
        const adjustedFutureValue =  calculateCompoundInterest(initialInvestment,preInterestRate,yearsUntilRetirement,0,inflationRate,currentAge);
        // let totalFutureValueAtRetirement = initialInvestment * Math.pow(1 + preAnnualInterestRate, yearsUntilRetirement);
        // let adjustedFutureValue = totalFutureValueAtRetirement / Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);

        // if(ageOfInheritance>=currentAge){
        //     // Calculate the future value of the inheritance from the inheritance year to retirement
        //     const futureValueOfInheritance = valueOfInheritance * Math.pow(1 + preAnnualInterestRate, retirementAge-ageOfInheritance);
        //     //adjust inheritanmce for inflation
        //     const adjustedInheritanceFutureValue = futureValueOfInheritance / Math.pow(1 + actualAnnualInflationRate, retirementAge-ageOfInheritance);


        //     // Add the inheritance to the future falue
        //     adjustedFutureValue = adjustedFutureValue + adjustedInheritanceFutureValue;
        // }
       
        // Adjusted withdrawal amount considering inflation
        const adjustedWithdrawal = monthlyWithdrawal * Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);
        // Amount still needed after accounting for future value of initial investment
        let presentValueWithInterest = 0;
        // Check for mid retirement income change
        if(ageOfDeparture > newRetirementIncomeAgeValue &&  newRetirementIncomeAgeValue >  retirementAge){
            const withdrawalDuration1 = (newRetirementIncomeAgeValue - retirementAge)*12;
            const withdrawalDuration2 = (ageOfDeparture - newRetirementIncomeAgeValue)*12;
            const adjustedWithdrawal2 = newRetirementIncomeValue * Math.pow(1 + actualAnnualInflationRate, newRetirementIncomeAgeValue - currentAge);


            const presentValueWithInterest1 = presentValueWithInflation(adjustedWithdrawal,postMonthlyInterestRate,Math.pow(1 + actualAnnualInflationRate, 1 / 12) - 1,withdrawalDuration1)
            const presentValueWithInterest2 = presentValueWithInflation(adjustedWithdrawal2,postMonthlyInterestRate,Math.pow(1 + actualAnnualInflationRate, 1 / 12) - 1,withdrawalDuration2)
            //Discount this value back to the present (i.e. to before time frame 1 starts), since these payments begin after withdrawalDuration1 months.
            const pv2 = presentValueWithInterest2 / Math.pow(1 + postMonthlyInterestRate, withdrawalDuration1);

            presentValueWithInterest = presentValueWithInterest1 + pv2;
            //check for inheritance
                if (ageOfDeparture > inheritanceAgeValue  && inheritanceAgeValue > retirementAge){
            let PVWithInheritance = anticipatedInheritanceValue / Math.pow(1 + postMonthlyInterestRate, (inheritanceAgeValue- retirementAge)*12);
            presentValueWithInterest =  presentValueWithInterest - PVWithInheritance;
         }
        }
        else{
         presentValueWithInterest = presentValueWithInflation(adjustedWithdrawal,postMonthlyInterestRate,Math.pow(1 + actualAnnualInflationRate, 1 / 12) - 1,withdrawalDuration)
         //check for inheritance
         if (ageOfDeparture > inheritanceAgeValue  && inheritanceAgeValue > retirementAge){
            let PVWithInheritance = anticipatedInheritanceValue / Math.pow(1 + postMonthlyInterestRate, (inheritanceAgeValue- retirementAge)*12);
            presentValueWithInterest =  presentValueWithInterest - PVWithInheritance;
         }
        }
        // Calculate the remaining amount needed
        const remainingAmount = presentValueWithInterest - adjustedFutureValue;
        // Total number of payments
        const totalPayments = yearsUntilRetirement * 12;

        // Calculate the monthly investment needed
        const adjustedAmount = remainingAmount * Math.pow(1 + actualAnnualInflationRate, yearsUntilRetirement);
        const factor = (Math.pow(1 + preMonthlyInterestRate, totalPayments) - 1) / preMonthlyInterestRate;
        const monthlyInvestment = adjustedAmount /  factor



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

    function presentValueWithInflation(w, r, i, n) {
    if (r === i) {
        return w * n / (1 + r);
    }
    return w * (1 - Math.pow((1 + r) / (1 + i), -n)) / (r - i);
    }

    function calculateCompoundInterest(initialInvestment, annualInterestRate, years, monthlyContribution, inflationValue, age) {

        if (years + age < inheritanceAgeValue || inheritanceAgeValue < age) {
            const monthlyRate = annualInterestRate / 100 / 12;
            const totalMonths = years * 12;
            // Step 1: Calculate the future value of the initial investment
            const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);

            // Step 2: Calculate the future value of the monthly contributions

            const futureValueContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

            // Step 3: Calculate the total future value
            const totalFutureValue = futureValueInitial + futureValueContributions;

            // Step 4: Adjust for inflation
            let adjustedFutureValue = totalFutureValue / Math.pow(1 + inflationValue / 100, years);

            return adjustedFutureValue;
        }
        //after inheritance
        else {
            const monthlyRate = annualInterestRate / 100 / 12;
            const totalMonths = years * 12;

            // Step 1: Calculate the future value of the initial investment
            const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);

            // Step 2: Calculate the future value of the monthly contributions

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

    // function calculateCompoundInterestAfterRetirement(annualInterestRate, totalYears, previousInvestment, annualInflationRate, monthlyWithdrawal, currentYear,retirementAge) {

    //     // Convert annual rates to decimals
    //     const r = annualInterestRate / 100 / 12;  // Convert to decimal
    //     const i = annualInflationRate / 100; // Convert to decimal
    //     let adjustedWithdrawals;
    //     // Calculate the adjusted monthly withdrawal amount
    //     if(currentYear >newRetirementIncomeAgeValue && newRetirementIncomeAgeValue > retirementAge){
    //         adjustedWithdrawals = newRetirementIncomeValue * Math.pow(1 + i, totalYears);
    //     }
    //     else{
    //         adjustedWithdrawals = monthlyWithdrawal * Math.pow(1 + i, totalYears);
    //     }
    //     let amountLeft = previousInvestment
    //     for (let month = 1; month <= 12; month++) {
    //         const interest = amountLeft * r;  // Calculate interest for the month
    //         amountLeft += interest;                     // Add interest
    //         amountLeft -= adjustedWithdrawals;          // Subtract withdrawal
    //     }

    //     if(inheritanceAgeValue == currentYear){
    //         amountLeft = amountLeft + anticipatedInheritanceValue;
    //     }
    //     // if (amountLeft < 20) {
    //     //     return 0;
    //     // }
    //     // else {
    //         return amountLeft;
    //    // }
    // }

    function calculateCompoundInterestAfterRetirement(
    initialInvestment,
    baseMonthlyWithdrawal,
    interestRate,
    inflationRate,
    years,
    totalYearsUntilRetirement,
    currentYear,
    retirementAge
) {
    let monthlyInterestRate = interestRate/100/12
    let annualInflationRate =  inflationRate/100
    let adjustedWithdrawals

    adjustedWithdrawals = baseMonthlyWithdrawal * Math.pow(1 + annualInflationRate, totalYearsUntilRetirement);

    const months = years * 12;
    const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1 / 12);
    let amountLeft = initialInvestment;

    for (let month = 0; month < months; month++) {
        // Apply monthly interest
        amountLeft += amountLeft * monthlyInterestRate;
        if(month === (newRetirementIncomeAgeValue-retirementAge)*12){
            adjustedWithdrawals = newRetirementIncomeValue * Math.pow(1 + annualInflationRate, totalYearsUntilRetirement);
        }
        // Adjust withdrawal for inflation over time
        const inflationAdjustedWithdrawal = adjustedWithdrawals * Math.pow(monthlyInflationRate, month);

        // Subtract withdrawal
        amountLeft -= inflationAdjustedWithdrawal;
        // Apply inheritance if exists
        if(month === (inheritanceAgeValue-retirementAge)*12){
            amountLeft = amountLeft + anticipatedInheritanceValue;
        }
    }
        // If less than 20 make it 0 to make clean
        if (amountLeft < 20) {
            return 0;
        }
        else {
            return amountLeft;
        }
}

    const generateData = (count, initialInvestment, age, retirementAge, postInterestRate, preInterestRate, monthlyContibutions, inflation, monthlybudget) => {

        const data = [];
        for (let i = 0; i <= count; i++) {
            if (i > (retirementAge - age)) {
               // data.push(calculateCompoundInterestAfterRetirement(postInterestRate, i, data[i - 1], inflation, monthlybudget,age+i,retirementAge));
                data.push(calculateCompoundInterestAfterRetirement(data[retirementAge - age], monthlybudget,postInterestRate, inflation,i-(retirementAge - age),(retirementAge - age),age+i,retirementAge));
                continue;
            }
            data.push(calculateCompoundInterest(initialInvestment, preInterestRate, i, monthlyContibutions, inflation, age));
        }
        return data;
    };

    // Generate initial data
    const getData = generateData(deathAgeValue - ageValue, initialInvestmentValue, ageValue, retirementAgeValue, postInterestRateValue, preInterestRateValue, monthlyContibutionsValue, averageInflationValue, retirementSalaryValue).map(value => Math.round(value));
    const getExistingPAC = generateData(deathAgeValue - ageValue, initialInvestmentValue, ageValue, retirementAgeValue, postInterestRateValue, preInterestRateValue, currentMonthlyContibutionsValue, averageInflationValue, retirementSalaryValue).map(value => Math.round(value));

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
        setInheritanceIsCollapsed(!inheritanceIsCollapsed);

    }
    const toggleCollapseMidRetirementChange = () => {
        if (!midRetirementChangeIsCollapsed) {
            setNewRetirementIncomeValue('');
            setNewRetirementIncomeAgeValue('');
        }
        setMidRetirementChangeIsCollapsed(!midRetirementChangeIsCollapsed);

    }
    return (
        <Container style={{ backgroundImage: 'linear-gradient(#f0f6fc, #9ec2e6)' }}>
            <Row className="mb-4">
                <Col>
                    <h2 style={{marginBottom:"0px", marginTop:"0px", padding:'0px'}} className="text-center">FIN#</h2>
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
                                                    placeholder='Enter amount'
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
                                                    placeholder='Enter Age'
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
                                                    placeholder='Enter amount'
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
                                                    placeholder='Enter Age'
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
                                            decimalsLimit={2}
                                            prefix="$"
                                            onValueChange={(value) => setInitialInvestmentValue(value || '')}
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
                                            decimalsLimit={2}
                                            prefix="$"
                                            onValueChange={(value) => setRetirementSalaryValue(value || '')}
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
                                            decimalsLimit={2}
                                            prefix="$"
                                            onValueChange={(value) => setCurrentMonthlyContributionsValue(value || '')}
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
                                            display: true, 
                                        }
                                    },
                                    x: {
                                        type: 'linear',
                                        min: 18, 
                                        max: 100,
                                        ticks: {
                                            stepSize: 1,
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
                                            boxWidth: 20,
                                            boxHeight: 2,
                                            padding: 10, 
                                            font: {
                                              size: 14, 
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
                                            size: 15,
                                            weight: 'bold',
                                            family: 'Arial',
                                        },
                                        offset: -2,
                                        formatter: (value) => {
                                            const formattedValue = new Intl.NumberFormat('en-CA', {
                                                style: 'currency',
                                                currency: 'CAD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(value);

                                            return `FIN: ${formattedValue}`;
                                        }
                                    },
                                    annotation: {
                                        annotations: {
                                            lineAtZero: {
                                                type: 'line',
                                                xMin: 0,
                                                xMax: 0,
                                                borderColor: 'blue',
                                                borderWidth: 2,
                                                label: {
                                                    content: 'Zero',
                                                    position: 'top',
                                                },
                                            },
                                        },
                                    }
                                },
                                layout: {
                                    padding: {
                                        top: 20,
                                    }
                                }
                            }}
                        />
                    </div>
                    <div className="slider-container" style={{ marginLeft: '55px', marginRight: '15px' }}>

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
                                            left: '-10px',
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