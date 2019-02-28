import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";
import {withStyles} from '@material-ui/styles';

var crime = require('./data/CrimeStatebyState.js').default;
var gas = require('./data/gas_data_filtered.js').default;
var states = require('./data/states.js').default;
var states_reversed = require('./data/states_reversed.js').default;
var abortions = require('./data/abortions.js').default;
var abortions1960 = require('./data/abortions1960.js').default;

class LineChartAbortion extends Component {

    constructor(props) {
        super(props);
        this.margin = {top: 50, right: 50, bottom: 50, left: 50};
    };

    componentDidMount() {/*update the graph after the component mounts (and the svg is created)*/
        this.update();
    }

    hideStates = (state) => {
        this.svg.selectAll("path").filter(function (d) {
            return !d3.select(this).attr("class").includes(state) && !d3.select(this).attr("class").includes("t-dot");
        }).style("opacity", 0.1);
    };

    showStates = () => {
        this.svg.selectAll("path").style("opacity", 0.9);
    };
    //
    // updateScale = (selState) => {
    //     // Add Text
    //     console.log(selState);
    //     this.svg.selectAll(".statename").remove();
    //     this.svg.append("text").attr("class","statename").attr("x",10).attr("y",5).text(selState);
    //
    //     // Update Crime Scale
    //     let data = this.crimeFiltered.filter((d) => Object.keys(d)[0] === selState);
    //     this.yScale.domain([0, Math.max.apply(Math, data[0][selState].map(function (o) {
    //         return o["Violent Crime rate"];
    //     }))]);
    //     this.yAxisCrime.transition().duration(500).call(d3.axisLeft(this.yScale));
    //
    //     this.svg.selectAll(".c-dot")
    //         .data(this.crimeFiltered.filter(f => Object.keys(f)[0] === selState))
    //         .transition()
    //         .duration(500)
    //         .style("fill", "none")
    //         .attr("class", "c-dot")
    //         .attr("d", (d) => {
    //             var unknownKey = Object.keys(d)[0];
    //             return this.line1(d[unknownKey]);
    //         });
    //
    //     this.svg.selectAll(".c-dot")
    //         .data(this.crimeFiltered.filter(f => Object.keys(f)[0] === selState))
    //         .exit()
    //         .remove();
    //
    //     // Update Gas Scale
    //     let result = 1000;
    //     var key = Object.keys(states).filter(function (key) {
    //         return states[key] === selState
    //     })[0];
    //     this.gasFiltered.forEach(function (d) {
    //         if (d[58].value === key) {
    //             result = Math.max.apply(Math, d.slice(0, 57).map(function (o) {
    //                 return o.value;
    //             }))
    //         }
    //     });
    //
    //     this.yScale1.domain([0, result]);
    //     this.yAxisGas.transition().duration(500).call(d3.axisRight(this.yScale1));
    //     this.svg.selectAll(".g-dot")
    //         .data(this.gasFiltered.filter(f => {
    //             return f[58].value === key;
    //         }))
    //         .transition()
    //         .duration(500)
    //         .style("fill", "none")
    //         .attr("class", "g-dot")
    //         .attr("d", (d) => {
    //             return this.line(d.slice(0, 57));
    //         });
    //
    //     this.svg.selectAll(".g-dot")
    //         .data(this.gasFiltered.filter(f => {
    //             return f[58].value === key;
    //         }))
    //         .exit()
    //         .remove()
    // };

    update = () => {

        //console.log(d3);

        var data = d3.csvParse(abortions);

        var data1960 = d3.csvParse(abortions1960);
        //console.log(data1960);

        this.grouped = d3.nest()
            .key(function (d) {
                return d.state_id;
            })
            .entries(data);

        //console.log(this.grouped);

        this.crimeFiltered = [];

        this.crimeFiltered = crime;
        var margin = {top: 100, right: 100, bottom: 100, left: 100}
            , width = window.innerWidth - margin.left - margin.right // Use the window's width
            , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

        this.xScale = d3.scaleLinear()
            .range([0, width]); // output

        this.yScale = d3.scaleLinear()
            .range([height, 0]); // output

        this.yScale1 = d3.scaleLinear().range([height, 0]);

        this.xScale.domain([1960, 2004]);
        this.yScale.domain([0, d3.max(crime, function (d) {
            return 2900;
        })]);

        this.yScale1.domain([0, 100]);


        this.svg = d3.select(this.refs.linechart)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.xAxis = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));

        this.yAxisCrime = this.svg.append("g")
            .attr("class", "y axis")
            .style("stroke", "red")
            .call(d3.axisLeft(this.yScale)); // Create an axis component with d3.axisLeft

        this.yAxisAb = this.svg.append("g")
            .attr("class", "axisRed")
            .style("stroke", "grey")
            .attr("transform", "translate( " + width + ", 0 )")
            .call(d3.axisRight(this.yScale1));

        // Crime
        this.line1 = d3.line()
            .x((d, i) => {
                return this.xScale(d["Year"]);
            }) // set the x values for the line generator
            .y((d) => {
                return this.yScale(d["Violent Crime rate"]);
            }) // set the y values for the line generator
        // .curve(d3.curveMonotoneX) // apply smoothing to the line

        //console.log(this.crimeFiltered);
        //this.crimeFilteredTwice = Object.assign(crime)

        this.crimeFilteredTwice = crime.map(a => {
            let newObject = {};
            Object.keys(a).forEach(propertyKey => {
                newObject[propertyKey] = a[propertyKey];
            });
            return newObject;
        });


        this.crimeFilteredTwice.forEach(function (s) {
            //console.log(s);
            var unknownKey = Object.keys(s)[0];
            s[unknownKey] = s[unknownKey].filter(function (el) {
                return el.Year < 2005;
            })
        });

        // this.grouped.forEach(function(s){
        //   console.log(s);
        //   s["values"] = s["values"].filter(function (el){
        //       return el.first_year < 2001;
        //   })
        // });

        //console.log(this.crimeFiltered);

        this.crimeLines = this.svg.selectAll(".c-dot")
            .data(this.crimeFilteredTwice)
            .enter().append("path")
            .filter(function (d) {

                //console.log(d);
                return true;
            })
            .style("fill", "none")
            .attr("class", function (d) {
                return "c-dot" + " " + states_reversed[Object.keys(d)[0]];
            }).attr("d", (d) => {
                var unknownKey = Object.keys(d)[0];
                return this.line1(d[unknownKey]);
            })
            .style("stroke", function (d) {
                return "red";
            })
            .style("stroke-width", 2.5)
            .style("opacity", 0.6)
        // .on("mouseover", (d) => {
        //     this.svg.append("text").attr("class","statename").attr("x",10).attr("y",5).text(Object.keys(d)[0]);
        //     d3.selectAll("." + states_reversed[Object.keys(d)[0]]).style("stroke-width", 8);
        //     this.hideStates(states_reversed[Object.keys(d)[0]]);
        // })
        // .on("mouseout", (d) => {
        //     this.svg.selectAll(".statename").remove();
        //     d3.selectAll("." + states_reversed[Object.keys(d)[0]]).style("stroke-width", 2.5);
        //     this.showStates();
        // }).on("click", (d) => {
        //     this.updateScale(Object.keys(d)[0]);
        // })
        ;

        this.line = d3.line()
            .x((d) => {
                return this.xScale(d["first_year"]);
            })
            .y((d) => {
                return this.yScale1(d["datum"]);
            });

        this.abLines = this.svg.selectAll(".a-dot")
            .data(this.grouped)
            .enter().append("path")
            // .filter(function (d) {
            //     return d[58].value === "AK"
            // })
            .style("fill", "none")
            .attr("class", function (d) {
                return "a-dot " + d.values[0].state_id;
            })
            .attr("d", (d) => {
                //console.log(d.values);
                // var unknownKey = Object.keys(d)[0];
                return this.line(d.values);
            })
            .style("stroke", function (d) {
                //console.log(d.values);
                if (d.values[0].state_id === "US") {
                    return "darkgray";
                } else {
                    return "grey";
                }
            })
            .style("opacity", 0.7)
            .style("stroke-width", 2.5)
            .on("mouseover", (d) => {
                d3.selectAll("." + d.values[0].state_id).style("stroke-width", 8);
                this.hideStates(d.values[0].state_id);
                this.svg.append("text").attr("class", "statename").attr("x", 10).attr("y", 5).text(d.values[0].state_name);
            })
            .on("mouseout", (d) => {
                this.svg.selectAll(".statename").remove();
                d3.selectAll("." + d.values[0].state_id).style("stroke-width", 2.5);
                this.showStates();
            });
        // .on("click", (d) => {
        //     this.updateScale(states[d[58].value]);
        // })

        this.line1960 = d3.line()
            .x((d) => {
                return this.xScale(d["year"]);
            })
            .y((d) => {
                return this.yScale1(d["rate"]);
            });

        this.line_1960 = this.svg.append("path")
            .datum(data1960)
            .style("fill", "none")
            .attr("class", function (d) {
                return "t-dot";
            })
            .attr("d", (d) => {
                //console.log(d);
                //console.log(d.values);
                // var unknownKey = Object.keys(d)[0];
                return this.line1960(d);
            })
            .style("stroke", "darkgray")
            .style("opacity", 0.7)
            .style("stroke-width", 9);

        this.svg.append("line")
            .attr("x1", this.xScale(1995))
            .attr("y1", height)
            .attr("x2", this.xScale(1995))
            .attr("y2", 0)
            .style("stroke-dasharray", ("8, 10"))
            .style("stroke", "green")
            .style("stroke-width", 3);


        this.svg.append("line")
            .attr("x1", this.xScale(1973))
            .attr("y1", height)
            .attr("x2", this.xScale(1973))
            .attr("y2", 0)
            .style("stroke", "green")
            .style("stroke-width", 3)
            .style("stroke-dasharray", ("8, 10"))
            .on("mouseover", () => {
            })
            .on("mouseout", () => {
                //this.svg.selectAll(".abor").remove();
            });


        this.svg.append("text").attr("class", "abor").attr("transform", "translate("+this.xScale(1973.3) + ",-150)" + "rotate(90)").attr("x", this.xScale(1973)).attr("y", 0).text("Abortion Legalized").style("width", "20px").style("text-anchor", "end");
        this.svg.append("text").attr("class", "abor").attr("transform", "translate("+this.xScale(1995.3) + ",-700)" + "rotate(90)").attr("x",  this.xScale(1995)).attr("y", 0).text("Crime Decrease").style("width", "20px").style("text-anchor", "end");


    };

    render() {
        return (
            <div ref={((mount) => {
                if (mount && (this.mount === undefined)) {
                    this.mount = mount;
                    this.setState({})
                }
                this.mount = mount;
            })} style={{width: "100%", height: "700px"}}>
                <svg ref="linechart"
                     height={this.mount ? this.mount.clientHeight + this.margin.top + this.margin.bottom : null}
                     width={this.mount ? this.mount.clientWidth + this.margin.left + this.margin.right : null}/>
            </div>
        );
    }
}

export default LineChartAbortion;