#include <DHT.h>
#include <DHT_U.h>
#include <RH_RF22.h>

#define GND2  7
#define Type DHT11
int dhtPin = 5;
int humesue=A0;
RH_RF22 rf22;

DHT HT(dhtPin, Type);
int humidity = 0;
float tempC = 0;


void setup() {
  pinMode(GND2,OUTPUT);
  digitalWrite(GND2, LOW);
 // tempC = HT.readTemperature();
  //humidity = HT.readHumidity();
  Serial.begin(9600);
  HT.begin();
 
  if (!rf22.init()){
    Serial.println("init failed");  
  // Defaults after init are 434.0MHz, 0.05MHz AFC pull-in, modulation FSK_Rb2_4Fd36
  }
  else{
    Serial.println("ok");  
    rf22.setFrequency(446.0);
// rf22.setTxPower(RH_RF22_TXPOW_20DBM);   
  /* rf22.setModemConfig(RH_RF22::GFSK_Rb2_4Fd36);   */
  }
  
}

void enviar(String msg){
   uint8_t data[msg.length()];
   msg.toCharArray(data, msg.length());
   Serial.println((char*)data);
   if (rf22.send(data, sizeof(data))) {
        Serial.println("Success!");
    } else {
        Serial.println("Error");
    }
    //rf22.waitAvailableTimeout(1);
    rf22.waitPacketSent(1);  
    //rf22.reset();
    
   if (!rf22.init()){
    Serial.println("init failed");  
  // Defaults after init are 434.0MHz, 0.05MHz AFC pull-in, modulation FSK_Rb2_4Fd36
  }
  else{
    Serial.println("ok");  
    rf22.setFrequency(446.0);
  }
  
    //read();
    
}

void read(){
    delay(1000);
    tempC = HT.readTemperature();
    delay(500);
    humidity = HT.readHumidity(); 
    Serial.println("{'device':'DH11','data':{'temp':'"+String(tempC)+"','humidity':'"+String(humidity)+"'}}");
    enviar(" iof,DH11,"+String(tempC)+","+String(humidity)+"eof ");
    //enviar("aaaaaaaaa");
}

void loop() {
    delay(1000);
    tempC = HT.readTemperature();
    delay(500);
    humidity = HT.readHumidity(); 
    enviar(" iofDH11,"+String(tempC)+","+String(humidity)+"eof ");
    //enviar("aaaaaaaaa");
    

}
