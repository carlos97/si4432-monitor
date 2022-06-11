#include <SPI.h>
#include <RH_RF22.h>
#include <DHT.h>
#include <DHT_U.h>
#include <MQ135.h>

#define PIN_MQ135 A0
#define RZERO 7.36
#define DEBUG(a, b) for (int index = 0; index < b; index++) Serial.print(a[index]); Serial.println();

float temperature = 21.0;
float humidity = 25.0;
int pin_mq = 3;
RH_RF22 rf22;


MQ135 mq135_sensor(PIN_MQ135,RZERO);


void setup() {
  Serial.begin(9600);
  pinMode(pin_mq, INPUT);
  Serial.setTimeout(50);
  if (!rf22.init()) {
    Serial.println("init failed");
  }
  else {
    Serial.println("ok");
    rf22.setFrequency(446.0);
    // rf22.setTxPower(RH_RF22_TXPOW_20DBM);
    /* rf22.setModemConfig(RH_RF22::GFSK_Rb2_4Fd36);   */
  }
}

void enviar(String msg){
    uint8_t data[msg.length()];
    msg.toCharArray(data, msg.length());
    if (rf22.send(data, sizeof(data))) {
        Serial.println("Success!");
    } else {
        Serial.println("Error");
    }
    rf22.waitPacketSent();
}

void loop() {
    delay(1000);
    /*
    float rzero = mq135_sensor.getRZero();
    float correctedRZero = mq135_sensor.getCorrectedRZero(temperature, humidity);
    float resistance = mq135_sensor.getResistance();
    float ppm = mq135_sensor.getPPM();
    float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
    Serial.print("MQ135 RZero: ");
    Serial.print(rzero);
    Serial.print("\t Corrected RZero: ");
    Serial.print(correctedRZero);
    Serial.print("\t Resistance: ");
    Serial.print(resistance);
    Serial.print("\t PPM: ");
    Serial.print(ppm);
    Serial.print("\t Corrected PPM: ");
    Serial.print(correctedPPM);
    Serial.println("ppm");
  */
    int gas = analogRead(PIN_MQ135);
    Serial.println("gas: ");
    Serial.println(gas);
    //enviar("iof{\"device\":\"MQ135\",\"data\":{\"gas\":"+String(gas)+"}}eof ");
    enviar(" iofMQ135,"+String(gas)+"eof ");
}
