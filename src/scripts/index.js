// Creamos una instancia del cliente MQTT
var clientId = "swarm-educate";
var topic="smartu/cronometro";
clientId += new Date().getUTCMilliseconds();
var client = new Paho.Client("educate.swarm.cl", 8080 , clientId);

// Inducamos las funciones que se ejecutarán ante estos eventos
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Realizamos la conexión
client.connect({onSuccess:onConnect});


//Declaramos las funciones
// Esta función es llamada cuando se logra conectar al broker
function onConnect() {
  // Avisamos por consola que nos conectamos correctamente
  console.log("Conectado");
  //Nos suscribimos al tópico de comunicacion con dispositivo
  client.subscribe(topic);
  console.log("Suscrito a "+topic)
}

// Esta función es llamada cuando el cliente pierde conexión con el Broker
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

 //Cuando llega un mensaje
    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        var data =JSON.parse(message.payloadString);
        console.log("Mensaje Recibido***")
        console.log("Topic: " + topic)
        console.log("Mensaje:  " + payload)
        $('#mqtt_list').append('<li>' + topic + ' = ' + payload + "Tiempo = " + $("#cronometro").TimeCircles().getTime() + '</li>');
        if (data.crono){
            iniciar();
        }
        else{
            pausar();
        }
    };