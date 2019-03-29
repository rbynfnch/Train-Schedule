// Add Event Listener

(function() {
  "use strict";
  window.addEventListener(
    "load",
    function() {
      //fetch all the forms for custom bootstrap validation styles
      var forms = document.getElementsByClassName("needs-validation");
      //Loop over the forms and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener(
          "submit",
          function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    },
    false
  );
})();

// Initialize Firebase

var config = {
  apiKey: "AIzaSyDlAR5hdjzriTv3vowYLQIX4h-o5UU9zPM",
  authDomain: "train-schedule-d5579.firebaseapp.com",
  databaseURL: "https://train-schedule-d5579.firebaseio.com",
  projectId: "train-schedule-d5579",
  storageBucket: "train-schedule-d5579.appspot.com",
  messagingSenderId: "614372248239"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Trains

$("#submit-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var input = $("input");
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDestination = $("#destination-input")
    .val()
    .trim();
  var firstTrainTime = moment(
    $("#first-train-time-input")
      .val()
      .trim(),
    "HH:mm"
  );
  //.format("X");
  var trainFrequency = parseInt(
    $("#frequency-input")
      .val()
      .trim()
  );

  if (trainName.length === 0) {
    trainName = "";
    $("#train-name-input").val("");
    $("#train-name-input").attr("class", "form-control is-invalid");
    $("invalid-name").text("Please enter a Train Name");
  } else {
    $("#train-name-input").attr("class", "form-control");
    $("#invalid-name").text("");
  }

  if (trainDestination.length === 0) {
    trainDestination = "";
    $("#destination-input").val("");
    $("#destination-input").attr("class", "form-control is-invalid");
    $("invalid-destination").text("Please enter a Train Destination");
  } else {
    $("#destination-input").attr("class", "form-control");
    $("#invalid-destination").text("");
  }

  if (Number.isInteger(trainFrequency) === false) {
    $("#frequency-input").val("");
    $("#frequency-input").attr("class", "form-control is-invalid");
    $("#invalid-time").text("Please enter a valid time");

    return;
  }

  $("#first-train-time-input").attr("class", "form-control is-invalid");
  $("#invalid-time").text("");

  //Create local object for holding train data

  var newTrain = {
    name: trainName,
    destination: trainDestination,
    firstTrainTime: firstTrainTime.format("HH:mm"),
    frequency: trainFrequency
  };
  $("#first-train-time-input").attr("class", "form-group");
  $("#helpBlock").text("");

  // push Train data to Firebase

  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrainTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTrainTime-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event watcher and initial loader

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var trainFrequency = childSnapshot.val().frequency;

  var convertedTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  console.log(convertedTime);

  //current Time
  var currentTime = moment();

  //difference between the times
  var diffTime = moment().diff(moment(convertedTime), "minutes");
  console.log("Difference in time: " + diffTime);

  //Time apart
  var timeRemainder = diffTime % trainFrequency;
  console.log(timeRemainder);

  //Minutes until train
  var minutesAway = trainFrequency - timeRemainder;
  console.log("Minutes until train: " + minutesAway);

  //Next Train
  var nextArrival = moment().add(minutesAway, "minutes");
  console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextArrival.format("HH:mm")),
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#train-table").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Train firstTrainTime date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attTraint we use meets this test case
