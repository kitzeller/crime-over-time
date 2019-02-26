import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import { withStyles } from '@material-ui/styles';

var crime = require('./data/CrimeStatebyState.js').default;
// var gas = require('./data/use_all_phy.csv').default;
// MGTCP
const styles = theme => ({
    line : {
    fill: "none",
    stroke: "steelblue",
}})

class LineChart extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     data: [],
        //     smaller: "",
        //     bigger: "",
        //     circles: undefined,
        //     results: {
        //         taskName: 'WithStyles(PieChartExperiment)',
        //         correctAnswer: undefined,
        //         userAnswer: undefined,
        //         circles: undefined,
        //     }
        // };

    };

    // static propTypes = {
    //     onFinish: PropTypes.func.isRequired,
    // }
    componentDidMount() {/*update the graph after the component mounts (and the svg is created)*/
        this.update();
    }

    update = () => {
        var crimeState = crime[0].Alabama;
        var margin = {top: 50, right: 50, bottom: 50, left: 50}
            , width = window.innerWidth - margin.left - margin.right // Use the window's width
            , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

        var n = 21;

        var parseTime = d3.timeParse("%y");

        var xScale = d3.scaleLinear()
            .range([0, width]); // output

        var yScale = d3.scaleLinear()
            .range([height, 0]); // output

        var yScale1 = d3.scaleLinear().range([height, 0]);


        xScale.domain(d3.extent(crimeState, function (d) {
            return d.Year;
        }));
        yScale.domain([0, d3.max(crimeState, function (d) {
            return Math.max(d.Robbery);
        })]);

        var line = d3.line()
            .x(function (d, i) {
                return xScale(d.Year);
            }) // set the x values for the line generator
            .y(function (d) {
                return yScale(d.Robbery);
            }) // set the y values for the line generator
            // .curve(d3.curveMonotoneX) // apply smoothing to the line

        var line1 = d3.line()
            .x(function (d, i) {
                return xScale(d.Year);
            }) // set the x values for the line generator
            .y(function (d) {
                return yScale1(d.Robbery);
            }) // set the y values for the line generator
            // .curve(d3.curveMonotoneX) // apply smoothing to the line

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        svg.append("path")
            .datum(crimeState) // 10. Binds data to the line
            .attr("class", "line") // Assign a class for styling
            .attr("d", line); // 11. Calls the line generator

        svg.selectAll(".dot")
            .data(crimeState)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) {
                return xScale(d.Year)
            })
            .attr("cy", function (d) {
                return yScale(d.Robbery)
            })
            .attr("r", 5)
            .on("mouseover", function (a, b, c) {
                console.log(a)
                //this.attr('class', 'focus')
            })
            .on("mouseout", function () {
            })


    }

    render() {
        return (
            <svg ref="svg" preserveAspectRatio="none" viewBox="0 0 100 100" height='100%' width='100%'/>
        );
    }
}

export default withStyles(styles)(LineChart);
