const express = require("express");
const cors = require("cors");
const path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.port = 3001;
    this.paths = {
      wallet: "/api/wallet",
    };

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    // Pick up React index.html file
    this.app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // Bind controllers to routes
  routes() {
    this.app.use(this.paths.wallet, require("../routes/wallet"));
    // Catch all requests that don't match any route
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port: ", this.port);
    });
  }
}

module.exports = Server;
