const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const https = require("https");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Signup Route
app.post("/signup", (req, res) => {

    // Grab data from Signup form using body parser
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // Make sure fields are filled
    if (!firstName || !lastName || !email) {
        res.redirect("/failure.html");
        return;
    }

    // Construct req data
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    };

    // Convert data object to JSON string 
    const jsonData = JSON.stringify(data);

    const url = "https://usX.api.mailchimp.com/3.0/lists/<YOUR_AUDIENCE_ID>";

    const options = {

        method: "POST",
        auth: "<YOUR_PASSWORD>:<YOUR_API_KEY>"

    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {

            res.redirect("/success.html")

        } else {
            res.redirect("/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res) => {
    res.redirect("/")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server is running on port " + PORT + "."));