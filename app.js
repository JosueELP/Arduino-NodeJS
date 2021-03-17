const express = require("express");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static(__dirname + "/public"));
// we serving files from "public" directory

http.listen(port, () => {
  console.log('listening on *:3000');
});

/*app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});*/

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const sPort = new SerialPort('COM3', { baudRate: 9600 });

const parser = sPort.pipe(new Readline({ delimiter: '\n' }));

sPort.on("open", () => {
  console.log("Serial Port Opened");
  io.on("connection", (socket) => {
    socket.emit("connected");
    parser.on("data", (data) => {
      let lastValue;
      // we use additional variable to avoid constant
      // sending data to connected socket
      if (lastValue !== data) {
        socket.emit("data", data);
      }
      lastValue = data;
    });
  });
});
