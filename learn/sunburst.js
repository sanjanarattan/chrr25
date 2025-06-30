var DATA;

let margin = { top: 60, right: 10, bottom: 90, left: 10 },
    width = 900 - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

function buildHierarchy(rows) {
    const root = { name: "", children: [] };

    rows.forEach(row => {
        let node = root;

        ["Node", "Focus", "Measure"].forEach(level => {
            if (!row[level]) return;

            let child = (node.children || []).find(d => d.name === row[level]);
            if (!child) {
                child = { name: row[level], children: [] };
                node.children = node.children || [];
                node.children.push(child);
            }

            node = child;
        });
        node.data = row;  
    });

    return root;
}

function sunburst() {

    d3.select("#sunburst").selectAll("*").remove();
    
    const svg = d3.select("#sunburst")
        .append("svg")
        .style("width", width + margin.left + margin.right)
        .style("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", `translate(${(width + margin.left + margin.right) / 2},${(height + margin.top + margin.bottom) / 2})`);

    const radius = Math.min(width, height) / 2

    const hierarchyData = buildHierarchy(DATA); 

    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.data ? 1 : 0) 

    const partition = d3.partition()
        .size([2 * Math.PI, root.height + 1]);

    partition(root);

    if (root.children) {
        const anglePerChild = (2 * Math.PI) / root.children.length;
        root.children.forEach((child, i) => {
            const startAngle = i * anglePerChild;
            const endAngle = (i + 1) * anglePerChild;
            
            function adjustSubtree(node, parentStart, parentEnd) {
                node.x0 = parentStart;
                node.x1 = parentEnd;
                
                if (node.children) {
                    const childAngleRange = parentEnd - parentStart;
                    const anglePerChild = childAngleRange / node.children.length;
                    
                    node.children.forEach((child, j) => {
                        const childStart = parentStart + j * anglePerChild;
                        const childEnd = parentStart + (j + 1) * anglePerChild;
                        adjustSubtree(child, childStart, childEnd);
                    });
                }
            }
            
            adjustSubtree(child, startAngle, endAngle);
        });
    }

    root.each(d => d.current = d);

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => d.y0 * radius / (root.height + 1))
        .outerRadius(d => d.y1 * radius / (root.height + 1) - 1);

    const colors = {
        "Length of Life": "#2E86AB", 
        "Quality of Life": "#A23B72",   
        "Health Infrastructure": "#F18F01", 
        "Physical Environment": "#C73E1D", 
        "Social & Economic Factors": "#592E83"  
    };

    function getColor(d) {
        let category = d;
        while (category.depth > 1) {
            category = category.parent;
        }
        
        const baseColor = colors[category.data.name] || "#666";
        
        if (d.depth === 1) {
            return baseColor;
        } else if (d.depth === 2) {
            return d3.color(baseColor).brighter(0.5);
        } else if (d.depth === 3) {
            return d3.color(baseColor).brighter(1);
        } else {
            return d3.color(baseColor).brighter(1.5);
        }
    }

    const tooltip = d3.select("#sunburst")
        .append("div")  
        .attr("class", "tooltip")
        .style("max-width", "250px")

    g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => getColor(d))
        .attr("stroke", "#fff")
        .attr("stroke-width", 0)
        .attr("d", d => arc(d.current))
        .style("cursor", "none")
        .on("mouseover", function(evt, d) {

            const description =  d.data?.data?.Description || "No description available";
            const [mx, my] = d3.pointer(evt, document.body);
            if (d.depth === 3) {
                console.log(description)
                d3.select(this)
                    .attr("stroke", "#333")
                    .attr("stroke-width", 1);
                tooltip
                    .style("left", (mx + 10) + "px")
                    .style("top", (my - 10) + "px")
                    .style("visibility", "visible")
                    .html(`${d.data.name} : ${description}`);
            }
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .attr("stroke", "#fff")
                .attr("stroke-width", 1);
            
            tooltip.style("visibility", "hidden");
        })
        .on("mousemove", function(evt, d) {
            const description =  d.data?.data?.Description || "No description available";
            const [mx, my] = d3.pointer(evt, document.body);
            if (d.depth === 3) {
                d3.select(this)
                    .attr("stroke", "#333")
                    .attr("stroke-width", 1);
                tooltip
                    .style("left", (mx + 10) + "px")
                    .style("top", (my - 10) + "px")
                    .style("visibility", "visible")
                    .html(`${d.data.name} : ${description}`);
            }
        });


    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.5em")
        .style("font-size", "16px")
        .style("fill", "#333")
        .text("Health Measure");
        
    g.append("text")
        .attr("x", "250")
        .attr("y", "350")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute.")
    g.append("text")
        .attr("x", "190")
        .attr("y", "360")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("University of Wisconsin Population Health Institute Model of Health") 
    g.append("text")
        .attr("x", "160")
        .attr("y", "370")
        .style("font-size", "8px")
        .style("fill", "gray")
        .text("County Health Rankings & Roadmaps 2025. www.countyhealthrankings.org.")
    
    g.append("g")
        .selectAll("text")
        .data(root.descendants().filter(d => d.depth > 0 && (d.x1 - d.x0) > 0.02))
        .join("text")
        .attr("transform", d => {
            const angle = (d.x0 + d.x1) / 2;
            let labelRadius;
            
            if (d.depth === root.height) {
                labelRadius = (d.y0 + 0.1 * (d.y1 - d.y0)) * radius / (root.height + 1);
            } else {
                labelRadius = (d.y0 + d.y1) / 2 * radius / (root.height + 1);
            }
            
            let transform = `translate(${labelRadius * Math.sin(angle)}, ${-labelRadius * Math.cos(angle)})`;
            
            if (d.depth === root.height) {
                const rotationAngle = (angle * 180 / Math.PI) - 90;
                const finalRotation = (rotationAngle > 90 || rotationAngle < -90) ? rotationAngle + 180 : rotationAngle;
                transform += ` rotate(${finalRotation})`;
            }
            
            return transform;
        })
        .attr("text-anchor", d => {
            if (d.depth === root.height) {
                const angle = (d.x0 + d.x1) / 2;
                const rotationAngle = (angle * 180 / Math.PI) - 90;
                return (rotationAngle > 90 || rotationAngle < -90) ? "end" : "start";
            }
            return "middle";
        })
        .attr("dy", "0.35em")
        .style("font-size", d => {
            const segmentSize = d.x1 - d.x0;
            if (d.depth === 1) return "10px";
            if (d.depth === 2) return "10px";
            return "10px";
        })
        .style("fill", "#333")
        .style("font-weight", d => d.depth === 1 ? "bold" : "normal")
        .text(d => {
            const segmentSize = d.x1 - d.x0;
            const name = d.data.name;
            
            return name;
        })
        .each(function(d) {
            const text = d3.select(this);
            const words = text.text().split(/\s+/);
            const lineHeight = 1.1
            
            if (words.length > 1 && d.depth <= 2 && d.depth !== root.height) {
                text.text(null);
                
                words.forEach((word, i) => {
                    text.append("tspan")
                        .attr("x", 0)
                        .attr("dy", i === 0 ? 0 : lineHeight + "em")
                        .text(word);
                });
            }
        });
}

async function loadData() {
    try {
        const data = await d3.csv("../data/about.csv");
        DATA = data;
        console.log(DATA);       
        sunburst();
    } catch(err) {
        console.log("Error loading data:", err);
    }
}

loadData();