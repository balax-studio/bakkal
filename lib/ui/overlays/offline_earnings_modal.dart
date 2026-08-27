import 'package:flutter/material.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';
import '../../services/retention_service.dart';

class OfflineEarningsModal extends StatelessWidget {
  final MiniMartGame game;
  final OfflineEarningsReport report;
  final VoidCallback onClose;

  const OfflineEarningsModal({
    super.key,
    required this.game,
    required this.report,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final minutes = report.elapsedSeconds ~/ 60;
    final hours = minutes ~/ 60;
    final displayMins = minutes % 60;
    final timeStr = hours > 0 ? '$hours saat $displayMins dk' : '$minutes dakika';

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
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: NeoTheme.neoCardDecoration(
                  color: NeoTheme.goldCoin,
                  radius: 8,
                  shadow: 2,
                ),
                child: const Text(
                  'HOŞ GELDİN PATRON!',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: NeoTheme.inkBlack,
                  ),
                ),
              ),

              const SizedBox(height: 16),
              const NeoIcon(NeoIconType.cash, size: 48),
              const SizedBox(height: 10),

              Text(
                'Sen yokken ($timeStr)\nçalışanların marketi işletti!',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF64748B),
                ),
              ),

              const SizedBox(height: 12),

              // Earnings Amount Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: NeoTheme.neoCardDecoration(
                  color: const Color(0xFFF1F5F9),
                  radius: 10,
                  borderWidth: 2,
                  shadow: 2,
                ),
                child: Column(
                  children: [
                    const Text(
                      'TOPLANAN GELİR',
                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8)),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '+\$${report.earnedCash}',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: NeoTheme.cashDarkGreen,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Action 1: 2X Claim with Rewarded Ad
              GestureDetector(
                onTap: () async {
                  HapticService.heavy();
                  final watched = await game.adService.showRewardedAd(placement: 'offline_earnings_2x');
                  if (watched) {
                    game.playerData.cash += (report.earnedCash * 2);
                    game.notifyStateChanged();
                    game.saveGame();
                    onClose();
                  }
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: NeoTheme.neoCardDecoration(
                    color: NeoTheme.cashGreen,
                    radius: 10,
                    shadow: 4,
                  ),
                  child: Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const NeoIcon(NeoIconType.lightning, size: 18),
                        const SizedBox(width: 8),
                        Text(
                          '2X İLE AL: +\$${report.earnedCash * 2}',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 10),

              // Action 2: Normal Claim 1X
              TextButton(
                onPressed: () {
                  HapticService.light();
                  game.playerData.cash += report.earnedCash;
                  game.notifyStateChanged();
                  game.saveGame();
                  onClose();
                },
                child: Text(
                  'Normal Al (+\$${report.earnedCash})',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF64748B),
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
