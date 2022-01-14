#include <Servo.h>

#define echoPin 2
#define trigPin 3
#define servoPin 9

long duration;
int distance;
int angle;
Servo servo;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  servo.attach(servoPin);
  angle = 0;
  servo.write(angle);
  Serial.begin(9600);
}
void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  delay(1500);
  /*for(; angle<=180; angle++){
    servo.write(angle);
    delay(10);
  }
  for(; angle>=0; angle--){
    servo.write(angle);
    delay(10);
  }*/
}
