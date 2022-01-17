#include <Servo.h>
//0-180 is counter clockwise
//even row -> 0-180 (even)
//odd row -> 1-179 (odd)
#define echoPin 2
#define trigPin 3
#define servoPin 9
#define ADJUST(reading, theta, shaft) (reading+shaft)*cos(theta)

long duration;
double distance;
int angle;
int angle_step;
int sweep;
Servo servo;
double data[181];

void readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2.0;
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  servo.attach(servoPin);
  angle = 0;
  angle_step = 2;
  sweep = 0;
  servo.write(angle);
  Serial.begin(9600);
}

void loop() {
  while(Serial.available()==0);
  Serial.readString();
  if(sweep == 0)
    angle = 0;
  else
    angle = 1;
  for(; angle<=180; angle+=angle_step){
    servo.write(angle);
    readDistance();
    data[angle] = distance;
    delay(5);
  }
  if(sweep==0)
    angle = 180;
  else
    angle = 179;
  for(; angle>=sweep; angle-=angle_step){
    servo.write(angle);
    readDistance();
    data[angle] = (data[angle]+distance)/2.0;
    data[angle] = ADJUST(data[angle], 0.355, 2.5);
    delay(5);
  }
  int i;
  for(i=sweep; i<=180; i+=angle_step)
    Serial.println(data[i]);
  sweep = !sweep;
}
