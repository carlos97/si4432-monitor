#include <SPI.h>
#include <RH_RF22.h>
RH_RF22 rf22;

char poli[] = "10101";
void setup() {

  Serial.begin(9600);
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

void recibir() {
  if (rf22.available())  {

    uint8_t buf[100];
    uint8_t len = sizeof(buf);
    String str="";
    rf22.recv(buf, &len);
    for(int x=0;x<sizeof(buf);x++){
      str += String((char)buf[x]);  
      }
    //Serial.print("buf: ");
    Serial.print(str);
    
    
    //Serial.print("  RSSI: ");             
    //Serial.println(rf22.lastRssi(), DEC);

  }
}

void loop() {
  recibir();

}
