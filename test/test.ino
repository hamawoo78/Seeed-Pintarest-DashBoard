#include <Arduino.h>
#include <U8x8lib.h>
#include <PCF8563.h>
PCF8563 pcf;
#include <Wire.h>

#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
#include "time.h"

#include "AHT20.h"
AHT20 AHT;

#include "LittleFS.h"
#include <PubSubClient.h>


U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8(/* clock=*/SCL, /* data=*/SDA, /* reset=*/U8X8_PIN_NONE);  // OLEDs without Reset of the Display

// Set Wifi credentials.
const char* ssid = "ItHurtsWhenIP";
const char* password = "4111WhitmanAveN303";

// MQTT broker (you can test first with test.mosquitto.org)
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;  // regular TCP port (not WebSocket)

// WiFiServer server(80); 
WebServer server(80); // for Http

WiFiClient espClient;
PubSubClient client(espClient);

String clientId = "ESP32Client-" + String(random(0xffff), HEX);
// Topics
const char* commandTopic = "esp32/command";
const char* statusTopic = "esp32/status";

// 🕒 NTP Server and Seattle time offset
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -8 * 3600;  // Pacific Standard Time (UTC-8)
const int daylightOffset_sec = 3600;

// Set up for reading file
String getContentType(String filename) {
  if (filename.endsWith(".html"))
    return "text/html";
  else if (filename.endsWith(".css"))
    return "text/css";
  else if (filename.endsWith(".js"))
    return "application/javascript";
  else if (filename.endsWith(".png"))
    return "image/png";
  else if (filename.endsWith(".jpg"))
    return "image/jpeg";
  else if (filename.endsWith(".ico"))
    return "image/x-icon";

  return "text/plain";
}

void handleFile(String path) {
  Serial.println("---- HTTP Request ----");
  Serial.print("Requested Path: ");
  Serial.println(path);

  if (path.endsWith("/")) path += "index.html";

  String contentType = getContentType(path);
  Serial.print("Content-Type Resolved: ");
  Serial.println(contentType);

  Serial.print("Checking FS for: ");
  Serial.println(path);

  if (LittleFS.exists(path)) {
    Serial.println("✅ File Exists → serving file");
    File file = LittleFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
  } else {
    Serial.println("❌ File Not Found → sending 404");
    server.send(404, "text/plain", "File Not Found");
  }
  Serial.println("----------------------");
}


// void handleFile(String path) {
//   Serial.println("In handleFile");

//   // Serve index.html if root is requested
//   if (path.endsWith("/")) path += "index.html";

//   String contentType = getContentType(path);  // Determine MIME type

//   if (LittleFS.exists(path)) {
//     File file = LittleFS.open(path, "r");
//     server.streamFile(file, contentType);
//     file.close();
//   } else {
//     server.send(404, "text/plain", "File Not Found");
//   }
// }

// MQTT set up
// ===== When a message arrives =====
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("📩 Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String msg;
  for (int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  Serial.println(msg);

  // Handle Yes / No commands
  if (msg == "Yes") {
    Serial.println("✅ Received YES command");
    client.publish(statusTopic, "ESP32: YES received!");
  } 
  else if (msg == "No") {
    Serial.println("❌ Received NO command");
    client.publish(statusTopic, "ESP32: NO received!");
  } 
  // Handle song requests by ID
  else if (msg == "Spring") {
    Serial.println("🎵 Spring (Season) selected");
    client.publish(statusTopic, "Playing Spring song!");
  } 
  else if (msg == "Summer") {
    Serial.println("🎵 Summer (Season) selected");
    client.publish(statusTopic, "Playing Summer song!");
  } 
  else if (msg == "Autumn") {
    Serial.println("🎵 Autumn (Season) selected");
    client.publish(statusTopic, "Playing Fall song!");
  } 
  else if (msg == "Winter") {
    Serial.println("🎵 Winter (Season) selected");
    client.publish(statusTopic, "Playing Winter song!");
  } 
  else if (msg == "Dog") {
    Serial.println("🐕 Puppy song selected");
    client.publish(statusTopic, "Playing Puppy song!");
  } 
  else if (msg == "Cat") {
    Serial.println("🐱 Kitty song selected");
    client.publish(statusTopic, "Playing Kitty song!");
  } 
  else if (msg == "Bird") {
    Serial.println("🐦 Bird song selected");
    client.publish(statusTopic, "Playing Bird song!");
  } 
  else if (msg == "Cow") {
    Serial.println("🐄 Cow song selected");
    client.publish(statusTopic, "Playing Cow song!");
  }
  else {
    Serial.println("⚠️ Unknown command received");
    client.publish(statusTopic, "Unknown command!");
  }
}

// ===== Reconnect to MQTT if disconnected =====
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientId.c_str())) {
      Serial.println("✅ connected to MQTT broker");
      client.subscribe(commandTopic);
    } else {
      Serial.print("❌ failed, rc=");
      Serial.print(client.state());
      Serial.println(" — retrying in 5 seconds");
      delay(5000);
    }
  }
}



void initWiFi() {
  // WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.status() == WL_CONNECTED ? "WiFi OK" : "WiFi failed");

  // server.begin();
}

// ---------------- DISPLAY FUNCTIONS ---------------- //

void displayTemperature(float temp) {
  u8x8.clearDisplay();
  u8x8.setFont(u8x8_font_inb33_3x6_f);
  u8x8.setCursor(0, 1);
  u8x8.print(temp, 1);
  u8x8.print("C");

  u8x8.setFont(u8x8_font_chroma48medium8_r);
  u8x8.setCursor(0, 7);
  u8x8.print("Temp");
}

void displayHumidity(float humi) {
  u8x8.clearDisplay();
  u8x8.setFont(u8x8_font_inb33_3x6_f);
  u8x8.setCursor(0, 1);
  u8x8.print(humi * 100, 1);
  u8x8.print("%");

  u8x8.setFont(u8x8_font_chroma48medium8_r);
  u8x8.setCursor(0, 7);
  u8x8.print("Humid");
}

void displayTime() {
  Time nowTime = pcf.getTime();

  u8x8.clearDisplay();
  u8x8.setFont(u8x8_font_inb33_3x6_f);
  u8x8.setCursor(0, 1);
  u8x8.print(nowTime.hour);
  u8x8.print(":");
  u8x8.printf("%02d", nowTime.minute);

  u8x8.setFont(u8x8_font_chroma48medium8_r);
  u8x8.setCursor(0, 7);
  u8x8.print(nowTime.month);
  u8x8.print("/");
  u8x8.print(nowTime.day);
  u8x8.print("/");
  u8x8.print(nowTime.year + 1952);
}

void setup() {
  //  Set up wifi
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  if (!LittleFS.begin(true)) {
    Serial.println("LittleFS Mount Failed");
    // Handle the failure (e.g. stop further execution or retry)
  } else {
    Serial.println("LittleFS Mounted Successfully");
  }

  initWiFi();

  server.begin(); 
  Serial.println("Server started!");
  Serial.print("WiFi mode: ");
  Serial.println(WiFi.getMode());

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  server.onNotFound([]() {
    handleFile(server.uri());
  });

  u8x8.begin();
  u8x8.setFlipMode(1);

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Time configured from NTP.");
  Wire.begin();

  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    Serial.println("Got local time from NTP:");

    Serial.printf("%04d-%02d-%02d %02d:%02d:%02d\n",
                  timeinfo.tm_year + 1900,
                  timeinfo.tm_mon + 1,
                  timeinfo.tm_mday,
                  timeinfo.tm_hour,
                  timeinfo.tm_min,
                  timeinfo.tm_sec);

    pcf.init();                            //initialize the clock
    pcf.setYear(timeinfo.tm_year + 1900);  //set year
    pcf.setMonth(timeinfo.tm_mon + 1);     //set month
    pcf.setDay(timeinfo.tm_mday);          //set dat
    pcf.setHour(timeinfo.tm_hour);         //set hour
    pcf.setMinut(timeinfo.tm_min);         //set minut
    pcf.setSecond(timeinfo.tm_sec);        //set second
    pcf.startClock();                      //start the clock

    Serial.println("RTC time synced with NTP!");
  } else {
    Serial.println("Failed to obtain time from NTP");
  }

  // // Disconnect Wi-Fi to save power
  // WiFi.disconnect(true);

  AHT.begin();
}

void loop() {
  server.handleClient();

  float humi, temp;
  int ret = AHT.getSensor(&humi, &temp);

  if (ret) {
    //  Sending Tem info to interface
    client.publish("esp32/temperature", String(temp).c_str());
    client.publish("esp32/humidity", String(humi*100).c_str());

    displayTemperature(temp);
    delay(3000);

    displayHumidity(humi);
    delay(3000);

    displayTime();
    delay(2000);

  } else {
    Serial.println("GET DATA FROM AHT20 FAIL");
  }

  if (!client.connected()) {
    reconnect();
  }

  client.loop();
}