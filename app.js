//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

//ables to refer to the static files in the "public" folder
//with a relative url
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name,
        LNAME: surname
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/3245436291",
    method: "POST",
    headers: {
      "Authorization": "Omar c106ea4b9bb6cce4049675295319b2e2-us7"
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      console.log(response.statusCode);
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });

  console.log(name + "::" + surname + "::" + email);
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


//dinamic port for the server or in the 3000 in the local system
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
