// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new Trains - then update the html + update the database
// 3. Create a way to retrieve Trains from the Train database.
// 4. Create a way to calculate the months worked. Using difference between firstTrainTime and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

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

// 2. Button for adding Trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
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
    "MM/DD/YYYY"
  ).format("X");
  var trainFrequency = $("#frequency-input")
    .val()
    .trim();

  // Creates local "Train" object for holding Train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    firstTrainTime: firstTrainTime,
    frequency: trainFrequency
  };

  // Uploads Train data to the database
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

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(firstTrainTime);
  console.log(trainFrequency);

  // Prettify the Train firstTrainTime
  var firstTrainTimePretty = moment.unix(firstTrainTime).format("HH:mm");

  // Calculate the next arrival time
  var trainNextArrival = moment().fromNow(
    moment(firstTrainTime, "X"),
    "months"
  );
  console.log(trainNextArrival);

  // Calculate the total billed frequency
  var trainNext = trainNextArrival + trainFrequency;
  console.log(trainNext);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(firstTrainTimePretty),
    $("<td>").text(trainNextArrival),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainNext)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Train firstTrainTime date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attTraint we use meets this test case
