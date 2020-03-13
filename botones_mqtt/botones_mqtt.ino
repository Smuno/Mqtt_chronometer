/*
Sketch para NODEMCU LOLIN v3 ESP8266

by Samuel Muñoz López - SWARM TECHNOLOGIES 
*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
const int blue = 4;
const int red = 5;
int red_ini = 0;
int blue_ini = 0;

int red_fin = 0;
int blue_fin = 0;

boolean B_blue = false;
boolean B_red = false;

String plMQTT; 

//Seteo WIFI
const char *ssid = "";     // Enter your WiFi name
const char *password = ""; // Enter WiFi password
//Seteo MQTT Server
const char *mqttServer = "";
const int mqttPort = ;
const char *mqttUser = "";
const char *mqttPassword = "";
//Seteo MQTT topicos
const char *topicCronometro = "smartu/cronometro"; //Topico de recepcion desde appAndroid -> broker

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup()
{
    //Serial
    Serial.begin(115200);
    Serial.println("v1");
    //Botones
    pinMode(blue, INPUT);
    pinMode(red, INPUT);

    delay(1000);
    //Conexion WIFI
    WiFi.begin(ssid, password);
    WiFi.mode(WIFI_STA);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.println("Connecting to WiFi..");
        delay(500);
    }
    Serial.println("Connected to the WiFi network");
    //Conexion Broker
    client.setServer(mqttServer, mqttPort);
    client.setCallback(callback); //funcion cuando se recibe mensaje desde topico
    espClient.setInsecure();
    while (!client.connected())
    {
        Serial.println("Connecting to MQTT...");
        if (client.connect("botones", mqttUser, mqttPassword))
        {
            Serial.println("connected");
        }
        else
        {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
    client.subscribe(topicCronometro); //Suscripcion a topico
}
//Funcion recepcion
void callback(char *topic, byte *payload, unsigned int length)
{

    plMQTT = ""; //Se vacia

    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    Serial.print("Message:");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
        plMQTT = plMQTT + (char)payload[i];
    }
    Serial.println("");
    Serial.println(plMQTT);
    Serial.println("-----------------------");
    plMQTT = "";
}

void loop()
{
    red_ini = digitalRead(red);
    blue_ini = digitalRead(blue);

    if (red_ini != red_fin)
    {
        Serial.println("B_red");
        client.publish(topicCronometro, "{\"crono\":true}");
        delay(1000);
    }
    if (blue_ini != blue_fin)
    {
        Serial.println("B_blue");
        client.publish(topicCronometro, "{\"crono\":false}");
        delay(1000);
    }

    red_fin = digitalRead(red);
    blue_fin = digitalRead(blue);
}