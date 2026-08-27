import 'dart:math' as math;
import '../domain/models/game_models.dart';

class OfflineEarningsReport {
  final int elapsedSeconds;
  final int earnedCash;
  final bool hasEarnings;

  OfflineEarningsReport({
    required this.elapsedSeconds,
    required this.earnedCash,
    required this.hasEarnings,
  });
}

class RetentionService {
  // Max offline hours to accumulate rewards (8 hours = 28800 seconds)
  static const int maxOfflineSeconds = 8 * 3600;

  // Calculate offline earnings based on player progress and elapsed time
  static OfflineEarningsReport calculateOfflineEarnings(PlayerData player) {
    final nowSeconds = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    final lastSaved = player.lastSavedEpochSeconds;
    final elapsed = nowSeconds - lastSaved;

    // Must be away for at least 60 seconds to trigger welcome back modal
    if (elapsed < 60) {
      return OfflineEarningsReport(
        elapsedSeconds: elapsed,
        earnedCash: 0,
        hasEarnings: false,
      );
    }

    final cappedSeconds = math.min(elapsed, maxOfflineSeconds);

    // Passive rate per second based on unlocked workers and market index
    double baseEarningsPerMinute = 12.0;
    if (player.unlockedAreas.contains('worker_restocker_1')) {
      baseEarningsPerMinute += 18.0;
    }
    if (player.unlockedAreas.contains('worker_cashier_1')) {
      baseEarningsPerMinute += 25.0;
    }
    baseEarningsPerMinute *= (1.0 + player.activeMarketIndex * 0.5);

    final totalCash = (baseEarningsPerMinute * (cappedSeconds / 60.0)).round();

    return OfflineEarningsReport(
      elapsedSeconds: elapsed,
      earnedCash: totalCash,
      hasEarnings: totalCash > 0,
    );
  }

  // Daily Streak Rewards table (7 Days)
  static final List<DailyRewardItem> dailyRewards = [
    DailyRewardItem(day: 1, rewardTitle: '50 Nakit', cashAmount: 50, emoji: '💵'),
    DailyRewardItem(day: 2, rewardTitle: '120 Nakit', cashAmount: 120, emoji: '💰'),
    DailyRewardItem(day: 3, rewardTitle: '250 Nakit + 2X Hız', cashAmount: 250, emoji: '⚡'),
    DailyRewardItem(day: 4, rewardTitle: '400 Nakit', cashAmount: 400, emoji: '💵'),
    DailyRewardItem(day: 5, rewardTitle: '700 Nakit', cashAmount: 700, emoji: '💎'),
    DailyRewardItem(day: 6, rewardTitle: '1,200 Nakit', cashAmount: 1200, emoji: '📦'),
    DailyRewardItem(day: 7, rewardTitle: '3,000 Altın + Süper Kasiyer', cashAmount: 3000, emoji: '👑'),
  ];

  static bool isDailyRewardAvailable(PlayerData player) {
    final currentEpochDay = DateTime.now().millisecondsSinceEpoch ~/ (1000 * 86400);
    return currentEpochDay > player.lastDailyClaimEpochDay;
  }

  static DailyRewardItem getTodayReward(PlayerData player) {
    final dayIndex = (player.dailyStreak - 1) % 7;
    return dailyRewards[dayIndex];
  }

  static void claimDailyReward(PlayerData player) {
    final currentEpochDay = DateTime.now().millisecondsSinceEpoch ~/ (1000 * 86400);
    final reward = getTodayReward(player);
    player.cash += reward.cashAmount;
    player.lastDailyClaimEpochDay = currentEpochDay;
    if (player.dailyStreak >= 7) {
      player.dailyStreak = 1;
    } else {
      player.dailyStreak += 1;
    }
  }
}

class DailyRewardItem {
  final int day;
  final String rewardTitle;
  final int cashAmount;
  final String emoji;

  DailyRewardItem({
    required this.day,
    required this.rewardTitle,
    required this.cashAmount,
    required this.emoji,
  });
}
