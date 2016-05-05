console.log("connected to app.js");
$(document).ready(function(){
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
});
