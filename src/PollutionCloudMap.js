import React, {Component} from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';

var us = require('us-atlas/us/10m.json');
var state_names = require("./data/state_names.js").default;

var gas = require('./data/gas_data_filtered.js').default;

class PollutionCloudMap extends Component {
	constructor(props) {
		super(props);
		//this.props = props;
		this.state = {opacity: 50, stop: 50, year:1960};
	}


	init() {
		if (this.initialized !== undefined) {
			return;
		}
		this.initialized = true;

		this.svg = d3.select(this.refs.cloudmap);

		this.defs = this.svg.append("defs");


		this.defs.append("filter")
			.attr('id', "goo")
			.html(`<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
			<feColorMatrix in="blur" mode="matrix" values=
			 "1 0 0 0 0
			  0 1 0 0 0
			  0 0 1 0 0
			  0 0 0 36 -7" result="almostdone" />
			<feGaussianBlur in="almostdone" stdDeviation="5" result="goo" />
			<feBlend in="SourceGraphic" in2="goo" />`)

	}

	makeCustomSmokes() {
		console.log(this.gasFiltered)
		this.radialGradients = this.defs.selectAll("radialGradient")
			.data(this.gasFiltered)
			.enter()
			.append("radialGradient")

		this.radialGradients
			.attr("id", d=>state_names[d.state].ANSI)
			.attr("cx", "50%")
			.attr("cy", "50%")
			.attr("r", "50%")
			.html(`<stop class="start" offset="0" stop-color="#464547" stop-opacity="0.2"></stop><stop class="end" offset="1" stop-color="#464547" stop-opacity="0"></stop>`)

	}

	componentDidMount() {
		
		this.gasFiltered = gas.filter(d => d.msn === "MGTCP" && d.state !== "US");
		this.gasFiltered = this.gasFiltered.map(x=> Object.assign(x, ...Object.keys(x).filter(d=>Number(d)).map(k=>({[k]:this.gramsLeadPerGallon(k, x[k]) }) ) ) )
		console.log(this.gramsLeadPerGallon)
		this.gasFiltered = this.gasFiltered.map(x => Object.assign({max:Math.max(...Object.keys(x).filter(d=>Number(d)).map(d=>x[d]))}, x))//adds the max value of lead to each state's dictionary
		this.gasFiltered = this.gasFiltered.map(x => Object.assign({min:Math.min(...Object.keys(x).filter(d=>Number(d)).map(d=>x[d]))}, x))//adds the min value of lead to each state's dictionary
		this.init();
		this.makeCustomSmokes()


		var path = d3.geoPath();
		console.log(gas)
		console.log(this.gasFiltered)



		this.mapArea = this.svg.append("g")

		var smokes = this.mapArea.append("g")
			.style('filter', "url(#goo)")
			.attr("class", "smokes")
			.selectAll("path")
			.data(this.gasFiltered)
			.data(us.objects.states.geometries)
			.enter()

		this.stateNames = this.mapArea.append("g")

		var states = this.mapArea.append("g")
			.attr("class", "states")
			.selectAll("path")
			.data(us.objects.states.geometries)
			.enter()
		
		const _this = this;

		states.append("path")
			.attr("stroke-width", 0.5)
			.attr("stroke", "black")
			.attr("fill", "None")
			.attr("d", d => path(topojson.feature(us, d, function (a, b) {
				return a !== b;
			})))
			.each(function(d){
				let bbox = this.getBBox();
				let cx = bbox.width / 2 + bbox.x;
				let cy = bbox.height / 2 + bbox.y;
				_this.stateNames.append("text")
					.attr("class", d.id)
					.attr("x", cx)
					.attr("y", cy)
					.attr("text-anchor", "middle")
					.text(state_names[d.id].STATE_NAME)
			})
		smokes.append("path")
			.attr("d", d => path(topojson.feature(us, d, function (a, b) {
				return a !== b;
			})))
			.attr("class", d => d.id)
			.attr("fill", d => "url(#" + d.id + ")")

		this.showoff()
		//this.handleChange({target:{value:1960}})
	}

	/*
	_handleChange = (id) => (event) => {
		this.setState({[id]: event.target.value});
		console.log(id, this.state[id]);
		this.defs.selectAll("stop.start")
			.attr("offset", this.state.stop/100)
			.attr("stop-opacity", this.state.opacity/100)
	}*/

	gramsLeadPerGallon(year, gasolineUsage){
		var pbPg;
		const gallonsPerBarrel = 31.5 * 1000;
		var unleadedShare;
		year = Number(year)
		if(year > 1987){
			pbPg =  0.1;
		} else if (year < 1965){
			pbPg = 2.125
		} else{		
			switch(year){
				case 1965:
				pbPg =  2.125
				break;
				case 1966:
				pbPg =  2.2
				break;
				case 1967:
				pbPg =  2.25
				break;
				case 1968:
				pbPg =  2.28
				break;
				case 1969:
				pbPg =  2.35
				break;
				case 1970:
				pbPg =  2.28
				break;
				case 1971:
				pbPg =  2.05
				break;
				case 1972:
				pbPg =  1.92
				break;
				case 1973:
				pbPg =  1.87
				break;
				case 1974:
				pbPg =  1.8
				break;
				case 1975:
				pbPg =  1.73
				break;
				case 1976:
				pbPg =  1.85
				break;
				case 1977:
				pbPg =  1.81
				break;
				case 1978:
				pbPg =  1.65
				break;
				case 1979:
				pbPg =  1.64
				break;
				case 1980:
				pbPg =  1.15
				break;
				case 1981:
				pbPg =  1.05
				break;
				case 1982:
				pbPg =  1.03
				break;
				case 1983:
				pbPg =  1.06
				break;
				case 1984:
				pbPg =  1.05
				break;
				case 1985:
				pbPg =  0.55
				break;
				case 1986:
				pbPg =  0.3
				break;
				case 1987:
				pbPg =  0.2
				break;
			}
		}
		unleadedShare = 3;
		var c = 100/16;
		switch(year){
			case 1995:
			unleadedShare += 0.04 * c;
			case 1994:
			unleadedShare += 0.04 * c;
			case 1993:
			unleadedShare += 0.04 * c;
			case 1992:
			unleadedShare += 0.04 * c;
			case 1991:
			unleadedShare += 0.04 * c;
			case 1990:
			unleadedShare += 0.88 * c;
			case 1989:
			unleadedShare += 0.88 * c;
			case 1988:
			unleadedShare += 0.899 * c; 
			case 1987:
			unleadedShare += 0.899 * c;
			case 1986:
			unleadedShare += 0.899 * c;
			case 1985:
			unleadedShare += 0.899 * c;
			case 1984:
			unleadedShare += 0.52 * c;
			case 1983:
			unleadedShare += 0.52 * c;
			case 1982:
			unleadedShare += 0.52 * c;
			case 1981:
			unleadedShare += 0.52 * c;
			case 1980:
			unleadedShare += 1.078 * c;
			case 1979:
			unleadedShare += 1.078 * c;
			case 1978:
			unleadedShare += 1.078 * c; 
			case 1977:
			unleadedShare += 1.078 * c; 
			case 1976:
			unleadedShare += 1.078 * c; 
			case 1975:
			unleadedShare += 1.078 * c; 
			case 1974:
			unleadedShare += 0.1667 * c; 
			case 1973:
			unleadedShare += 0.1667 * c; 
			case 1972:
			unleadedShare += 0.1667 * c; 
			case 1971:
			unleadedShare += 0.1667 * c; 
			case 1970:
			unleadedShare += 0.1667 * c;
		}
		if(year > 1995){ unleadedShare = 97}
		if(year < 1970){ unleadedShare = 2}
		unleadedShare = unleadedShare/100;
		//console.log(year, unleadedShare, gasolineUsage, pbPg, (gasolineUsage * unleadedShare * gallonsPerBarrel * ((1995 - year)/(2016*2) + 0.05)) + (gasolineUsage * (1-unleadedShare) * gallonsPerBarrel * pbPg))
		return (gasolineUsage * unleadedShare * gallonsPerBarrel * ((1995 - year)/(2016*2) + 0.05)) + (gasolineUsage * (1-unleadedShare) * gallonsPerBarrel * pbPg)


	}

	abbreviateNumber(value) {
		let newValue = value;
		const suffixes = ["", "K", "M", "B","T"];
		let suffixNum = 0;
		while (newValue >= 1000) {
			newValue /= 1000;
			suffixNum++;
		}

		newValue = newValue.toPrecision(3);

		newValue += suffixes[suffixNum];
		return newValue;
	}

	handleChange = (event) => {
		this.setState({year: event.target.value});
		//console.log(id, this.state[id]);
		//console.log(this.radialGradients)
		//console.log(this.radialGradients)
		const _this = this;
		this.radialGradients.each(function(d,i){
			//console.log(d,i)
			_this.stateNames.select("[class='"+state_names[d.state].ANSI+"']")
				.text(_this.abbreviateNumber(d[_this.state.year]))
			//console.log(_this.stateNames.selectAll("text").select("[class='"+state_names[d.state].ANSI+"']"));
			let f = Math.log10
			d3.select(this).selectAll("stop.start")
				.data([d])
				.transition()
				.attr("offset", d=>(f(d[_this.state.year])- 6.9218)/(10.17609- 6.9218) )
				.attr("stop-opacity", d=> 0.5 * ((f(d[_this.state.year])- 6.9218)/(10.17609- 6.9218) + 0.1)**4 + 0.2)
				.duration(50)
		})
//		this.radialGradients.html(d=>`<stop class="start" offset="${}" stop-color="#464547" stop-opacity="${}"></stop><stop class="end" offset="1" stop-color="#464547" stop-opacity="0"></stop>`)

	}

	showoff(){
		const movetime = 3000;
		const steps = 2016 - 1960;
		var i = 0
		var direction = 1;
		//const _this = this;

		this.trans = d3.interval((t)=>{ 
			i += direction;
			this.handleChange({target:{value:1960 + i}})
			if(i <=0 || i>=steps){
				direction *= -1;
			}
		}, movetime/steps)
		
	}
	stopShowingOff=()=>{
		this.trans.stop();
	}


	render() {
		return (
			<div>
				<svg ref="cloudmap" height='600' width='950' styles={{display:'inline-block'}}></svg>
				<br/>
				</*
				<input ref="opacity" type="range" value={this.state.opacity} onChange={this._handleChange("opacity")}
					   min="1" max="100" step='1'></input>
				<input ref="stop" type="range" value={this.state.stop} onChange={this._handleChange("stop")} min="1"
					   max="100" step='1'></input> 
				<br/>
				*/></>
				<h1>{this.state.year}</h1>
				<h>Click and drag to change year</h>
				<br/>
				<input ref="year" onMouseOver={this.stopShowingOff} type="range" value={this.state.year} onChange={this.handleChange} min="1960"
					   max="2016" step='1'></input>
			</div>
		);
	}

}

export default PollutionCloudMap;
