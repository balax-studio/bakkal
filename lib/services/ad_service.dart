import 'dart:async';
import 'package:flutter/foundation.dart';

class AdService {
  static final AdService instance = AdService._internal();
  AdService._internal();

  // 2X Frenzy Boost State
  final ValueNotifier<bool> is2xBoostActive = ValueNotifier<bool>(false);
  final ValueNotifier<int> boostRemainingSeconds = ValueNotifier<int>(0);
  Timer? _boostTimer;

  // Total boost duration in seconds (3 minutes = 180 seconds)
  static const int boostDuration = 180;

  void activate2xBoost() {
    is2xBoostActive.value = true;
    boostRemainingSeconds.value = boostDuration;

    _boostTimer?.cancel();
    _boostTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (boostRemainingSeconds.value > 1) {
        boostRemainingSeconds.value -= 1;
      } else {
        is2xBoostActive.value = false;
        boostRemainingSeconds.value = 0;
        timer.cancel();
      }
    });
  }

  /// Simulates watching an interactive rewarded ad with a clean callback
  Future<bool> showRewardedAd({required String placement}) async {
    // In production, this integrates with Google Mobile Ads (AdMob RewardedAd)
    // For seamless immediate gameplay, we resolve smoothly with simulated reward
    await Future.delayed(const Duration(milliseconds: 500));
    return true;
  }

  void dispose() {
    _boostTimer?.cancel();
  }
}
