function color(values, map, svg){

    const colorScale = d3.scaleSequential()
        .domain(d3.extent(values))
        .interpolator(d3.interpolateBuPu)

    const tooltip = d3.select("#map")
        .append("div")  
        .attr("class", "tooltip")

    svg
        .selectAll("path")
        .filter(d => d && d.id)
        .attr("fill", d => {
            const value = map.get(d.id);
            return value !== undefined ? colorScale(value) : "#fff"
        })
        .on("mouseover", function (evt, d) {
            const [mx, my] = d3.pointer(evt)
            const value = map.get(d.id);
            const name = d.properties?.name || "Unknown"
            tooltip
                .transition()
                .style("left", (mx + 10) + "px")
                .style("top", (my + 10) + "px")
                .style("opacity", 1)
                .text(`${name}\n${value !== undefined ? value : "NaN"}`);
        })
        .on("mousemove", function (evt) {
            const [mx, my] = d3.pointer(evt);
            tooltip
                .style("left", (mx + 10) + "px")
                .style("top", (my + 10) + "px")
        })
        .on("mouseout", function () {
            tooltip.transition()
                .style("opacity", 0);
        });

    var legendScale = d3.scaleSequential(d3.interpolateBuPu)
        .domain(d3.extent(values));

    svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(750,20)")
    
    var legend = d3.legendColor()
        .shapeWidth(15)
        .cells(5)
        .orient("vertical")
        .scale(legendScale)

    svg
        .select(".legend")
	  	.call(legend)
    
}
    
function colorStates(property) {
    const state_svg = d3.select("#statemap")
    data = getData()[0]

    const stateData = data.filter(d => d['County FIPS Code'] === "000" && d['Name']!== 'United States')
    const values = stateData.map(d => +d[property])

    const stateMap = new Map();
    stateData.forEach(d => {
        const fips = d['State FIPS Code'].padStart(2, '0')
        stateMap.set(fips, +d[property])
    });

    color(values, stateMap, state_svg)

}

function colorCounties(property) {
    const county_svg = d3.select("#countiesmap");
    const data = getData()[0];

    const county_data = data.filter(d => d['County FIPS Code'] !== '000')
    const values = county_data.map(d => +d[property])

    const countyMap = new Map();
    county_data.forEach(d => {
        const fips = d['5-digit FIPS Code'].padStart(5, '0')
        countyMap.set(fips, +d[property])
    });

    color(values, countyMap, county_svg)

}
