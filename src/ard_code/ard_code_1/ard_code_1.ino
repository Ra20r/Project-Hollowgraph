#include <Servo.h>

#define echoPin 2
#define trigPin 3
#define servoPin 9
#define SWEEP_DELAY 55 // around 18 Hz
#define REVERSE_SWEEP_DELAY 1
#define OBSERVATIONS 50
// time (without outliers) = [OBSERVATIONS * 181 * 55 * (2025/1000)] milliseconds
#define LIMIT 10 //to be set after manual inspection of the subject
#define ADJUST(reading, error_base, error_hypo, shaft) (error_base / error_hypo)* (reading + shaft)

long duration;
double distance;
int angle;
int angle_step;
int sweep;
Servo servo;
char buffer[10];

int readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2000);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(15);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(10);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.0343 / 2.0; 
  //data[angle] = ADJUST(data[angle], 6.0, 6.1, 1.6);
  if(distance >= LIMIT)
    return 0;
  dtostrf(distance, 3, 1, buffer);
  Serial.print(buffer);
  Serial.print(", ");
  return 1;
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  servo.attach(servoPin);
  angle = 0;
  angle_step = 1;
  sweep = 0;
  servo.write(angle);
  Serial.begin(9600);
}

void loop() {
  while(Serial.available()==0);
  Serial.readString();
  for(; angle<=180; angle+=angle_step){
    servo.write(angle);
    int k=0;
    while(k<OBSERVATIONS){
      delay(SWEEP_DELAY);
      int ret = readDistance();
      if(!ret)
        continue;
       k++;
    }
    Serial.println();
  }
  for(; angle>=sweep; angle-=angle_step){
    servo.write(angle);
    delay(REVERSE_SWEEP_DELAY);
  }
}
