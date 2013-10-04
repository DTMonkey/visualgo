var mainSvg = d3.select("#viz")
                .append("svg")
                .attr("width", MAIN_SVG_WIDTH)
                .attr("height", MAIN_SVG_HEIGHT);

var pseudocodeSvg = d3.select("#pseudocode")
                      .append("svg")
                      .attr("width", PSEUDOCODE_SVG_WIDTH)
                      .attr("height", PSEUDOCODE_SVG_HEIGHT);

var markerSvg = mainSvg.append("g")
                .attr("id", "marker");