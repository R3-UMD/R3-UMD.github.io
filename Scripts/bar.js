const dropdown = document.getElementById('question_select');

const width = +document.getElementById('main_col').offsetWidth/2.15;
const height = +document.getElementById('main_col').offsetWidth/2;

const L = document.getElementById('bar_left');
const R = document.getElementById('bar_right');

const left = d3.select('#bar_left')
    .attr('width', width)
    .attr('height', height);
const right = d3.select('#bar_right')
    .attr('width', width)
    .attr('height', height);

function color(a) {
    console.log(a);

}

function renderLeft(data, question) {
    if (L.firstChild) {L.innerHTML = ''}

    if(data) data = data.sort(function(a, b) {
        return d3.descending(a[question], b[question]);
    });

    data = data.slice(0,25);
    const xValue = d => d[question];
    const yValue = d => d.Location;
    const margin = {top: 0, right: 10, bottom: 20, left: 105};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = left.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);


    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);
    g.append('g').call(yAxis);
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => xScale(xValue(d)))
            .attr('height', yScale.bandwidth())
            .attr('class', 'left_bar')
            .attr('style', `fill: ${'black'}`);


    const bars = document.getElementsByClassName('left_bar');
    for (i=0; i < bars.length; i++) {
        const location = bars[i].__data__.Location;
        if (location === 'Baltimore, MD' || location === 'Washington, DC' || location === 'Alexandria, VA' || location === 'Richmond, VA') {
            bars[i].style.fill = '#ffc107';
            }
        $(bars[i])
            .attr('title', 'Prevalence: ' + bars[i].__data__[question] + '%')
            .attr('data-placement', "right")
            .attr('data-toggle', "tooltip")
        }
}

function renderRight(data, question) {
    if (R.firstChild) {R.innerHTML = ''}

    if(data) data = data.sort(function(a, b) {
        return d3.ascending(a[question], b[question]);
    });
    data = data.slice(0,25);
    const xValue = d => d[question];
    const yValue = d => d.Location;
    const margin = {top: 0, right: 105, bottom: 20, left: 10};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = right.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale1 = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);
    const xScale2 = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([innerWidth, 0]);
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const xAxis = d3.axisBottom(xScale2);
    const yAxis = d3.axisRight(yScale);

    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);
    g.append('g')
        .attr('transform', `translate(${innerWidth},0)`)
        .call(yAxis);
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('x', d => innerWidth - xScale1(xValue(d)))
            .attr('y', d => yScale(yValue(d)))
            .attr('width', 0)
            .attr('height', yScale.bandwidth())
            .attr('class', 'right_bar')
            .transition()
            .duration(500)
            .attr('width', d => xScale1(xValue(d)))
            .attr('style', 'fill: #C83232');

    const bars = document.getElementsByClassName('right_bar');
    for (i=0; i < bars.length; i++) {
        $(bars[i])
            .attr('title', 'Prevalence: ' + bars[i].__data__[question] + '%')
            .attr('data-placement', "left")
            .attr('data-toggle', "tooltip")
        }
}

function draw(item_class, question_text) {
    const active = document.getElementsByClassName('active-bar');
    active[0].classList.remove('active','active-bar');

    d3.csv('Data/500cities.csv').then(data => {
        data.forEach(d => {
            d[question_text] = +d[question_text];
        });

    item_class.add('active','active-bar');
    dropdown.innerText = question_text;
    renderLeft(data, question_text);
    renderRight(data, question_text);
    $("[data-toggle=tooltip]").tooltip();

})}

const active = document.getElementsByClassName('active-bar');
draw(active[0].classList, active[0].innerText);