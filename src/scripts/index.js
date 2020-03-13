    /*MQTT*/
    //datos de conexion a broker
    host = 'mqttws.safeko.cl';	// hostname or IP address
    port = 443;
    topic = 'smartu/cronometro';		// topic to subscribe to
    useTLS = true;
    username = "loraserver";
    password = "SwarmTechnologies192";
    cleansession = true;
    var client;
    var reconnectTimeout = 2000;

    $(document).ready(function () {
        MQTTconnect();
        //añadir inicio cronometro
    });
    //funcion de conexion
    function MQTTconnect() {
        if (typeof path == "undefined") {
            path = '/';
        }
        client = new Paho.Client(
            host,
            port,
            path,
            "crono" + parseInt(Math.random() * 100, 10)
        );
        var options = {
            timeout: 3,
            useSSL: useTLS,
            cleanSession: cleansession,
            onSuccess: onConnect,
            onFailure: function (message) {
                console.log("Conexion fallida: " + message.errorMessage + "Reintentando");
                setTimeout(MQTTconnect, reconnectTimeout);
            }
        };

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("Host=" + host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);
        client.connect(options);
    }
    //Cuando se conecta exitosamente
    function onConnect() {
        console.log('Conectado a ' + host + ':' + port + path);
        // Connection succeeded; subscribe to our topic
        client.subscribe(topic, { qos: 0 });
        console.log(topic);
    }
    //Cuando se pierde la conexion
    function onConnectionLost(response) {
        setTimeout(MQTTconnect, reconnectTimeout);
        console.log("Conexion perdida: " + responseObject.errorMessage + ". Reconectando");

    };
    //Cuando llega un mensaje
    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        console.log("Mensaje Recibido***")
        console.log("Topic: " + topic)
        console.log("Mensaje:  " + payload)
        $('#mqtt_list').append('<li>' + topic + ' = ' + payload + "Tiempo = " + $("#cronometro").TimeCircles().getTime() + '</li>');
    };