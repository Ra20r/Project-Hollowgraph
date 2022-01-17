#include <Servo.h>

#define echoPin 2
#define trigPin 3
#define servoPin 9

long duration;
double distance;
int angle;
Servo servo;
double data[180];

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
  angle = 1;
  servo.write(angle);
  Serial.begin(9600);
}

void loop() {
  while(Serial.available()==0);
  Serial.readString();
  for(; angle<=180; angle++){
    servo.write(angle);
    readDistance();
    data[angle] = distance;
    delay(5);
  }
  for(; angle>=1; angle--){
    servo.write(angle);
    readDistance();
    data[angle] = (data[angle]+distance)/2.0;
    delay(5);
  }
  int i;
  for(i=1; i<=180; i++)
    Serial.println(data[i]);
}
