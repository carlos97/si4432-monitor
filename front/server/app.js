const serialPort = require("serialport");
const DelimiterParser = require('@serialport/parser-delimiter')

const express = require("express");
const PORT = process.env.PORT || 3000;
const { Server } = require("ws");


let portList = [];
let inUsePort;

const server = express()
    .use(express.static("public"))
    .get("*", (req, res) => {
        res.sendFile(__dirname + "/public/404.html");
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new Server({ server });

var uId = 0;
wss.on("connection", (ws) => {
    uId++;
    console.log('Client connected id->' + uId);
    var data = {
        id: uId
    };
    ws.data = data;

    ws.on("message", (msg) => {
        let data;
        console.log(data);
        switch (msg.type) {
            case "utf8":
                data = msg.utf8Data;
        }
    });
    
    wss.on("close", () => {
        console.log("client disconnected");
    });
});



serialPort.list().then((ports) => {
    //console.log(ports);
    ports.forEach((port) => {
        portList.push(port.path);
    });
});

function setPort(portName) {
    console.log("Bienvenido: ", portName);
    return new Promise((resolve, reject) => {
        inUsePort = new serialPort(portName, { baudRate: 9600 }, (err) => {
            const parser = inUsePort.pipe(new DelimiterParser({ delimiter: 'eof' }))
            if (err) {
                reject("No hay dispositivos conectados");
            } else {
                resolve(parser);
            }
        });
    });
}

setPort('COM5').then((x) => {
    x.on('data', function (data) {
        if (data.toString('utf8').includes('ok') || data.toString('utf8').includes('NAN')) {
            //console.log("return");
        } else {
            try {
                //console.log("data1: " + data.toString('utf8'))
                var d = (data.toString('utf8').split('iof')[1].split('eof')[0]);
                //console.log('Data2:', d);
                var jd = proc(d.split(','));
                console.log(jd);
                
                wss.clients.forEach((client) => {
                    console.log('s');
                    client.send(JSON.stringify(jd));
                });
            } catch {

            }
        }

    });
});

function proc(data) {
    switch (data[0]) {
        case "MQ135":
            return {
                "device": data[0],
                "data": {
                    "gas": data[1]
                }
            }
            break;
        case "DH11":
            return {
                "device": data[0],
                "data": {
                    "temp": data[1],
                    "humidity": data[2]
                }
            }
            break;
        default:
            break;
    }
}