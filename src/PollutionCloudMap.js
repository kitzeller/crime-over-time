import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';

var us  = require('us-atlas/us/10m.json');



class PollutionCloudMap extends Component {
	constructor(props){
		super(props);
		//this.props = props;
	}


	init(){
		if(this.initialized !== undefined){ return; }
		this.initialized = true;

		this.svg = d3.select(this.refs.cloudmap);

		this.defs = this.svg.append("defs");


		this.radgrad = this.defs.append("radialGradient")
			.attr("id", "smoke")
			.attr("cx", "50%")
			.attr("cy", "50%")
			.attr("r", "50%")
			//.attr("gradientUnits", "userSpaceOnUse")

		this.lowerbounds = this.radgrad.append("stop")
			.attr("offset","0")
			.style("stop-color", "#464547")

		this.upperbounds = this.radgrad.append("stop")
			.attr("offset","1")
			.style("stop-color", "#464547")
			.style("stop-opacity","0")

		this.defs.append("filter")
			.attr('id',"goo")
			.html(`<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      				<feColorMatrix in="blur" mode="matrix" values= "1 0 0 0 0 
      																0 1 0 0 0 
      																0 0 1 0 0 
      																0 0 0 18 -7" result="goo" />
      				<feBlend in="SourceGraphic" in2="goo" />`)

		console.log(this.defs.nodes())


	}

	componentDidMount(){

		this.init();



		var path = d3.geoPath();

		//this.svg = d3.select(this.refs.cloudmap);

		/*
		this.svg.append("path")
			.attr("stroke", "#aaa")
			.attr("stroke-width", 0.5)
			.attr("d", path(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); })));
		*/

		console.log(us);	
		console.log(topojson);

		this.mapArea = this.svg.append("g")

		var states = this.mapArea.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(us.objects.states.geometries)
			.enter()

		var smokes = this.mapArea.append("g")
			.style('filter', "url(#goo)")
			.attr("class", "smokes")
			.selectAll("path")
			.data(us.objects.states.geometries)
			.enter()

		states.append("path")
			.attr("stroke-width", 0.5)
			.attr("stroke", "blue")
			.attr("fill", "None")
			.attr("d", d=>path(topojson.feature(us, d, function(a, b) { return a !== b; })))

		smokes//.append("g")
			//.attr("transform", "scale(1.5)")
			.append("path")
			.attr("d", d=>path(topojson.feature(us, d, function(a, b) { return a !== b; })))
			.attr("fill", "url(#smoke)")
			.each(function(d){
				let bbox = this.getBBox();
				let cx = bbox.width / 2 + bbox.x;
				let cy = bbox.height / 2 + bbox.y;
				let scale = 1.1;
				console.log(bbox);

				d3.select(this)
					//.attr("transform", "translate("+ cx +","+ cy +") scale("+scale+") translate("+ -cx +","+ -cy +")");
			})
			.style("fill-opacity", 0.5);

		this.svg.on("click", (d)=>{
				console.log(this.lowerbounds)

				if(this.lowerbounds.attr("offset") == 0){
					this.lowerbounds.transition()
						.attr("offset", 1)
						.duration(1500)

				} else{
					this.lowerbounds.transition()
						.attr("offset", 0)
						.duration(300)
				}



			})

		/*
		this.svg.append("path")
			.attr("d", path(topojson.feature(us, us.objects.nation)));
		*/

		}


  render() {
    return (
      <svg ref="cloudmap" height='800' width='960'></svg>
    );
  }

}

export default PollutionCloudMap;
