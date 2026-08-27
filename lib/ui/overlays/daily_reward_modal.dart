import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';
import '../../services/retention_service.dart';

class DailyRewardModal extends StatelessWidget {
  final MiniMartGame game;
  final VoidCallback onClose;

  const DailyRewardModal({
    super.key,
    required this.game,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final player = game.playerData;
    final isAvailable = RetentionService.isDailyRewardAvailable(player);
    final currentDay = player.dailyStreak;

    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 340,
          padding: const EdgeInsets.all(20),
          decoration: NeoTheme.neoCardDecoration(
            color: Colors.white,
            radius: 16,
            shadow: 6,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.purpleAccent,
                      radius: 8,
                      shadow: 2,
                    ),
                    child: const Text(
                      '🎁 7 GÜNLÜK SERİ ÖDÜLÜ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: NeoTheme.inkBlack),
                    onPressed: onClose,
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // 7 Day Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 0.85,
                ),
                itemCount: 7,
                itemBuilder: (context, index) {
                  final reward = RetentionService.dailyRewards[index];
                  final isCurrent = (index + 1) == currentDay;
                  final isPast = (index + 1) < currentDay;

                  Color cardBg = Colors.white;
                  if (isCurrent && isAvailable) {
                    cardBg = NeoTheme.cornYellow;
                  } else if (isPast) {
                    cardBg = const Color(0xFFE2E8F0);
                  }

                  return Container(
                    padding: const EdgeInsets.all(6),
                    decoration: NeoTheme.neoCardDecoration(
                      color: cardBg,
                      radius: 8,
                      borderWidth: isCurrent ? 2.5 : 1.5,
                      shadow: isCurrent ? 3 : 1,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Gün ${reward.day}',
                          style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(reward.emoji, style: const TextStyle(fontSize: 18)),
                        const SizedBox(height: 2),
                        Text(
                          isPast ? '✅ Alındı' : '\$${reward.cashAmount}',
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w800,
                            color: isPast ? const Color(0xFF64748B) : NeoTheme.cashDarkGreen,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),

              const SizedBox(height: 16),

              // Claim Button
              GestureDetector(
                onTap: isAvailable
                    ? () {
                        HapticService.heavy();
                        SoundService.playLevelUp();
                        RetentionService.claimDailyReward(player);
                        game.notifyStateChanged();
                        game.saveGame();
                        onClose();
                      }
                    : null,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: NeoTheme.neoCardDecoration(
                    color: isAvailable ? NeoTheme.cashGreen : const Color(0xFFCBD5E1),
                    radius: 10,
                    shadow: isAvailable ? 4 : 0,
                  ),
                  child: Center(
                    child: Text(
                      isAvailable ? '🎉 GÜN $currentDay ÖDÜLÜNÜ AL' : 'Yarın Tekrar Gel!',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: isAvailable ? NeoTheme.inkBlack : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
