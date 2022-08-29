#include <Servo.h>

//0-180 is counter clockwise
//even row -> 0-180 (even)
//odd row -> 1-179 (odd)

#define echoPin 2
#define trigPin 3
#define servoPin 9
#define SWEEP_DELAY 30
#define ADJUST(reading, error_base, error_hypo, shaft) (error_base / error_hypo)* (reading + shaft)

long duration;
double distance;
int angle;
int angle_step;
int sweep;
Servo servo;
double data[181];
char buffer[10];

void readDistance() {
  delay(55);
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2.0;
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  readDistance();
  dtostrf(distance, 3, 1, buffer);
  Serial.print(buffer);
  Serial.print(", ");
  Serial.println();
}
