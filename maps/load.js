var mapJson
var countiesJson
var DATA
var FILTERED

let margin = { top: 10, right: 50, bottom: 10, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


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
    
    counties_svg
        .append("text")
        .attr("x", "250")
        .attr("y", "350")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute.")

    counties_svg
        .append("text")
        .attr("x", "190")
        .attr("y", "360")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute Model of Health") 

    counties_svg
        .append("text")
        .attr("x", "160")
        .attr("y", "370")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("County Health Rankings & Roadmaps 2025. www.countyhealthrankings.org.")
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

    state_svg
        .append("text")
        .attr("id", "citation")
        .attr("x", "690")
        .attr("y", "350")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute.")

    state_svg
        .append("text")
        .attr("id", "citation")
        .attr("x", "630")
        .attr("y", "360")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute Model of Health") 
        
    state_svg
        .append("text")
        .attr("id", "citation")
        .attr("x", "600")
        .attr("y", "370")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("County Health Rankings & Roadmaps 2025. www.countyhealthrankings.org.")
}

function getData(){
    return DATA
}

async function loadData(){
    Promise.all([
        d3.csv("../data/analytic_data2025.csv"),
    ]).then(function(data) {
        DATA = data        
        // console.log(DATA)
    }).catch(function(err) {
        console.log(err)
    });

}

async function loadPath(){
    const res = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json`)
    const res2 = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-albers-10m.json`)
    mapJson = await res.json()
    countiesJson = await res2.json()
    drawStates()

}

loadData()
loadPath()


