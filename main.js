const dataset = fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((res) => res.json())
  .then((res) => loadGraph(res));

//Load the page content
const loadGraph = (data) => {
  const root = d3.select("body").append("div").attr("id", "root");
  console.log(data);

  //Append the title
  root
    .append("h1")
    .attr("id", "title")
    .text("Doping in Professional Bycicle Racing");

  //Generate Canvas

  const width = 1100;
  const height = 500;
  const padding = 50;

  const svg = root.append("svg").attr("width", width).attr("height", height);

  //Add Axies
  const xScale = d3.scaleTime();
  const baseDate = new Date(d3.min(data, (item) => item.Year) - 1, 0, 1);
  const topDate = new Date(d3.max(data, (item) => item.Year) + 1, 0, 1);
  xScale.domain([baseDate, topDate]);
  xScale.range([padding, width - padding]);

  const yScale = d3.scaleTime();
  const baseMinutes = d3.min(data, (item) => new Date(item.Seconds * 1000));
  const topMinutes = d3.max(data, (item) => new Date(item.Seconds * 1000));

  yScale.domain([baseMinutes, topMinutes]);
  yScale.range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  //Add Tooltip
  const tooltip = root
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  //Add Dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
    .attr("cy", (d) => yScale(d.Seconds * 1000))
    .attr("r", 5)
    .attr("fill", (item) => {
      if (item.URL !== "") {
        return "blue";
      } else {
        return "orange";
      }
    })
    .attr("data-xvalue", (item) => item.Year)
    .attr("data-yvalue", (item) => new Date(item.Seconds * 1000))
    .on("mouseover", (data) => {
      tooltip.transition().style("visibility", "visible");
      tooltip.text(data.originalTarget.__data__.Year);
      document
        .getElementById("tooltip")
        .setAttribute("data-year", data.originalTarget.__data__.Year);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
      tooltip.text("");
      document.getElementById("tooltip").setAttribute("data-year", "");
    });

  //Add Legend
  root.append("div").attr("id", "legend");

  d3.select("#legend").append("p").text(`Orange = No Dopping Allegations`);
  d3.select("#legend")
    .append("p")
    .text(`Blue = Riders With Doping Allegations`);
};
