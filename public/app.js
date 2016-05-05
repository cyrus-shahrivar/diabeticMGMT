console.log("connected to app.js");
$(document).ready(function(){
    var dataArray = [];
    var sendVitals = function(){
      var bloodGlucose = $("#bg").val();
      $.ajax({
        url: "/users",
        method: "POST",
        data: {"username": "Cyrus", "bg": bloodGlucose},
        dataType: "json"
      }).done($("#vitals").trigger("reset"));
    };

    $("#vitals").on("click", sendVitals);

    $.ajax({
      url: "/users",
      method: "GET"
    }).done(function(data){
      dataArray = JSON.parse(data);
      console.log(dataArray);
    });

    ///////////////////////////////////////////// D3 GRAPH CODE BELOW
    //program variables
    var array = [];
    var w = 600,
        h = 200;

    var padding = 40;
    //2016-05-05T17:30:40.478Z
    var timeFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ");

    for (var i = 0; i< dataArray.length; i++) {
      console.log("l");
      var bg = dataArray[i].bg;
      var date = timeFormat.parse(dataArray[i].created_at);
      array.push([bg, date]);
    }

    // // random data filling
    // var numDataPoints = 50;
    // var xRange = Math.random() * 500;
    // var yRange = Math.random() * 500;
    // for (var i = 0; i < numDataPoints; i++) {
    //     var newNumber1 = Math.round(Math.random() * xRange);
    //     var newNumber2 = Math.round(Math.random() * yRange);
    //     array.push([newNumber1, newNumber2]);
    // }

    //scaling
    var xScale = d3.scale.linear()
                  .domain([d3.min(array, function(d){return d[0]}),d3.max(array, function(d){return d[0]})])
                  .range([0 + padding, w - padding]);

    var yScale = d3.scale.linear()
                  .domain([d3.min(array, function(d){return d[1]}),d3.max(array, function(d){return d[1]})])
                  .range([h - padding, 0 + padding]);

                  // will make "y" values actually go bottom-up (opp of coord system).range([h - padding, 0 + padding]);
    //creates svg
    var svg = d3.select('#graphs').append('svg')
                .attr('width', w)
                .attr('height', h);

    //creates, animates circles
    var circles = svg.selectAll('circle')
                     .data(array)
                     .enter()
                     .append('circle')
                     .attr('cx', function(d){return xScale(d[0])})
                     .attr('cy', 0)
                     .attr('r', 0)
                     .transition()
                     .delay(function(d, i) {
                        return i * 100;
                     })
                       .duration(2000)
                       .ease('linear')
                       .attr('cy', function(d){return yScale(d[1])})
                       .attr('r', 4)
                       .attr('fill', function(d,i){return 'rgb(' + yScale(d[1]) + ',0,0)'});

    //creates axes
    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom');


    var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('left');

    svg.append('g')
       .attr('transform', 'translate(0,' + (h - padding) + ')')
       .attr('class', 'axis')
       .call(xAxis);

    svg.append('g')
       .attr('transform', 'translate(' + (padding) + ',0)')
       .attr('class', 'axis')
       .call(yAxis);
    ///////////////////////////////////////////// END OF D3 CODE
});
