/*
  Cat Room - Arduino UNO Physical Computing Sketch (JSON Event Output)
  2026 Summer Arduino x Prototyping Camp

  Pin Mapping:
  - A3: Feed Button (Pushbutton, INPUT_PULLUP)
  - A0: Light Sensor / LDR
  - D9: Pet Sensor (IR sensor / Touch, INPUT_PULLUP)
  - D13: Ultrasonic Trig
  - D12: Ultrasonic Echo
  - D6: Piezo Buzzer
  - D7: NeoPixel (4 LED)
  - D8: Servo Motor (Tail)
*/

#include <Servo.h>
#include <Adafruit_NeoPixel.h>

constexpr uint8_t PIN_FEED_BUTTON = A3;
constexpr uint8_t PIN_LIGHT       = A0;
constexpr uint8_t PIN_PET_SENSOR   = 9;
constexpr uint8_t PIN_TRIG         = 13;
constexpr uint8_t PIN_ECHO         = 12;
constexpr uint8_t PIN_BUZZER       = 6;
constexpr uint8_t PIN_NEOPIXEL     = 7;
constexpr uint8_t PIN_SERVO        = 8;

constexpr uint8_t PIXEL_COUNT      = 4;
constexpr bool PET_DETECTED_LEVEL  = LOW;

Servo tailServo;
Adafruit_NeoPixel pixels(PIXEL_COUNT, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);

// State tracking
bool previousFeedPressed = false;
bool previousPetDetected = false;
unsigned long petStartTime = 0;

int previousLightState = -1; // 0: Dark, 1: Bright
long previousDistanceCategory = -1; // 0: Close/Fast, 1: Medium/Slow, 2: Far/Left

unsigned long lastDistanceCheckTime = 0;

void setPixelColor(uint8_t r, uint8_t g, uint8_t b) {
  for (uint8_t i = 0; i < PIXEL_COUNT; i++) {
    pixels.setPixelColor(i, pixels.Color(r, g, b));
  }
  pixels.show();
}

long measureDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  const unsigned long duration = pulseIn(PIN_ECHO, HIGH, 30000UL);
  if (duration == 0) return -1;
  return static_cast<long>(duration * 0.0343 / 2.0);
}

void wagTail() {
  tailServo.write(65);
  delay(180);
  tailServo.write(115);
  delay(180);
  tailServo.write(90);
}

void playFeedReaction() {
  tone(PIN_BUZZER, 1500, 120);
  setPixelColor(80, 35, 0);
  wagTail();
  delay(100);
  setPixelColor(15, 20, 60);
}

void playPetReaction() {
  tone(PIN_BUZZER, 1100, 80);
  setPixelColor(0, 60, 35);
}

void setup() {
  Serial.begin(9600);

  pinMode(PIN_FEED_BUTTON, INPUT_PULLUP);
  pinMode(PIN_PET_SENSOR, INPUT_PULLUP);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  tailServo.attach(PIN_SERVO);
  tailServo.write(90);

  pixels.begin();
  pixels.clear();
  setPixelColor(15, 20, 60);

  tone(PIN_BUZZER, 1200, 120);
}

void loop() {
  const unsigned long now = millis();

  // 1. Feed Button Check
  const bool feedPressed = (digitalRead(PIN_FEED_BUTTON) == LOW);
  if (feedPressed && !previousFeedPressed) {
    Serial.println("{\"type\":\"FEED\"}");
    playFeedReaction();
  }
  previousFeedPressed = feedPressed;

  // 2. Pet Sensor Check (Press and Release duration)
  const bool petDetected = (digitalRead(PIN_PET_SENSOR) == PET_DETECTED_LEVEL);
  if (petDetected && !previousPetDetected) {
    petStartTime = now;
    playPetReaction();
  } else if (!petDetected && previousPetDetected) {
    const unsigned long duration = now - petStartTime;
    if (duration >= 1500) {
      Serial.print("{\"type\":\"PET_LONG\",\"duration\":");
      Serial.print(duration);
      Serial.println("}");
    } else {
      Serial.print("{\"type\":\"PET_SHORT\",\"duration\":");
      Serial.print(duration);
      Serial.println("}");
    }
    setPixelColor(15, 20, 60);
  }
  previousPetDetected = petDetected;

  // 3. Light Sensor Check (Transition Detection)
  const int lightValue = analogRead(PIN_LIGHT);
  const int currentLightState = (lightValue < 300) ? 0 : 1; // 0: Dark, 1: Bright
  if (currentLightState != previousLightState) {
    previousLightState = currentLightState;
    if (currentLightState == 0) {
      Serial.print("{\"type\":\"LIGHT_DARK\",\"value\":");
      Serial.print(lightValue);
      Serial.println("}");
    } else {
      Serial.print("{\"type\":\"LIGHT_BRIGHT\",\"value\":");
      Serial.print(lightValue);
      Serial.println("}");
    }
  }

  // 4. Ultrasonic Distance Check (every 300ms)
  if (now - lastDistanceCheckTime >= 300) {
    lastDistanceCheckTime = now;
    const long distCm = measureDistanceCm();

    if (distCm > 0) {
      long cat = -1;
      if (distCm <= 20) cat = 0;       // Fast / Close
      else if (distCm <= 45) cat = 1;  // Slow / Medium
      else if (distCm >= 60) cat = 2;  // Person Left / Far

      if (cat != -1 && cat != previousDistanceCategory) {
        previousDistanceCategory = cat;
        if (cat == 0) {
          Serial.print("{\"type\":\"APPROACH_FAST\",\"distance\":");
          Serial.print(distCm);
          Serial.println("}");
        } else if (cat == 1) {
          Serial.print("{\"type\":\"APPROACH_SLOW\",\"distance\":");
          Serial.print(distCm);
          Serial.println("}");
        } else if (cat == 2) {
          Serial.println("{\"type\":\"PERSON_LEFT\"}");
        }
      }
    }
  }
}
