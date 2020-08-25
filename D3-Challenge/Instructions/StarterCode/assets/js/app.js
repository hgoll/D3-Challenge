//margins
var svgWidth =600,
svgHeight =600;

var margin = {
t:50,
r:50,
b:100,
l:100,
}; 

var width = svgWidth - margin.l - margin.r,
height = svgHeight - margin.t - margin.b;

//select #scatter
var svg = d3.select('#scatter')
	.classed('chart',true)
	.append('svg')
	.attr('width', svgWidth)
	.attr('height',svgHeight)

var chart1 = svg.append('g')
	.attr('transform',`translate(${margin.l},${margin.t})`)


// chart

d3.csv("data.csv").then( data =>{
data.forEach( d =>{
	d.poverty = +d.poverty;
	d.age = +d.age;
	d.income = +d.income;
	d.obesity = +d.obesity;
	d.smokes = +d.smokes;
	d.healthcare = +d.healthcare;
});

var povertyAxis = 'poverty',
	healthAxis = 'healthcare';

var xScale = getXaxis(data,povertyAxis),
	yScale = getYaxis(data,healthAxis);


var yAxis = d3.axisLeft(yScale),
	xAxis = d3.axisBottom(xScale);

	chart1.append('g')
	.attr('transform',`translate(0,${height})`)
	.call(xAxis)
	.call(yAxis);

	chart1.append("text")
	.attr("transform", `translate(${width - 40},${height - 5})`)
	.attr("class", "axis-text-main")
	.text("Demographics")
	.attr("transform", `translate(15,60 )rotate(270)`)
	.attr("class", "axis-text-main")
	.text("Behavioral Risk")



var stateCircles = chart1.selectAll('circle')
	.data(data)
	.enter()
	.append('circle')
	.classed('stateCircle',true)
	.attr('cx', d => xScale(d[povertyAxis]))
	.attr('cy', d => yScale(d[healthAxis]))
	.attr('r' , 10)
	


var xLabelsGroup = chart1.append('g')
	.attr('transform', `translate(${width / 2}, ${height + 20})`);

xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 20)
	.attr('value', 'poverty')
	.classed('aText active', true)
	.text('In Poverty (%)');

var yLabelsGroup = chart1.append('g')

yLabelsGroup.append('text')
	.attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	.attr('value', 'healthcare')
	.classed('aText active', true)
	.text('Lacks Healthcare (%)');


var stateCircles = updateToolTip(healthAxis,povertyAxis,stateCircles,stateText),
	stateText = updateToolTip(healthAxis,povertyAxis,stateCircles,stateText);



yLabelsGroup.selectAll('text')
	.on('click', function() {
		var value = d3.select(this).attr('value');
		if (value !== healthAxis) {
			healthAxis = value;

			yScale = getYaxis(data, healthAxis);

			yAxis.transition()
				.duration(1000)
				.ease(d3.easeBack)
				.call(d3.axisLeft(yScale));

			stateCircles.transition()
				.duration(1000)
				.ease(d3.easeBack)
				.on('start',function(){
					d3.select(this)
						.attr("opacity", 0.50)
						.attr('r',15);
				})
				.on('end',function(){
					d3.select(this)
						.attr("opacity", 1)
						.attr('r',10)
				})
				.attr('cy', d => yScale(d[healthAxis]));

			d3.selectAll('.stateText').transition()
				.duration(1000)
				.ease(d3.easeBack)
				.attr('y', d => yScale(d[healthAxis]));

			stateCircles = updateToolTip(healthAxis,povertyAxis,stateCircles,stateText),
			stateText = updateToolTip(healthAxis,povertyAxis,stateCircles,stateText);

		}
	});

});


function getXaxis(data,povertyAxis) {
var xScale = d3.scaleLinear()
	.domain([d3.min(data, d => d[povertyAxis])*.9, 
			d3.max(data, d => d[povertyAxis])*1.1])
	.range([0, width]);

return xScale;
}

function getYaxis(data,healthAxis) {
var yScale = d3.scaleLinear()
	.domain([d3.min(data, d => d[healthAxis])*.9, 
			d3.max(data, d => d[healthAxis])*1.1])
	.range([height, 0]);

return yScale;
}
