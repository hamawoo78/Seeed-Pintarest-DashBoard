#include <Arduino.h>
#include <U8x8lib.h>
#include <PCF8563.h>
PCF8563 pcf;
#include <Wire.h>

#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiAP.h>
#include "time.h"

#include "AHT20.h"

AHT20 AHT;


U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8(/* clock=*/ SCL, /* data=*/ SDA, /* reset=*/ U8X8_PIN_NONE);   // OLEDs without Reset of the Display

// Set Wifi credentials.
const char* ssid = "ItHurtsWhenIP";
const char* password = "4111WhitmanAveN303";

WiFiServer server(80);

// 🕒 NTP Server and Seattle time offset
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = -8 * 3600;   // Pacific Standard Time (UTC-8)
const int   daylightOffset_sec = 3600; 

void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  server.begin();
}

void setup() {
  // //  Set up wifi
  // pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  initWiFi();

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
    
    pcf.init();//initialize the clock
    pcf.setYear(timeinfo.tm_year + 1900);//set year
    pcf.setMonth(timeinfo.tm_mon + 1);//set month
    pcf.setDay(timeinfo.tm_mday);//set dat
    pcf.setHour(timeinfo.tm_hour);//set hour
    pcf.setMinut(timeinfo.tm_min);//set minut
    pcf.setSecond(timeinfo.tm_sec);//set second
    pcf.startClock();//start the clock
    
    Serial.println("RTC time synced with NTP!");
  } else {
  Serial.println("Failed to obtain time from NTP");
  }

  // // Disconnect Wi-Fi to save power
  WiFi.disconnect(true);

  AHT.begin();

}

void loop() {
  WiFiClient client = server.available();   // listen for incoming clients

  Time nowTime = pcf.getTime();

  u8x8.setFont(u8x8_font_chroma48medium8_r);   // choose a suitable font
  Serial.printf("RTC time: %04d-%02d-%02d %02d:%02d:%02d\n",
                nowTime.year + 1952,
                nowTime.month,
                nowTime.day,
                nowTime.hour,
                nowTime.minute,
                nowTime.second);

  // delay(1000);

  float humi, temp;
  int ret = AHT.getSensor(&humi, &temp);
    
  u8x8.setFont(u8x8_font_chroma48medium8_r);   // choose a suitable font
  
  if(ret)     // GET DATA OK
  {
    u8x8.clearDisplay(); 
    u8x8.setFont(u8x8_font_inb33_3x6_f);
    u8x8.setCursor(0, 1);     
    u8x8.print(temp, 1);
    u8x8.print("C");
    u8x8.setFont(u8x8_font_chroma48medium8_r); 
    u8x8.setCursor(0, 7);      // Row 0, column 0
    u8x8.print("Temp");

    delay(3000);
    u8x8.clearDisplay(); 

    u8x8.setCursor(0, 1);     
    u8x8.setFont(u8x8_font_inb33_3x6_f);
    u8x8.print(humi * 100, 1); // show 1 decimal
    u8x8.print("%");
    u8x8.setFont(u8x8_font_chroma48medium8_r); 
    u8x8.setCursor(0, 7);     
    u8x8.setFont(u8x8_font_chroma48medium8_r);  
    u8x8.print("Humid");

    delay(1000);
    u8x8.clearDisplay(); 
    u8x8.setCursor(0, 0);     
    u8x8.setFont(u8x8_font_open_iconic_weather_4x4);  
    u8x8.print((char)0);
        
        
    // delay(1000);
    // u8x8.clearDisplay(); 
    // u8x8.setCursor(0, 0);     
    // u8x8.setFont(u8x8_font_open_iconic_weather_4x4);  
    // u8x8.print("64");

  }
  else        // GET DATA FAIL
  {
    Serial.println("GET DATA FROM AHT20 FAIL");
  }

  delay(3000);
  u8x8.clearDisplay(); 
  u8x8.setFont(u8x8_font_inb33_3x6_f); 
  u8x8.setCursor(0, 1);
  u8x8.print(nowTime.hour);
  u8x8.print(":");
  u8x8.printf("%02d",nowTime.minute);
  // u8x8.print(":");
  // u8x8.println(nowTime.second);

  u8x8.setFont(u8x8_font_chroma48medium8_r); 
  u8x8.setCursor(0, 7);
  u8x8.print(nowTime.month);
  u8x8.print("/");
  u8x8.print(nowTime.day);
  u8x8.print("/");
  u8x8.print(nowTime.year  + 1952);
  



  delay(3000);



}