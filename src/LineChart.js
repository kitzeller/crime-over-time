import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import {withStyles} from '@material-ui/styles';

var crime = require('./data/CrimeStatebyState.js').default;
var gas = require('./data/gas_data_filtered.js').default;
var states = require('./data/states.js').default;

const styles = theme => ({
    line: {
        fill: "none",
        stroke: "steelblue",
    }
});

class LineChart extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {/*update the graph after the component mounts (and the svg is created)*/
        this.update();
    }

    update = () => {

        var filterState = "none";
        var gasFiltered;
        var crimeFiltered;

        // TODO: Remove this?
        if (filterState !== "none"){
            gasFiltered = gas.filter(d => d.msn === "MGTCP" && d.state === filterState);
            crimeFiltered = [crime[0].Alabama];

            for (var key in gasFiltered) {
                if (gasFiltered.hasOwnProperty(key)) {
                    gasFiltered[key] = d3.map(gasFiltered[key]).entries();
                }
            }

            gasFiltered.forEach(function (a) {
                a.forEach(function (b) {
                    b["key"] = parseInt(b["key"]);
                })
            });

        } else {
            gasFiltered = gas.filter(d => d.msn === "MGTCP" && d.state !== "US");
            for (var key in gasFiltered) {
                if (gasFiltered.hasOwnProperty(key)) {
                    gasFiltered[key] = d3.map(gasFiltered[key]).entries();
                }
            }
            crimeFiltered = crime;
        }

        var margin = {top: 50, right: 50, bottom: 50, left: 50}
            , width = window.innerWidth - margin.left - margin.right // Use the window's width
            , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

        // TODO: Dyanamically update scale w/ Transition based on selected state

        var xScale = d3.scaleLinear()
            .range([0, width]); // output

        var yScale = d3.scaleLinear()
            .range([height, 0]); // output

        var yScale1 = d3.scaleLinear().range([height, 0]);

        // xScale.domain(d3.extent(crime[0].Alabama, function (d) {
        //     return d.Year;
        // }));

        xScale.domain([1960,2014]);

        yScale.domain([0, d3.max(crime, function (d) {
            return 1500;
        })]);

        if (filterState === "none"){
            Array.prototype.maxByKey = function (k) {
                var m = this.reduce((m, o, i) => o[k] > m[1] ? [i, o[k]] : m, [0, Number.MIN_VALUE]);
                return this[m[0]];
            };

            let maxObj = gasFiltered.map(a => a.maxByKey("value")).maxByKey("value");

            yScale1.domain([0, d3.max(gasFiltered[0], function (d) {
                return maxObj.value;
            })]);
        } else {
            yScale1.domain([0, 7000]);
        }

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        // Create an axis component with d3.axisBottom

        svg.append("g")
            .attr("class", "y axis")
            .style("stroke", "red")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        svg.append("g")
            .attr("class", "axisRed")
            .style("stroke", "grey")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(yScale1));

        // Crime
        var line1 = d3.line()
            .x(function (d, i) {
                return xScale(d["Year"]);
            }) // set the x values for the line generator
            .y(function (d) {
                return yScale(d["Violent Crime rate"]);
            }) // set the y values for the line generator
        // .curve(d3.curveMonotoneX) // apply smoothing to the line

        svg.selectAll(".c-dot")
            .data(crimeFiltered)
            .enter().append("path")
            .filter(function(d) { return Object.keys(d)[0] === "Arkansas"})
            .style("fill", "none")
            .attr("class", "c-dot")
            .attr("d", function(d) {
                var unknownKey = Object.keys(d)[0];
                return line1(d[unknownKey]);
            })
            .style("stroke", function(d) { return "red"; });

        var line = d3.line()
            .x(function (d) {
                return xScale(d["key"]);
            }) // set the x values for the line generator
            .y(function (d) {
                return yScale1(d["value"]);
            });

        svg.selectAll(".g-dot")
            .data(gasFiltered)
            .enter().append("path")
            .filter(function(d) { return d[58].value === "AK"})
            .style("fill", "none")
            .attr("class", "g-dot")
            .attr("d", function(d) {
                // TODO: Better way around this
                d.pop();
                d.pop();
                d.pop();
                d.pop();
                return line(d); })
            .style("stroke", function(d) { return "grey"; });

    }

    render() {
        return (
            <svg ref="svg" preserveAspectRatio="none" viewBox="0 0 100 100" height='100%' width='100%'/>
        );
    }
}

export default withStyles(styles)(LineChart);
