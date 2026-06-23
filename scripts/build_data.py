"""
One-time importer: turns the raw box/slot text dump into data.json.
Run once, then the site takes over (edits go through the UI -> GitHub API).
"""
import json
import re

def item(name, box, slot, qty=1, category="", tags=None, notes=""):
    return {
        "id": re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:40] + f"-{box}{slot}",
        "name": name,
        "box": box,
        "slot": f"{box}{slot}",
        "qty": qty,
        "category": category,
        "tags": tags or [],
        "notes": notes,
        "image": None,
        "extra": {}
    }

items = []

# BOX A
items += [
    item("Wires (DuPont connector)", "A", "1", category="Wires", tags=["dupont", "jumper"]),
    item("Breadboards", "A", "2", category="Prototyping", tags=["breadboard"]),
    item("NFC stickers", "A", "2", category="RFID/NFC", tags=["nfc"]),
    item("NFC Card", "A", "2", category="RFID/NFC", tags=["nfc"]),
    item("NFC keychain button", "A", "2", category="RFID/NFC", tags=["nfc"]),
    item("Elegoo IR remote", "A", "2", category="IR", tags=["elegoo", "ir", "remote"]),
    item("AUX 1.5mm Cable", "A", "2", category="Audio", tags=["aux", "cable"]),
    item("AUX 1.5mm 1 to 5 splitter", "A", "2", category="Audio", tags=["aux", "splitter"]),
    item("Power meter with screen", "A", "2", qty=3, category="Power", tags=["power", "meter", "display"]),
    item("Serial SATA data connector", "A", "2", qty=3, category="Cables", tags=["sata"]),
    item("Seeed Studio uFL 2.4G A-01 sticker antenna", "A", "2", category="RF/Antennas", tags=["seeed", "ufl", "antenna", "2.4ghz"]),
]
# A3 nothing, ZZ skipped (not a real slot)

# BOX B
items += [
    item("KickPi K2B 1.1", "B", "2", category="SBC", tags=["sbc", "kickpi"]),
    item("ZeroLink 4-port USB hub for RPi Zero W", "B", "2", category="SBC Accessories", tags=["rpi", "zero", "usb hub"], notes="Listed as 'zero4u'"),
    item("Orange Pi Zero3 2GB", "B", "2", category="SBC", tags=["sbc", "orangepi", "zero3"]),
    item("RPi 40-pin IDE cable", "B", "2", category="SBC Accessories", tags=["rpi", "gpio", "ribbon cable"]),
    item("Le Potato SBC", "B", "2", category="SBC", tags=["sbc", "le potato", "libre computer"]),
    item("LABIST RPi Camera B01", "B", "2", category="SBC Accessories", tags=["rpi", "camera"]),
    item("RPi Sense HAT v1", "B", "2", category="SBC Accessories", tags=["rpi", "hat", "sensehat", "sensors"]),
    item("RPi breakout board (2-pin)", "B", "2", qty=2, category="SBC Accessories", tags=["rpi", "breakout", "gpio"]),
    item("RPi breakout board (2-pin, with mounting holes)", "B", "2", qty=2, category="SBC Accessories", tags=["rpi", "breakout", "gpio", "mounting holes"]),
]
# B1, B3 nothing

# BOX C1 - Arduinos
items += [
    item("Elegoo R3 (clear case)", "C", "1", qty=2, category="Arduino", tags=["elegoo", "uno", "r3"]),
    item("Elegoo R3 (blue case)", "C", "1", category="Arduino", tags=["elegoo", "uno", "r3"]),
    item("Elegoo R3 (lego case)", "C", "1", category="Arduino", tags=["elegoo", "uno", "r3", "lego case"]),
    item("Elegoo R3 (clear case + TFT touchscreen)", "C", "1", category="Arduino", tags=["elegoo", "uno", "r3", "tft", "touchscreen"]),
    item("OG Arduino Uno (plexiglass case)", "C", "1", qty=2, category="Arduino", tags=["arduino", "uno", "official"]),
    item("Fake Elegoo R3 (lego case)", "C", "1", category="Arduino", tags=["elegoo", "uno", "r3", "clone", "lego case"]),
    item("Arduino proto shield v5", "C", "1", category="Arduino Shields", tags=["arduino", "shield", "prototyping"]),
    item("Arduino Nano (USB-C)", "C", "1", category="Arduino", tags=["arduino", "nano", "usb-c"]),
    item("Arduino Uno R4 (ESP32, WiFi)", "C", "1", category="Arduino", tags=["arduino", "uno r4", "esp32", "wifi"]),
    item("Elegoo ESP-CAM", "C", "1", category="ESP32", tags=["elegoo", "esp32", "camera", "esp-cam"]),
    item("Barrel jack PSU for Uno", "C", "1", category="Power", tags=["arduino", "uno", "psu", "barrel jack"]),
    item("Arduino breakout board", "C", "1", category="Arduino Accessories", tags=["arduino", "breakout"]),
]

# BOX C2 - General Parts
items += [
    item("Gikfun proto shield (with headers)", "C", "2", category="Arduino Shields", tags=["gikfun", "shield", "prototyping"]),
    item("End stop switch", "C", "2", qty=25, category="Switches", tags=["endstop", "limit switch", "3d printer"]),
    item("Solar charge controller mini (JST connectors)", "C", "2", category="Power", tags=["solar", "charge controller", "jst"]),
    item("Smoother v1.0", "C", "2", qty=2, category="Motor Drivers", tags=["smoother", "stepper", "3d printer"]),
    item("Hack Club macro pad PCB", "C", "2", category="PCBs", tags=["hack club", "macropad", "pcb", "keyboard"]),
    item("RFID-RC522", "C", "2", category="RFID/NFC", tags=["rfid", "rc522"]),
    item("Water sensor", "C", "2", category="Sensors", tags=["sensor", "water"]),
    item("38kHz IR receiver", "C", "2", qty=6, category="IR", tags=["ir", "receiver", "38khz"]),
    item("38kHz IR transmitter", "C", "2", qty=5, category="IR", tags=["ir", "transmitter", "38khz"]),
    item("HC-SR04 ultrasonic sensor", "C", "2", category="Sensors", tags=["sensor", "ultrasonic", "distance", "hc-sr04"]),
    item("Neopixel jewel", "C", "2", category="LEDs", tags=["neopixel", "rgb", "addressable led"]),
    item("Neopixel jewel 7 RGBW (natural)", "C", "2", category="LEDs", tags=["neopixel", "rgbw", "addressable led"]),
    item("Adafruit IR receiver", "C", "2", category="IR", tags=["adafruit", "ir", "receiver"]),
    item("3-pin low power laser", "C", "2", category="Lasers", tags=["laser", "diode"]),
    item("Rotary encoder", "C", "2", category="Input", tags=["rotary encoder", "input"]),
    item("KY-037 sound sensor", "C", "2", category="Sensors", tags=["sensor", "sound", "microphone", "ky-037"]),
    item("DC motor with fan", "C", "2", qty=2, category="Motors", tags=["dc motor", "fan"]),
    item("28BYJ-48 stepper motor (5V, with ESP-CAM attachment)", "C", "2", category="Motors", tags=["stepper", "28byj-48", "esp-cam"]),
    item("DFRobot Offline Language Model ESP32 SEN0539-EN", "C", "2", category="ESP32", tags=["dfrobot", "esp32", "sen0539", "ai", "offline llm"]),
    item("3.5mm audio jack", "C", "2", qty=4, category="Audio", tags=["audio", "jack", "3.5mm"]),
    item("Breadboard PSU", "C", "2", qty=2, category="Power", tags=["breadboard", "psu"]),
    item("mmWave sensor", "C", "2", category="Sensors", tags=["sensor", "mmwave", "radar", "presence"]),
    item("Geared pancake motor", "C", "2", category="Motors", tags=["motor", "geared", "pancake"]),
    item("ULN2003 stepper motor driver board", "C", "2", category="Motor Drivers", tags=["uln2003", "stepper", "driver"]),
    item("DS1307 Real-Time Clock (RTC)", "C", "2", category="Modules", tags=["rtc", "ds1307", "clock"]),
    item("Stepper motor", "C", "2", category="Motors", tags=["stepper", "motor"]),
    item("Stepper motor attachments", "C", "2", category="Motors", tags=["stepper", "attachments"]),
    item("1602A LCD display (blue)", "C", "2", category="Displays", tags=["lcd", "1602a", "16x2"]),
    item("Piezo buzzer", "C", "2", category="Audio", tags=["piezo", "buzzer"]),
    item("Battery compartment (2x AA)", "C", "2", category="Power", tags=["battery", "aa", "holder"]),
    item("Keypad (1234567890 ABCD *#)", "C", "2", category="Input", tags=["keypad", "matrix keypad"]),
    item("GY-521 breakout board", "C", "2", category="Modules", tags=["gy-521", "mpu6050", "accelerometer", "gyro"]),
    item("DHT11 sensor", "C", "2", category="Sensors", tags=["sensor", "dht11", "temperature", "humidity"]),
    item("AVR ATMEL JOVE JVE M2 Antenna", "C", "2", category="RF/Antennas", tags=["antenna", "jve m2", "atmel"]),
    item("JVE M2 USB adapter", "C", "2", category="Adapters", tags=["jve m2", "usb adapter"]),
    item("8-pin omnidirectional whip antenna", "C", "2", category="RF/Antennas", tags=["antenna", "whip", "omnidirectional"]),
    item("Generic thumbstick joystick", "C", "2", qty=12, category="Input", tags=["joystick", "thumbstick", "analog"]),
]

# BOX C3 - Screens
items += [
    item('7" Raspberry Pi HDMI monitor', "C", "3", category="Displays", tags=["rpi", "hdmi", "monitor", "7 inch"]),
    item("Waveshare Pico LCD 1.8", "C", "3", category="Displays", tags=["waveshare", "pico", "lcd", "1.8 inch"]),
    item("Waveshare Pico LCD 1.3 (with buttons)", "C", "3", category="Displays", tags=["waveshare", "pico", "lcd", "1.3 inch", "buttons"]),
    item('2.8" TFT SPI 240x320 touchscreen', "C", "3", qty=3, category="Displays", tags=["tft", "spi", "touchscreen", "2.8 inch", "240x320"]),
    item('4" Arduino display (with case)', "C", "3", category="Displays", tags=["arduino", "display", "4 inch"]),
    item('4" 480x320 SPI TFT LCD module ST7796 (no touchscreen)', "C", "3", category="Displays", tags=["tft", "spi", "st7796", "4 inch", "480x320"]),
    item(".96 OLED (blue, bracketed)", "C", "3", category="Displays", tags=["oled", "0.96 inch"]),
    item('1.28" TFT round display', "C", "3", category="Displays", tags=["tft", "round", "1.28 inch"]),
]

# BOX D
items += [
    item("ESP32-C3", "D", "1", qty=2, category="ESP32", tags=["esp32", "esp32-c3"]),
    item("TP4056 USB-C charger module", "D", "2A", qty=12, category="Power", tags=["tp4056", "charger", "usb-c", "li-ion"]),
    item("Micro USB charger module (03962A)", "D", "2B", qty=10, category="Power", tags=["charger", "micro usb", "03962a"]),
    item("40-pin headers", "D", "3", qty=40, category="Connectors", tags=["headers", "pin headers", "40 pin"]),
    item("USB-C bare charger (6/16 pin)", "D", "4", category="Power", tags=["usb-c", "charger", "bare"], notes="6 and 16 pinned variants"),
    item("USB-A 2.0 module", "D", "5", qty=9, category="Connectors", tags=["usb-a", "usb 2.0", "module"]),
    item("Rack nut", "D", "6", qty=100, category="Hardware", tags=["rack nut", "hardware", "mounting"]),
    item("Rack screw and washer", "D", "7", qty=100, category="Hardware", tags=["rack screw", "washer", "hardware"]),
    item("Mini directional tactile joystick", "D", "8", qty=5, category="Input", tags=["joystick", "tactile", "mini", "directional"]),
    item("3-pin slide switch", "D", "9", qty=100, category="Switches", tags=["slide switch", "3 pin"]),
    item("Tactile button switch", "D", "10", qty=100, category="Switches", tags=["tactile button", "switch"]),
    item("Crimp connector (10-16 AWG)", "D", "11", category="Connectors", tags=["crimp", "connector", "10-16 awg"]),
    item("Crimp connector (16-22 AWG)", "D", "12B", category="Connectors", tags=["crimp", "connector", "16-22 awg"]),
    item("Pogo pin", "D", "12A", category="Connectors", tags=["pogo pin"]),
    item("Cat8 shielded keystone", "D", "13", category="Networking", tags=["cat8", "keystone", "shielded", "ethernet"]),
    item("Mini PIR sensor", "D", "14", qty=4, category="Sensors", tags=["pir", "motion", "mini"]),
    item("Large PIR sensor", "D", "14", qty=1, category="Sensors", tags=["pir", "motion", "large"]),
    item("MT3098", "D", "15A", qty=4, category="Modules", tags=["mt3098"]),
    item("8x8 LED matrix (dot)", "D", "15B", category="Displays", tags=["led matrix", "8x8", "dot matrix"]),
    item("4-digit 7-segment display", "D", "15B", category="Displays", tags=["7 segment", "4 digit"]),
    item("1-digit 7-segment display", "D", "15B", category="Displays", tags=["7 segment", "1 digit"]),
    item("10-segment LED loading bar", "D", "15B", category="Displays", tags=["led", "bar graph", "loading bar"]),
    item("Tactile button (assorted colors)", "D", "16", qty=20, category="Switches", tags=["tactile button", "assorted", "colored"]),
    item("LED (assorted colors)", "D", "17", category="LEDs", tags=["led", "assorted", "colored"]),
    item("Solder paste", "D", "41", category="Tools/Consumables", tags=["solder paste", "soldering"]),
    item("Solder flux", "D", "41", category="Tools/Consumables", tags=["flux", "soldering"]),
    item("Sponge", "D", "41", category="Tools/Consumables", tags=["sponge", "soldering"]),
    item("Solder", "D", "41", category="Tools/Consumables", tags=["solder", "soldering"]),
    item("USB DuPont cable", "D", "42", qty=3, category="Cables", tags=["usb", "dupont", "cable"]),
    item("Arduino cable", "D", "43", qty=4, category="Cables", tags=["arduino", "cable"]),
    item("Cat8 shielded RJ45 plug", "D", "44", category="Networking", tags=["cat8", "rj45", "shielded", "ethernet"]),
    item("Ethernet rubber plug cover", "D", "45", category="Networking", tags=["ethernet", "rubber cover"]),
    item("Perfboard", "D", "46", category="Prototyping", tags=["perfboard", "protoboard"]),
    item('1.3" OLED with rotary encoder', "D", "48", qty=3, category="Displays", tags=["oled", "1.3 inch", "rotary encoder"]),
    item("RP2040 Pico", "D", "49", qty=3, category="Microcontrollers", tags=["rp2040", "pico", "raspberry pi pico"]),
    item("Orpheus Pico RP2040", "D", "49", qty=1, category="Microcontrollers", tags=["rp2040", "pico", "orpheus"]),
    item("RP2040 Zero", "D", "49", qty=6, category="Microcontrollers", tags=["rp2040", "zero"]),
    item("ESP-12F", "D", "50", category="ESP32", tags=["esp8266", "esp-12f"]),
    item("ESP32-S", "D", "50", category="ESP32", tags=["esp32", "esp32-s"]),
    item("ESP32 breakout board", "D", "51", qty=2, category="ESP32", tags=["esp32", "breakout"]),
]

boxes = {
    "A": {"label": "Box A", "slots": {"A1": "Wires (DuPont connector)", "A2": "Misc", "A3": "Nothing"}},
    "B": {"label": "Box B", "slots": {"B1": "Nothing", "B2": "SBCs and RPIs", "B3": "Nothing"}},
    "C": {"label": "Box C", "slots": {"C1": "Arduinos", "C2": "General Parts", "C3": "Screens"}},
    "D": {"label": "Box D", "slots": {
        "D1": "ESP32-C3", "D2A": "TP4056 chargers", "D2B": "Micro USB chargers", "D3": "40-pin headers",
        "D4": "USB-C bare chargers", "D5": "USB-A 2.0 modules", "D6": "Rack nuts", "D7": "Rack screws/washers",
        "D8": "Mini tactile joysticks", "D9": "3-pin slide switches", "D10": "Tactile button switches",
        "D11": "10-16 AWG crimp connectors", "D12A": "Pogo pins", "D12B": "16-22 AWG crimp connectors",
        "D13": "Cat8 shielded keystones", "D14": "PIR sensors", "D15A": "MT3098", "D15B": "Digit displays/matrices",
        "D16": "Assorted tactile buttons", "D17": "Assorted LEDs", "D18-40": "Empty",
        "D41": "Solder supplies", "D42": "USB DuPont cables", "D43": "Arduino cables", "D44": "Cat8 RJ45 plugs",
        "D45": "Ethernet rubber plug covers", "D46": "Perfboards", "D47": "Empty",
        "D48": "1.3\" OLEDs w/ rotary encoders", "D49": "RP2040 Picos/Zeros", "D50": "ESP-12F/ESP32-S",
        "D51": "ESP32 breakout boards"
    }}
}

data = {"items": items, "boxes": boxes}

with open("/home/claude/finder/src/data/data.json", "w") as f:
    json.dump(data, f, indent=2)

print(f"Wrote {len(items)} items")
