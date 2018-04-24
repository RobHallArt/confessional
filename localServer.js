


var express = require('express');
var socket = require('socket.io');

var server = express();
var listener = server.listen(3000);

console.log("Server Online");

var io = socket(listener);

io.sockets.on('connection', newConnection);


function newConnection(socket){
    console.log('New Connection :' + socket.id);
    socket.on('notes', recieveNotes);
}

function recieveNotes(data){
    console.log(data);
    print(data);
}

	var SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/serial0', {
		baudRate: 19200
	}),
	Printer = require('../src/printer');
	serialPort.on('open',print);
	function print(message) {
		var opts = {
			maxPrintingDots: 15,
			heatingTime: 150,
			heatingInterval: 4,
			commandDelay: 5
		};
		
		var printer = new Printer(serialPort, opts);
		
		if(message == null){
			printer.on('ready', function() {
				printer
					.bold(true)
					.inverse(true)
					.big(true)
					.center(true)
					.printLine(' CONFESSIONAL ')
					.inverse(false)
					.horizontalLine(16)
					.big(false)
					.bold(false)
					.printLine("This is your code to decrypt")
					.printLine("your message as it was")
					.printLine("displayed on the screen and")
					.printLine("played to you.")
					.lineFeed(3)
					.printLine("C3 F4 E5 G2 G2 A5 D5 C5 D2 F3 F2")
					.lineFeed(3)
					.printLine("Thank you for your confession.")
					.lineFeed(6)
					.printLine("csart.space")
					.lineFeed(3)
					.print(function() {
						console.log('done');
					});
			});
		} else {
			printer.on('ready', function() {
				printer
					.bold(true)
					.inverse(true)
					.big(true)
					.center(true)
					.printLine(' CONFESSIONAL ')
					.inverse(false)
					.horizontalLine(16)
					.big(false)
					.bold(false)
					.printLine("This is your code to decrypt")
					.printLine("your message as it was")
					.printLine("displayed on the screen and")
					.printLine("played to you.")
					.lineFeed(3)
					.printLine(message)
					.lineFeed(3)
					.printLine("Thank you for your confession.")
					.lineFeed(6)
					.printLine("csart.space")
					.lineFeed(3)
					.print(function() {
						console.log('done');
					});
			});
		}
		
	};
