import 'package:flutter/services.dart';

class SoundService {
  static bool soundEnabled = true;

  static void playHarvest() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.click);
  }

  static void playStockShelf() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.click);
  }

  static void playCashCollect() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.click);
  }

  static void playUnlock() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.alert);
  }

  static void playLevelUp() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.alert);
  }

  static void playCleanSweep() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.click);
  }

  static void playSpecialEvent() {
    if (!soundEnabled) return;
    SystemSound.play(SystemSoundType.alert);
  }
}
