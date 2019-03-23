// Initialize Firebase
var config = {
    apiKey: "AIzaSyCaDb4CUy9YF5R-ZmLiyfNHuWvMsgyk_KA",
    authDomain: "train-homework-31db7.firebaseapp.com",
    databaseURL: "https://train-homework-31db7.firebaseio.com",
    projectId: "train-homework-31db7",
    storageBucket: "train-homework-31db7.appspot.com",
    messagingSenderId: "387430691482"
};

firebase.initializeApp(config);

var database = firebase.database();

//on the submit button click we save and send
//all user inputed data for the new train to firebase
$("#submit-btn").on("click", function (event) {

    event.preventDefault(); //prevents default click

    //new variables to save user input
    var trainName = $("#trainName").val().trim();
    var trainDest = $("#destination").val().trim();
    var trainStart = $("#startTime").val().trim();
    var trainFreq = $("#frequency").val().trim();

    //new object to hold all information
    var newTrain = {
        name: trainName,
        dest: trainDest,
        time: trainStart,
        freq: trainFreq
    }

    //console log all new info to catch bugs if any
    console.log("New Employee Name: " + newTrain.name);
    console.log("New Employee Role: " + newTrain.dest);
    console.log("New Employee Date: " + newTrain.time);
    console.log("New Employee Rate: " + newTrain.freq);

    //pushes object to Firebase, push() adds it as a new object instead of replacing
    database.ref().push(newTrain);

    //sets user input forms to blank
    $("#trainName").val("");
    $("#destination").val("");
    $("#startTime").val("");
    $("#frequency").val("");
});

//pulls information from database to push to page
database.ref().on("child_added", function (childSnapshot) {
    //console log to make sure we grabbed information
    console.log(childSnapshot.val());

    //create variables to hold information
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().dest;
    var start = childSnapshot.val().time;
    var frequency = childSnapshot.val().freq;

    //math to get information
    var firstTime = moment(start, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTime), "minutes");
    var tRemainder = diffTime % frequency;
    var timeTillTrain = frequency - tRemainder;
    var nextTrain = moment().add(timeTillTrain, "minutes");
    var nextTrainCon = moment(nextTrain).format("HH:mm");

    //log all the data being added
    console.log("Database Name: " + name);
    console.log("Database Destination: " + destination);
    console.log("Database Start: " + start);
    console.log("Database Frequency: " + frequency);
    console.log("Curent Time: " + currentTime);
    console.log("Arrival Time: " + nextTrainCon);
    console.log("Minutes till Train: " + timeTillTrain);



    //var that creates new row with new table contents
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrainCon),
        $("<td>").text(timeTillTrain)
    );

    //appends newrow to table on page
    $("#tbody").append(newRow);

});

//function to create current time
function currentTime() {
    let timeNow = moment();
    let displayTime = moment(timeNow).format("HH:mm")
    $("#currenttime").text(displayTime);
    console.log("Time Updated");
}

//google authentication
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
//firebase.auth().languageCode = 'pt';
// To apply the default browser preference instead of explicitly setting it.
firebase.auth().useDeviceLanguage();
provider.setCustomParameters({
    'login_hint': 'user@example.com'
});

firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

firebase.auth().getRedirectResult().then(function (result) {
    if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // ...
    }
    // The signed-in user info.
    var user = result.user;
}).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

//load the current time, and then every 30s update it
currentTime();
window.setInterval(currentTime, 30000);