import React, {Component} from "react";
import "../App.css";
import {Chart} from "react-chartjs-2";


class GenerateCharts extends Component {

    constructor(props) {
        super();
        this.state = {
            dataset: props.dataset,
            years: [],
            isLoading: true,
            name: props.name,
            viewType: props.viewType,
            yearsForPieChart: [],
            statesForLineChart: [],
            colorCoding: {}
        }

        this.getRandomColor = this.getRandomColor.bind(this);
        this.loadData = this.loadData.bind(this);
        this.findValueOfProperty = this.findValueOfProperty.bind(this);

        this.tableHeaderHandleClick = this.tableHeaderHandleClick.bind(this);
        this.tableRowStatesHandleClick = this.tableRowStatesHandleClick.bind(this);

        this.createChart = this.createChart.bind(this);

        this.createPieChart = this.createPieChart.bind(this);
        this.createLineChart = this.createLineChart.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            dataset: nextProps.dataset,
            years: [],
            isLoading: true,
            name: nextProps.name,
            viewType: nextProps.viewType
        }, () => this.loadData());
    }

    async componentDidMount() {
        this.setState({
            colorCoding: await require('../Utility/ColorCoding.json')
        }, () => this.loadData())
    }

    loadData() {
        let givenYears = []
        let yearsForPieChart = []
        let statesForLineChart = []

        for (let key in this.state.dataset.result[0]) {
            if (key !== 'StateName' && key !== '_id') {
                givenYears.push(key)
                if (yearsForPieChart.length < 3) {
                    yearsForPieChart.push(key);
                }
            }
        }
        
        
var temp=new Set();
    
    var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
    if(existingEntries == null) existingEntries = [];
    console.log("the india set",this.props.moveToGenChart)

    this.state.statesForLineChart.forEach(element => {
        temp.add(element);

    });
    temp.forEach(element => {
        statesForLineChart.push(element);

    });
    temp.clear();

    this.props.moveToGenChart.forEach(element => {
                    if (statesForLineChart.length > 3) 
                    {
                        statesForLineChart.shift();
                        // statesForLineChart.push(element);
                        this.props.moveToGenChart.clear();
                        // existingEntries.splice(0,existingEntries.length)
                        // localStorage.setItem("allEntries", JSON.stringify(existingEntries));
                    }
                    statesForLineChart.push(element);


              });
            // }

        this.setState({
                isLoading: false,
                years: givenYears,
                yearsForPieChart: yearsForPieChart,
                statesForLineChart: statesForLineChart
            },
            () => this.createChart()
        )

        existingEntries=statesForLineChart;
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));
    }

    findValueOfProperty(obj, propertyName) {
        let reg = new RegExp(propertyName, "i"); // "i" to make it case insensitive
        return Object.keys(obj).reduce((result, key) => {
            if (reg.test(key)) result.push(obj[key]);
            return result;
        }, []);
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    createChart() {
        this.createPieChart();
        this.createLineChart();
    }

    createPieChart() {
        let chartColors = [];
        let labelMap = {};

        for (let i = 0; i < this.state.yearsForPieChart.length; i++) {
            let currYear = this.state.yearsForPieChart[i];

            if (document.getElementById("PieChart" + i) !== null) {
                let ctx = document.getElementById("PieChart" + i).getContext('2d');
                let tempData = [];
                let labels = [];

                for (let j = 0, length = 0; j < this.state.dataset.result.length; j++, length++) {
                    let obj = this.state.dataset.result[j]

                    tempData.push(obj[currYear])
                    if (i === 0) {
                        let color = this.getRandomColor();


                        chartColors.push(color)

                        labelMap[obj.StateName] = color;

                    }
                    labels.push(obj.StateName)
                }


                new Chart(ctx, {
                    type: "doughnut",
                    options: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            fontColor: 'rgb(99 99 99)',
                            fontSize: 20,
                            text: currYear,
                            position: 'bottom'
                        },
                    },
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: tempData,
                                backgroundColor: chartColors,
                            }
                        ],
                    },
                });
            }
        }
    }

    createLineChart() {

        if (document.getElementById("LineChart") !== null) {
            let datasets = {}

            let ctx = document.getElementById("LineChart").getContext('2d');
            for (let i = 0; i < this.state.statesForLineChart.length; i++) {
                let currState = this.state.statesForLineChart[i];
                datasets[i] = [];

                for (let j = 0, length = 0; j < this.state.dataset.result.length; j++, length++) {
                    let obj = this.state.dataset.result[j];


                    if (obj.StateName === currState) {
                        for (let k = 0; k < this.state.years.length; k++) {
                            datasets[i].push(obj[this.state.years[k]])
                        }

                    }
                }
            }
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.state.years,
                    datasets: [
                        {
                            label: this.state.statesForLineChart[0],
                            data: datasets[0],
                            borderColor: 'rgb(75, 192, 192)',
                        },

                        {
                            label: this.state.statesForLineChart[1],
                            data: datasets[1],
                            borderColor: 'rgb(45,63,36)',
                        },
                        {
                            label: this.state.statesForLineChart[2],
                            data: datasets[2],
                            borderColor: 'rgb(100,46,201)',
                        }
                    ],
                },
                options: {
                    legend: {
                        labels: {
                            fontColor: 'rgb(71,37,37)',
                            fontSize: 15
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: 'rgb(71,37,37)',
                                fontSize: 16,
                                beginAtZero: true
                            },
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: 'rgb(71,37,37)',
                                fontSize: 16,
                            },
                        }]
                    }

                }
            });
        }
    }

    tableHeaderHandleClick(event) {
        if(this.state.viewType=='line') return;
        const id = event.target.id
        let presentYears = this.state.yearsForPieChart;
        if (presentYears.includes(id)) presentYears.splice(presentYears.indexOf(id), 1);
        else {
            if (presentYears.length === 3) presentYears.shift();
            presentYears.push(id);
        }
        this.setState({
            yearsForPieChart: presentYears
        }, () => this.createChart())
    }
//////////////////////////HERE
    tableRowStatesHandleClick(event) {
        if(this.state.viewType==='pie') return;
        const id = event.target.id;
        var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
        var temp2=new Set();
        let presentStates = []


        this.state.statesForLineChart.forEach(element => {
            temp2.add(element);
    
        });
        temp2.forEach(element => {
            presentStates.push(element);
        });


        if (presentStates.includes(id)) presentStates.splice(presentStates.indexOf(id), 1);
        else {
            if (presentStates.length === 3) presentStates.shift();

            presentStates.push(id);


        }
        console.log("damn",presentStates)
        existingEntries=presentStates;
        localStorage.setItem("allEntries", JSON.stringify(existingEntries));

        this.setState({
            statesForLineChart: presentStates
        }, () => this.createChart())
    }

    render() {
        // {console.log("FROM MAP",this.props.mapStates)}
        if (this.state.isLoading) {
            return (
                <div/>
            )
        }
        let years = this.state.years.map(
            (year, index) =>
                <th
                    key={index}
                    style={{
                        color: this.state.yearsForPieChart.includes(year)
                        && this.state.viewType === "pie"
                            ? "#ffffff" : "#000000",
                    }}
                    onClick={this.tableHeaderHandleClick}
                    id={year}
                >{year}</th>
        )


        let content = this.state.dataset.result.map(
            (details, index) =>

                <tr key={index}>
                    <td
                        style={{
                            backgroundColor:
                                this.state.statesForLineChart.includes(details.StateName)
                                && this.state.viewType === "line"? "#1e621c" : "#009879",
                            color: "#ffffff"
                        }}
                        onClick={this.tableRowStatesHandleClick}////////////
                        id={details.StateName}
                    >
                        {details.StateName}</td>
                    {this.state.years.map(
                        (year, index1) =>
                            <td key={index1}><input placeholder={details[year]} defaultValue={details[year]} style={{border: 'none',background:'transparent'}}/></td>
                    )}
                </tr>
        )

        let canvasListForPie = [];

        for (let i = 0; i < this.state.yearsForPieChart.length; i++) {

            canvasListForPie.push(
                <div style={{
                    width: "32%", height: "50%"
                }} className="pieCharts"
                     key={i}>
                    <canvas
                        id={"PieChart" + i}
                        width="20%"
                        height="10%"
                    />
                </div>
            )
        }

        return (
            <div className="main_content">
                <div className="Graph"
                     style={{display: this.state.viewType === "pie" ? "block" : "none"}}>
                    {canvasListForPie}
                    <h1 style={{color: "#4b4559"}}>{this.state.name}</h1>
                    <h2 style={{display: this.state.yearsForPieChart.length === 0 ? "block" : "none"}}>Please select a year</h2>
                </div>
                <div className="Graph"
                     style={{display: this.state.viewType === "line" ? "block" : "none"}}>
                    <div style={{display: this.state.statesForLineChart.length !== 0 ? "block" : "none"}}>
                    <canvas
                        id={"LineChart"}
                        width="20%"
                        height="4%"
                    />
                    </div>
                    <h1 style={{color: "#4b4559"}}>{this.state.name}</h1>
                    <h2 style={{display: this.state.statesForLineChart.length === 0 ? "block" : "none"}}>Please select an state</h2>
                </div>
                <div className="Tables">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>State</th>
                            {years}
                        </tr>
                        </thead>
                        <tbody>
                        {content}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default GenerateCharts