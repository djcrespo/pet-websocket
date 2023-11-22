const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sensor = require('node-dht-sensor');
const rpio = require('rpio');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de pines GPIO
const sensorPin = 17;  // Puedes cambiar esto según la conexión de tu sensor
const ledPin = 18;     // Puedes cambiar esto según la conexión de tu LED

rpio.open(ledPin, rpio.OUTPUT, rpio.LOW);

// Manejador de eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Manejar eventos del cliente (por ejemplo, encender/apagar LED)
    socket.on('toggleLED', () => {
        toggleLED();
    });

    // Manejar eventos de desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Configurar la ruta principal
app.get('/', (req, res) => {
    res.send('<h1>Raspberry Pi IoT Server</h1>');
});

// Leer datos del sensor DHT11 cada 2 segundos y emitir a clientes
setInterval(() => {
    readDHTData();
}, 2000);

// Función para leer datos del sensor DHT11
function readDHTData() {
    sensor.read(11, sensorPin, function(err, temperature, humidity) {
        if (!err) {
            console.log(`Temperatura: ${temperature.toFixed(1)}°C, Humedad: ${humidity.toFixed(1)}%`);
            io.emit('sensorData', { temperature, humidity });
        } else {
            console.error('Error al leer datos del sensor DHT11:', err);
        }
    });
}

// Función para encender/apagar el LED
function toggleLED() {
    const state = rpio.read(ledPin);
    rpio.write(ledPin, state === rpio.LOW ? rpio.HIGH : rpio.LOW);
    console.log(`LED ${state === rpio.LOW ? 'encendido' : 'apagado'}`);
}

// Iniciar el servidor
const port = 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
