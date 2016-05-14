console.log("connected to app.js");
$(document).ready(function(){
  //gets graph data from database, generates graph
  $.ajax({
    url: "/users",
    method: "GET"
  }).done(function(data){
    dataArray = JSON.parse(data);
  }).done(d3stuff);

    dataArray = [];
    // set the date and time to today by default
    $("#date").val(new Date().toISOString().substring(0, 10));
    $("#time").val(new Date().toTimeString().substring(0,5));
    // grabs values from form, sends to database, refreshes graph(s)
    var sendVitals = function(){
      var bloodGlucose = $("#bg").val();
      var date = $("#date").val();
      var time = $("#time").val();
      var dateTime = new Date(date + "T" + time);
      dateTime = dateTime.toISOString();
      $.ajax({
        url: "/users",
        method: "POST",
        data: {"username": "Cyrus", "bg": bloodGlucose, "updated_at": dateTime},
        dataType: "json"
      }).done(function(){
        $("#graphs").html("");
        $("#vitals").trigger("reset");
        // set the date and time to today by default
        $("#date").val(new Date().toISOString().substring(0, 10));
        $("#time").val(new Date().toTimeString().substring(0,5));
        $.ajax({
          url: "/users",
          method: "GET"
        }).done(function(data){
          dataArray = JSON.parse(data);
        }).done(d3stuff);
      });
    };

    //triggers sendvitals function on submit
    $("#submit").on("click", function(e){
        e.preventDefault();
        sendVitals();
        $(window).on('resize', function(){
            // $("#graphs").animate(sendVitals);
            $("#graphs").html("");
            d3stuff();
        });
    });

    $("#allhistory").on("click", function(e){
        console.log(e);
        e.preventDefault();
        sendVitals();
        $(window).on('resize', function(){
            // $("#graphs").animate(sendVitals);
            $("#graphs").html("");
            d3stuff();
        });
    });

    $("#past1week").on("click", function(e){
        e.preventDefault();
        $("#graphs").html("");
        $.ajax({
          url: "/past1week",
          method: "GET"
        }).done(function(data){
          dataArray = JSON.parse(data);
        }).done(d3stuff);
        $(window).on('resize', function(){
            // $("#graphs").animate(sendVitals);
            $("#graphs").html("");
            d3stuff();
        });
    });

    $("#past2weeks").on("click", function(e){
        e.preventDefault();
        $("#graphs").html("");
        $.ajax({
          url: "/past2weeks",
          method: "GET"
        }).done(function(data){
          dataArray = JSON.parse(data);
        }).done(d3stuff);
        $(window).on('resize', function(){
            // $("#graphs").animate(sendVitals);
            $("#graphs").html("");
            d3stuff();
        });
    });


    ///////////////////////////////////////////// D3 GRAPH CODE BELOW
    function d3stuff(){

      //program variables
      newArray = [];
      var w = window.innerWidth,
          h = 200;

      var padding = 40;

      var timeFormat = d3.time.format("%Y-%m-%dT%H:%M:%S%LZ");

      for (var i = 0; i< dataArray.length; i++) {
        var bg = dataArray[i].bg;
        var date = new Date(dataArray[i].updated_at);
        newArray.push([bg, date]);
      }



      //scaling

      var dateFn = function(d) { return timeFormat.parse(d.updated_at);};

      var xScale = d3.time.scale()
                     .domain(d3.extent(newArray, function(d) { return d[1]; }))
                     .range([0+padding, w-padding]);

      var yScale = d3.scale.linear()
                    .domain([d3.min(newArray, function(d){return d[0]}),d3.max(newArray, function(d){return d[0]})])
                    .range([h - padding, 0 + padding]);

                    // will make "y" values actually go bottom-up (opp of coord system).range([h - padding, 0 + padding]);
      //creates svg
      var svg = d3.select('#graphs').append('svg')
                  .attr('width', w)
                  .attr('height', h);

      //creates, animates circles
      var circles = svg.selectAll('circle')
                       .data(newArray)
                       .enter()
                       .append('circle')
                       .attr('cx', function(d){return xScale(d[1]);})
                       .attr('cy', 0)
                       .attr('r', 0)
                       .transition()
                       .delay(function(d, i) {
                          return i * 100;
                       })
                         .duration(2000)
                         .ease('linear')
                         .attr('cy', function(d){return yScale(d[0])})
                         .attr('r', 4)
                         .attr('fill', function(d,i){return 'rgb(' + yScale(d[0]) + ',0,0)'});

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
    };
});
