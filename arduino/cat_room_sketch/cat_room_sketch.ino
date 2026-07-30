/*
  Cat Room - Arduino UNO Physical Computing Sketch
  2026 Summer Arduino x Prototyping Camp
  
  Pin Mapping:
  - D2: Capacitive Touch Sensor (Pet input)
  - D3: Feed Button (Pushbutton)
  - A0: Light Sensor / LDR (Day/Night input)
  - D4: Ultrasonic Trig
  - D5: Ultrasonic Echo
  - D8: Piezo Buzzer (Audio output)
  - D9: Servo Motor (Cat Tail output)
  - D10: Status LED Green
  - D11: Status LED Red
*/

#include <Servo.h>

const int PIN_TOUCH = 2;
const int PIN_BUTTON_FEED = 3;
const int PIN_TRIG = 4;
const int PIN_ECHO = 5;
const int PIN_BUZZER = 8;
const int PIN_SERVO = 9;
const int PIN_LED_GREEN = 10;
const int PIN_LED_RED = 11;
const int PIN_LDR = A0;

Servo tailServo;

// State Variables
bool lastTouchState = LOW;
unsigned long touchStartTime = 0;

bool lastButtonFeedState = HIGH; // Pull-up mode
unsigned long lastFeedDebounce = 0;

int lastLdrState = -1; // 0: Dark, 1: Bright
unsigned long ldrStateChangeTime = 0;

unsigned long lastUltrasonicCheck = 0;
long previousDistance = 999;

void setup() {
  Serial.begin(9600);

  pinMode(PIN_TOUCH, INPUT);
  pinMode(PIN_BUTTON_FEED, INPUT_PULLUP);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);

  tailServo.attach(PIN_SERVO);
  tailServo.write(90); // Idle position

  digitalWrite(PIN_LED_GREEN, HIGH);
  digitalWrite(PIN_LED_RED, LOW);
  tone(PIN_BUZZER, 1000, 100);
}

void loop() {
  unsigned long now = millis();

  // 1. Touch Sensor Reading
  bool touchState = digitalRead(PIN_TOUCH);
  if (touchState == HIGH && lastTouchState == LOW) {
    touchStartTime = now;
  } else if (touchState == LOW && lastTouchState == HIGH) {
    unsigned long duration = now - touchStartTime;
    if (duration > 1500) {
      Serial.print("{\"type\":\"PET_LONG\",\"duration\":");
      Serial.print(duration);
      Serial.println("}");
    } else if (duration > 50) {
      Serial.println("{\"type\":\"PET_SHORT\"}");
    }
    tone(PIN_BUZZER, 1200, 80);
  }
  lastTouchState = touchState;

  // 2. Feed Button Reading
  bool feedButtonState = digitalRead(PIN_BUTTON_FEED);
  if (feedButtonState == LOW && lastButtonFeedState == HIGH) {
    if (now - lastFeedDebounce > 300) {
      Serial.println("{\"type\":\"FEED\"}");
      tone(PIN_BUZZER, 1500, 150);
      lastFeedDebounce = now;
    }
  }
  lastButtonFeedState = feedButtonState;

  // 3. LDR Light Sensor Reading
  int ldrVal = analogRead(PIN_LDR);
  int currentLdrState = (ldrVal < 200) ? 0 : 1; // 0 = Dark, 1 = Bright
  if (currentLdrState != lastLdrState) {
    if (now - ldrStateChangeTime > 2000) { // 2 seconds hysteresis
      if (currentLdrState == 0) {
        Serial.print("{\"type\":\"LIGHT_DARK\",\"value\":");
        Serial.print(ldrVal);
        Serial.println("}");
      } else {
        Serial.print("{\"type\":\"LIGHT_BRIGHT\",\"value\":");
        Serial.print(ldrVal);
        Serial.println("}");
      }
      lastLdrState = currentLdrState;
      ldrStateChangeTime = now;
    }
  }

  // 4. Ultrasonic Proximity Reading (Every 300ms)
  if (now - lastUltrasonicCheck > 300) {
    digitalWrite(PIN_TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(PIN_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(PIN_TRIG, LOW);

    long duration = pulseIn(PIN_ECHO, HIGH, 30000); // 30ms timeout
    if (duration > 0) {
      long distance = duration * 0.034 / 2; // cm
      if (distance < 50 && previousDistance >= 50) {
        long speedEstimate = previousDistance - distance;
        if (speedEstimate > 20) {
          Serial.print("{\"type\":\"APPROACH_FAST\",\"distance\":");
          Serial.print(distance);
          Serial.println("}");
        } else {
          Serial.print("{\"type\":\"APPROACH_SLOW\",\"distance\":");
          Serial.print(distance);
          Serial.println("}");
        }
      } else if (distance > 80 && previousDistance <= 80) {
        Serial.println("{\"type\":\"PERSON_LEFT\"}");
      }
      previousDistance = distance;
    }
    lastUltrasonicCheck = now;
  }

  delay(20);
}
