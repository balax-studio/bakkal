import 'package:flutter/services.dart';

class StationHaptics {
  static void light() {
    try {
      HapticFeedback.lightImpact();
    } catch (_) {}
  }

  static void medium() {
    try {
      HapticFeedback.mediumImpact();
    } catch (_) {}
  }

  static void heavy() {
    try {
      HapticFeedback.heavyImpact();
    } catch (_) {}
  }

  static void success() {
    try {
      HapticFeedback.selectionClick();
    } catch (_) {}
  }
}
