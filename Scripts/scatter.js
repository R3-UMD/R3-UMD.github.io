const drop = document.getElementById('scatter_drop');

const w = +document.getElementById('main_col').offsetWidth;
const h = +document.getElementById('main_col').offsetWidth/2;

const svg = d3.select('#scatter')
    .attr('width', w)
    .attr('height', h);

function render_scat(data, question) {
    if (document.getElementById('scatter').firstChild) {document.getElementById('scatter').innerHTML = ''}

    const xValue = d => +d['Mental Health'];
    const yValue = d => +d[question];
    const margin = {top: 5, right: 7.5, bottom: 45, left: 45};
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();

    yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', -35)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(question + ' (%)');

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 35)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text('Prevalence of poor mental health (%)');

    g.selectAll('circle').data(data)
        .enter().append('circle')
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('opacity', 0.75)
            .attr('class', 'point')
            .attr('r', 7.5);

    const points = document.getElementsByClassName('point');
    for (i=0; i < points.length; i++) {
        const City = points[i].__data__.City;
        const mental = points[i].__data__['Mental Health'];
        const other_question = points[i].__data__[question];

        if (City === 'Alexandria') {
            points[i].style.fill = '#c80000';}
        else if (City === 'Baltimore') {
            points[i].style.fill = '#e17d00';}
        else if (City === 'Richmond') {
            points[i].style.fill = '#006400';}
        else if (City === 'Washington') {
            points[i].style.fill = '#00007d';
        }
        $(points[i])
            .attr('title', 'City: ' + City + '<br>' + 'Mental Health: ' + mental + '%' + '<br>' + question + ': ' + other_question + '%')
            .attr('data-placement', "top")
            .attr('data-html', "true")
            .attr('data-toggle', "tooltip")
        }
}

function scatter(item_class, question_text) {
    const active_scat = document.getElementsByClassName('active-scat');
    active_scat[0].classList.remove('active','active-scat');

    d3.csv('Data/TractGIS.csv').then(data => {
        data.forEach(d => {
            d[question_text] = +d[question_text];
            d['Mental Health'] = +d['Mental Health'];
        });

    item_class.add('active','active-scat');
    drop.innerText = question_text;
    render_scat(data, question_text);
    $("[data-toggle=tooltip]").tooltip();

})}

const active_scat = document.getElementsByClassName('active-scat');
scatter(active_scat[0].classList, 'Current Smoking');