var mapJson
var countiesJson

let margin = { top: 0, right: 50, bottom: 10, left: 50 },
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


function drawCounties() {
    d3.select("svg").remove();

    const counties_svg = d3.select("#map")
        .append("svg")
        .attr("id", "countiesmap")
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom);

    counties_svg
        .append("g")
        .append("path")
        .datum(topojson.feature(mapJson, mapJson.objects.nation))
        .attr("d", d3.geoPath())
        .attr("fill", "#ccc")
        .attr("transform", "scale(0.7)");

    counties_svg
        .append("g")
        .attr("stroke", "black")
        .attr("fill", "#eee")
        .selectAll("path")
        .data(topojson.feature(mapJson, mapJson.objects.states).features)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("transform", "scale(0.7)");

    counties_svg
        .append("g")
        .attr("stroke", "black")
        .attr("fill", "#eee")
        .selectAll("path")
        .data(topojson.feature(countiesJson, countiesJson.objects.counties).features)
        .join("path")
        .attr("d", d3.geoPath())
        .attr("transform", "scale(0.7)");
}

function drawStates() {

    d3.select("svg").remove()

    const state_svg = d3.select("#map")
        .append("svg")
        .attr('id', 'statemap')
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom)

    state_svg
        .append('g')
        .append('path')
        .datum(topojson.feature(mapJson, mapJson.objects.nation))
        .attr('d', d3.geoPath())
        .attr("transform", "scale(0.7)")

    state_svg
        .append('g')
        .attr('stroke', 'black')
        .attr('fill', '#eee')
        .selectAll('path')
        .data(topojson.feature(mapJson, mapJson.objects.states).features)
        .join('path')
        .attr('d', d3.geoPath())
        .attr("transform", "scale(0.7)")


}

async function loadJson(){
    const res = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json`)
    const res2 = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-albers-10m.json`)
    mapJson = await res.json()
    countiesJson = await res2.json()
    drawStates()
}

loadJson()
