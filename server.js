const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./models/main");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

app.use((err, req, res, next) => {
    if(err) {
      res.setHeader('Content-type', 'application/json');
      res.statusCode = err.statusCode;
      res.end(JSON.stringify({message: err.message}));
    }
});

require("./routers/biketype.routes")(app);
require("./routers/bike.routes")(app);
require("./routers/bikereview.routes")(app);
require("./routers/auth.routes")(app);

app.listen(8000, () => {
    console.log("App is listening on 3000");
});