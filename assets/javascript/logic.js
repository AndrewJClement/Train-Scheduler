$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCziIkCq4mC-CcITLbaF0ECcNoOhWIgOXI",
    authDomain: "train-scheduler-dd556.firebaseapp.com",
    databaseURL: "https://train-scheduler-dd556.firebaseio.com",
    storageBucket: "train-scheduler-dd556.appspot.com",
    messagingSenderId: "663159046090"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Capture Button Click
  $("#addTrain").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#interval").val().trim();

    // Code for handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });
  });


  // Firebase watcher + initial loader
  database.ref().on("child_added", function (childSnapshot) {

    var newTrain = childSnapshot.val().trainName;
    var newLocation = childSnapshot.val().destination;
    var newFirstTrain = childSnapshot.val().firstTrain;
    var newFrequency = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");

    // Difference between the times
    var diffTime = moment().diff(moment(startTimeConverted), "minutes");

    // Time apart (remainder)
    var timeRemainder = diffTime % newFrequency;

    // Minute(s) Until Train
    var timeMinutesTillTrain = newFrequency - timeRemainder;

    // Next Train
    var nextTrain = moment().add(timeMinutesTillTrain, "minutes");
    var catchTrain = moment(nextTrain).format("HH:mm");

    // Display On Page
    $("#all-display").append(
      ' <tr><td>' + newTrain +
      ' </td><td>' + newLocation +
      ' </td><td>' + newFrequency +
      ' </td><td>' + catchTrain +
      ' </td><td>' + timeMinutesTillTrain + ' </td></tr>');

    // Clear input fields
    $("#trainName, #destination, #firstTrain, #interval").val("");
    return false;
  },
    //Handle the errors
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

  //current time
  function currentTime() {
    var current = moment().format('HH:mm:ss');
    $("#currentTime").html(current);
    setTimeout(currentTime, 1000);
  };
  currentTime();

  setInterval(function () {
    window.location.reload();
  }, 60000);

}); //end document ready


