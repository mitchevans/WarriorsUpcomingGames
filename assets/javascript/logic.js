// object with team ids for api input
let Players = {   "Houston Rockets": "134876",
            "Oklahoma City Thunder": "134887", 
                "San Antonio Spurs": "134879", 
                "Minnesota Timberwolves": "134886",
                "Indiana Pacers": "134873",
                "Dallas Mavericks": "134875",
                "Detroit Pistons": "134872"};

// api for displaying schedule
var queryURL = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=134865"
$.ajax({
    url: queryURL,
    method: "GET",

}).then(function (response) {
    
    var scheduleResults = response.events;

    for (var i = 0; i < scheduleResults.length; i++) {

        //determining the opposing team and againstStatement
        if (scheduleResults[i].strHomeTeam === "Golden State Warriors"){
            var opponent = scheduleResults[i].strAwayTeam;
            var againstStatement = "vs " + opponent;
        }
        else {
        var opponent = scheduleResults[i].strHomeTeam;
        var againstStatement = "@ " + opponent;
            };


        // displaying the againstStatement and date of game
        var gameDiv = $("<div>");
        gameDiv.html("<p>" + againstStatement + "</p>" +
                    "<p>" + scheduleResults[i].dateEvent + " at " + scheduleResults[i].strTime  + "</p>" );
        gameDiv.addClass("gameContainer");
    
    
        $("#schLoc").append(gameDiv);
       // console.log(gameDiv)
        $(gameDiv).attr('id', opponent);
        $(gameDiv).val((scheduleResults[i].dateEvent + " at " + scheduleResults[i].strTime));
        $("#games-view").append(gameDiv);
        //console.log(opponent);

    }
//****************** */ initial display in content area***************************************************************************


if (scheduleResults[0].strHomeTeam === "Golden State Warriors"){
    var initialOpponent = scheduleResults[0].strAwayTeam;
}
else {
var initialOpponent = scheduleResults[0].strHomeTeam;
    };

$("#gameTimeContent").text((initialOpponent + " " + scheduleResults[0].dateEvent + " at " + scheduleResults[0].strTime));

// initial display gif in content area
var query2URL = "https://api.giphy.com/v1/gifs/random?api_key=fTQFhu3tMcEVU2sqaVkMweJGunYG68UR&tag=" + initialOpponent;

    $.ajax({
        url: query2URL,
        method: "GET"
        })
    
        .then(function(response) {
            var results = response.data;
            var topicImage = $("<img>");
            topicImage.attr("src",results.images.original.url);//source of the gif
            topicImage.addClass("gif");
            $("#gifDisplay").html(topicImage);
        })

//initial roster api 

var queryURL = "https://www.thesportsdb.com/api/v1/json/1/lookup_all_players.php?id=" + Players[initialOpponent];

$.ajax({
    url: queryURL,
    method: "GET",

}).then(function (response) {

    var results = response.player;

    for (var i = 0; i < results.length; i++) {
        var player = $("<p>");
        player.text(results[i].strPlayer + ", " + results[i].strPosition);
        $("#playerList").append(player);
    }
})

//initial team info api
var queryURL = "https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=" + Players[initialOpponent]; 

$.ajax({
 url: queryURL,
 method: "GET",

}).then(function (response) {
    console.log(response)
    var results = response.teams[0];
    console.log(results.strTeamBadge);

    var logo = $("<img>");
    logo.attr("src", results.strTeamBanner);
    logo.attr("id", "logo");
// console.log(logo)
    $("#contentTitle").html(logo);
 })
     



// ************** on clicking a schedule display gif and roster ********************************************************************

    $(".gameContainer").on("click", function(){
        // gameId is id(name of opposing team) of the gameContainer that is clicked 
        var gameId= $(this).prop("id");
        var gameTime= $(this).val();
        $("#gameTimeContent").text(gameId + " " + gameTime);
        // clearing roster list
        $("#playerList").html("");

//gif api
        
        var query3URL = "https://api.giphy.com/v1/gifs/random?api_key=fTQFhu3tMcEVU2sqaVkMweJGunYG68UR&tag=" + gameId;

        $.ajax({
            url: query3URL,
            method: "GET"
            })
        
            .then(function(response) {
                var results = response.data;
                var topicImage = $("<img>");
                topicImage.attr("src",results.images.original.url);//source of the gif
                topicImage.addClass("gif");

                $("#gifDisplay").html(topicImage);
                
            })

//roster api
        var queryURL = "https://www.thesportsdb.com/api/v1/json/1/lookup_all_players.php?id=" + Players[gameId];
    
    $.ajax({
        url: queryURL,
        method: "GET",
    
    }).then(function (response) {
    
        var results = response.player;

    
        for (var i = 0; i < results.length; i++) {
            var player = $("<p>");
            player.text(results[i].strPlayer + ", " + results[i].strPosition);
        
        $("#playerList").append(player);
        }
    })

 //team info api
 var queryURL = "https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=" + Players[gameId];
    
 $.ajax({
     url: queryURL,
     method: "GET",
 
 }).then(function (response) {
 
     var results = response.teams[0];
 
         var logo = $("<img>");
         logo.attr("src", results.strTeamBanner);
        logo.attr("id", "logo");
   
     $("#contentTitle").html(logo);
     })
 
//setting content date



            
    })
});

var config = {
    apiKey: "AIzaSyDUhdVMGCvPncMs5xK5iFRPU5HPIsaEnnE",
    authDomain: "dubsmatchup.firebaseapp.com",
    databaseURL: "https://dubsmatchup.firebaseio.com",
    projectId: "dubsmatchup",
    storageBucket: "dubsmatchup.appspot.com",
    messagingSenderId: "678161686628"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  $("#add-comment-btn").on("click", function(event) {
    event.preventDefault();
    // Grabs user input
    var comment = $("#userComment-input").val().trim();
    var newComment = {
      userComment: comment,
    };
    database.ref().push(newComment);
    console.log(newComment.userComment);
    $("#userComment-input").val("");
  });
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    // Storeinto a variable.
    var comment = childSnapshot.val().userComment;
    console.log(comment);
    var newComment = $(".container-fluid").prepend(
      $("<ul>").text(comment),
    );
  });
 
 



