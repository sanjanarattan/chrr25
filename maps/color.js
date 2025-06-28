function colorStates(property) {

    const state_svg = d3.select("#statemap")
    data = getData()[0]
    //console.log(data)

    const stateData = data.filter(d => d['County FIPS Code'] === "000" && d['Name']!== 'United States')
    //console.log(stateData)

    const values = stateData.map(d => +d[property])
    //console.log(values)

    const colorScale = d3.scaleQuantize()
        .domain(d3.extent(values))
        .range(d3.schemeBlues[9])

    const stateMap = new Map();
    stateData.forEach(d => {
        const fips = d['State FIPS Code'].padStart(2, '0')
        stateMap.set(fips, +d[property])
    });

    state_svg.selectAll("path")
        .filter(d => d && d.id)
        .attr("fill", d => {
            const value = stateMap.get(d.id);
            return value !== undefined ? colorScale(value) : "#fff"
        })

}

function colorCounties(property) {
    const county_svg = d3.select("#countiesmap");
    const data = getData()[0];

    const county_data = data.filter(d => d['County FIPS Code'] !== '000');

    const values = county_data.map(d => +d[property]).filter(v => !isNaN(v));
    const colorScale = d3.scaleQuantize()
        .domain(d3.extent(values))
        .range(d3.schemeBlues[9]);

    const countyMap = new Map();
    county_data.forEach(d => {
        const fips = d['5-digit FIPS Code'].padStart(5, '0');
        countyMap.set(fips, +d[property]);
    });

    county_svg.selectAll("path")
        .filter(d => d && d.id && d.id.length === 5)  
        .attr("fill", d => {
            const value = countyMap.get(d.id);
            return value !== undefined ? colorScale(value) : "#fff";
        });
}
