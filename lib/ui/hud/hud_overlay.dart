import 'package:flutter/material.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';
import 'virtual_joystick.dart';

class HUDOverlay extends StatelessWidget {
  final MiniMartGame game;
  final VoidCallback onOpenUpgrades;
  final VoidCallback onOpenDailyStreak;

  const HUDOverlay({
    super.key,
    required this.game,
    required this.onOpenUpgrades,
    required this.onOpenDailyStreak,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          // 1. TOP BAR (Cash, Level, 2X Boost, Daily Streak)
          Positioned(
            top: 12,
            left: 16,
            right: 16,
            child: Row(
              children: [
                // Cash Counter
                ValueListenableBuilder<int>(
                  valueListenable: game.cashNotifier,
                  builder: (context, cash, _) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: NeoTheme.neoCardDecoration(
                        color: Colors.white,
                        radius: 10,
                        shadow: 3,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text('💵', style: TextStyle(fontSize: 18)),
                          const SizedBox(width: 6),
                          Text(
                            '\$$cash',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: NeoTheme.inkBlack,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),

                const Spacer(),

                // Daily Reward Button
                GestureDetector(
                  onTap: () {
                    HapticService.selection();
                    onOpenDailyStreak();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.cornYellow,
                      radius: 10,
                      shadow: 3,
                    ),
                    child: const Text(
                      '🎁 ÖDÜL',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: NeoTheme.inkBlack,
                      ),
                    ),
                  ),
                ),

                const SizedBox(width: 8),

                // 2X Rewarded Ad Boost Pill
                ValueListenableBuilder<bool>(
                  valueListenable: game.adService.is2xBoostActive,
                  builder: (context, isActive, _) {
                    return ValueListenableBuilder<int>(
                      valueListenable: game.adService.boostRemainingSeconds,
                      builder: (context, remaining, _) {
                        final minutes = (remaining ~/ 60).toString().padLeft(2, '0');
                        final seconds = (remaining % 60).toString().padLeft(2, '0');

                        return GestureDetector(
                          onTap: () async {
                            if (!isActive) {
                              HapticService.medium();
                              // Watch Rewarded Ad to get 3 min frenzy boost!
                              final watched = await game.adService.showRewardedAd(placement: 'hud_2x_boost');
                              if (watched) {
                                game.adService.activate2xBoost();
                              }
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: NeoTheme.neoCardDecoration(
                              color: isActive ? NeoTheme.boostCyan : NeoTheme.cashGreen,
                              radius: 10,
                              shadow: 3,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text('⚡', style: TextStyle(fontSize: 16)),
                                const SizedBox(width: 4),
                                Text(
                                  isActive ? '$minutes:$seconds' : '2X HIZ (Reklam)',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    color: NeoTheme.inkBlack,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
              ],
            ),
          ),

          // 2. MARKET TITLE BADGE
          Positioned(
            top: 66,
            left: 16,
            child: ValueListenableBuilder<int>(
              valueListenable: game.marketLevelNotifier,
              builder: (context, level, _) {
                final titles = [
                  '🏪 Market 1: Organik Manav',
                  '🥐 Market 2: Fırın & Kafe',
                  '🛒 Market 3: Mega Hipermarket',
                ];
                final title = titles[level % titles.length];

                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: NeoTheme.neoCardDecoration(
                    color: const Color(0xFFE2E8F0),
                    radius: 6,
                    borderWidth: 2,
                    shadow: 2,
                  ),
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: NeoTheme.inkBlack,
                    ),
                  ),
                );
              },
            ),
          ),

          // 3. BOTTOM CONTROLS (Joystick + Upgrades Button)
          Positioned(
            bottom: 24,
            left: 24,
            child: VirtualJoystickWidget(
              onDirectionChanged: (dir) {
                game.setJoystickVector(dir);
              },
            ),
          ),

          Positioned(
            bottom: 32,
            right: 24,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Upgrades Floating Action Card
                GestureDetector(
                  onTap: () {
                    HapticService.selection();
                    onOpenUpgrades();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.purpleAccent,
                      radius: 12,
                      shadow: 4,
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('⬆️', style: TextStyle(fontSize: 22)),
                        SizedBox(height: 4),
                        Text(
                          'YÜKSELT',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
