/*
  Cat Room - Arduino UNO Physical Computing Sketch
  2026 Summer Arduino x Prototyping Camp
  
  직코 쉴드 및 현재 연결 기준 핀맵:
  - A3: Feed Button (Pushbutton, INPUT_PULLUP)
  - A0: Light Sensor / LDR
  - D9:  Pet Sensor (IR 적외선 감지, INPUT_PULLUP)
  - D13: Ultrasonic Trig
  - D12: Ultrasonic Echo
  - D6:  Piezo Buzzer
  - D7:  NeoPixel (4구)
  - D8:  Servo Motor (Cat Tail)
*/

#include <Servo.h>
#include <Adafruit_NeoPixel.h>

// 직코 쉴드 및 현재 연결 기준
constexpr uint8_t PIN_FEED_BUTTON = A3;
constexpr uint8_t PIN_LIGHT = A0;

constexpr uint8_t PIN_PET_SENSOR = 9;
constexpr uint8_t PIN_TRIG = 13;
constexpr uint8_t PIN_ECHO = 12;

constexpr uint8_t PIN_BUZZER = 6;
constexpr uint8_t PIN_NEOPIXEL = 7;
constexpr uint8_t PIN_SERVO = 8;

// 교안의 네오픽셀 4구 기준
constexpr uint8_t PIXEL_COUNT = 4;

// 일반적인 적외선 감지 센서는 감지 시 LOW
constexpr bool PET_DETECTED_LEVEL = LOW;

Servo tailServo;

Adafruit_NeoPixel pixels(
  PIXEL_COUNT,
  PIN_NEOPIXEL,
  NEO_GRB + NEO_KHZ800
);

bool previousFeedPressed = false;
bool previousPetDetected = false;

unsigned long previousSensorPrintTime = 0;
unsigned long previousDistanceCheckTime = 0;

long distanceCm = -1;

void setPixelColor(
  uint8_t red,
  uint8_t green,
  uint8_t blue
) {
  for (uint8_t index = 0; index < PIXEL_COUNT; index++) {
    pixels.setPixelColor(
      index,
      pixels.Color(red, green, blue)
    );
  }

  pixels.show();
}

long measureDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);

  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  const unsigned long duration =
    pulseIn(PIN_ECHO, HIGH, 30000UL);

  if (duration == 0) {
    return -1;
  }

  return static_cast<long>(
    duration * 0.0343 / 2.0
  );
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

  // 시작 상태: 연한 파란색
  setPixelColor(15, 20, 60);

  tone(PIN_BUZZER, 1200, 120);

  Serial.println();
  Serial.println("=== Cat Room Hardware Test ===");
  Serial.println("Ultrasonic: TRIG D13 / ECHO D12");
  Serial.println("Pet sensor: D9");
  Serial.println("NeoPixel: D7");
  Serial.println("Servo: D8");
  Serial.println("Light sensor: A0");
  Serial.println("Feed button: A3");
  Serial.println("Buzzer: D6");
}

void loop() {
  const unsigned long now = millis();

  const bool feedPressed =
    digitalRead(PIN_FEED_BUTTON) == LOW;

  const bool petDetected =
    digitalRead(PIN_PET_SENSOR) == PET_DETECTED_LEVEL;

  // 먹이 버튼을 처음 눌렀을 때
  if (feedPressed && !previousFeedPressed) {
    Serial.println("[FEED] Button pressed");
    playFeedReaction();
  }

  // 손 감지가 시작됐을 때
  if (petDetected && !previousPetDetected) {
    Serial.println("[PET] Hand detected");
    playPetReaction();
  }

  // 손을 치웠을 때
  if (!petDetected && previousPetDetected) {
    Serial.println("[PET] Hand removed");

    // 기본 상태로 복귀
    setPixelColor(15, 20, 60);
  }

  previousFeedPressed = feedPressed;
  previousPetDetected = petDetected;

  // 초음파는 300ms마다 측정
  if (now - previousDistanceCheckTime >= 300) {
    previousDistanceCheckTime = now;
    distanceCm = measureDistanceCm();
  }

  // 전체 센서 상태는 700ms마다 출력
  if (now - previousSensorPrintTime >= 700) {
    previousSensorPrintTime = now;

    const int lightValue = analogRead(PIN_LIGHT);

    Serial.print("Light=");
    Serial.print(lightValue);

    Serial.print(" | Distance=");

    if (distanceCm < 0) {
      Serial.print("NO_ECHO");
    } else {
      Serial.print(distanceCm);
      Serial.print("cm");
    }

    Serial.print(" | Pet=");
    Serial.print(
      petDetected ? "DETECTED" : "NONE"
    );

    Serial.print(" | Feed=");
    Serial.println(
      feedPressed ? "PRESSED" : "RELEASED"
    );
  }
}
