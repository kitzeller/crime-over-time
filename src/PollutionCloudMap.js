import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';

var us	= require('us-atlas/us/10m.json');
var state_names = require("./data/state_names.js").default;


class PollutionCloudMap extends Component {
	constructor(props){
		super(props);
		//this.props = props;
		this.state = {opacity:50, stop:50};
	}


	init(){
		if(this.initialized !== undefined){ return; }
		this.initialized = true;

		this.svg = d3.select(this.refs.cloudmap);

		this.defs = this.svg.append("defs");


		this.defs.append("filter")
			.attr('id',"goo")
			.html(`<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
			<feColorMatrix in="blur" mode="matrix" values=
			 "1 0 0 0 0
			  0 1 0 0 0
			  0 0 1 0 0
			  0 0 0 36 -7" result="almostdone" />
			<feGaussianBlur in="almostdone" stdDeviation="5" result="goo" />
			<feBlend in="SourceGraphic" in2="goo" />`)

	}

	makeCustomSmokes(){
		var classes = us.objects.states.geometries.map(d=>d.id)

		classes.forEach(d=>{
		this.defs.append("radialGradient")
			.attr("id", d)
			.attr("cx", "50%")
			.attr("cy", "50%")
			.attr("r", "50%")
			.html(`<stop class="start" offset="0" stop-color="#464547" stop-opacity="0.2"></stop><stop class="end" offset="1" stop-color="#464547" stop-opacity="0"></stop>`)
		})
	}

	componentDidMount(){

		this.init();
		this.makeCustomSmokes()


		var path = d3.geoPath();


		console.log(us);	
		console.log(topojson);

		this.mapArea = this.svg.append("g")

		var smokes = this.mapArea.append("g")
			.style('filter', "url(#goo)")
			.attr("class", "smokes")
			.selectAll("path")
			.data(us.objects.states.geometries)
			.enter()

		var stateNames = this.mapArea.append("g")

		var states = this.mapArea.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(us.objects.states.geometries)
			.enter()



		states.append("path")
			.attr("stroke-width", 0.5)
			.attr("stroke", "blue")
			.attr("fill", "None")
			.attr("d", d=>path(topojson.feature(us, d, function(a, b) { return a !== b; })))
			.each(function(d){
				let bbox = this.getBBox();
				let cx = bbox.width / 2 + bbox.x;
				let cy = bbox.height / 2 + bbox.y;
				stateNames.append("text")
					.attr("class", d.id)
					.attr("x", cx)
					.attr("y", cy)
					.attr("text-anchor", "middle")
					.text(state_names[d.id].STATE_NAME)
			})

		smokes//.append("g")
			//.attr("transform", "scale(1.5)")
			.append("path")
			.attr("d", d=>path(topojson.feature(us, d, function(a, b) { return a !== b; })))
			.attr("class", d=>d.id)
			.attr("fill", d=>"url(#"+d.id+")")
			.on("click", d=>{console.log(state_names[d.id].STATE_NAME)})
			//.style("fill-opacity", 0.5);

		this.svg.on("click", (d)=>{
				console.log(this.lowerbounds)
				console.log(this.defs)
				var anim = () => {
					var newval;
					this.defs.selectAll("stop.start")
						.transition()
						.attr("offset", function(d){
							newval = Math.random();
							stateNames.select("[class='"+d3.select(this).node().parentNode.id+"']")
								.text(newval.toFixed(3))
							return newval**2})
						.attr("stop-opacity", d=>Math.random())
						.duration(500)
/*						.transition()
						.attr("offset", 0)
						.attr("stop-opacity", 0.2)
						.duration(500)*/
						//.on("end", anim);
				}
				anim()
				console.log(this.refs.stop)
/*
					this.lowerbounds.transition()
						.attr("offset", 0)
						.attr("stop-opacity", 0)
						.duration(300)
*/				
			})
		}





	handleChange = (id) => (event) => {
		this.setState({[id]:event.target.value});
	}


	render() {
		return (
			<div>
			<svg ref="cloudmap" height='600' width='950'></svg>
			<input ref="opacity" type="range" value={this.state.opacity} onChange={this.handleChange("opacity")} min="1" max="100" value="50" step='1'>
			<input ref="stop" type="range" value={this.state.stop} onChange={this.handleChange("stop")} min="1" max="100" value="50" step='1'>
			</div>
		);
	}

}

export default PollutionCloudMap;
