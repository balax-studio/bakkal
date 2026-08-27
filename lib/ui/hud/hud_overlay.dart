import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';
import 'virtual_joystick.dart';

class HUDOverlay extends StatelessWidget {
  final MiniMartGame game;
  final VoidCallback onOpenUpgrades;
  final VoidCallback onOpenDailyStreak;
  final VoidCallback onOpenWorkerManagement;
  final VoidCallback onOpenFranchise;

  const HUDOverlay({
    super.key,
    required this.game,
    required this.onOpenUpgrades,
    required this.onOpenDailyStreak,
    required this.onOpenWorkerManagement,
    required this.onOpenFranchise,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: [
          // 1. TOP BAR (Cash, Gems, Level, 2X Boost, Daily Streak, Web Test Add Money)
          Positioned(
            top: 12,
            left: 16,
            right: 16,
            child: Row(
              children: [
                // Cash Counter (Clickable to add test money on Web)
                ValueListenableBuilder<int>(
                  valueListenable: game.cashNotifier,
                  builder: (context, cash, _) {
                    return GestureDetector(
                      onTap: () {
                        if (kIsWeb) {
                          HapticService.heavy();
                          SoundService.playCashCollect();
                          game.playerData.cash += 500;
                          game.notifyStateChanged();
                          game.saveGame();
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: NeoTheme.neoCardDecoration(
                          color: Colors.white,
                          radius: 10,
                          shadow: 3,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const NeoIcon(NeoIconType.cash, size: 18),
                            const SizedBox(width: 6),
                            Text(
                              '\$$cash',
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: NeoTheme.inkBlack,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),

                // Web-Only Test Money Button
                if (kIsWeb) ...[
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {
                      HapticService.heavy();
                      SoundService.playCashCollect();
                      game.playerData.cash += 500;
                      game.notifyStateChanged();
                      game.saveGame();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: NeoTheme.neoCardDecoration(
                        color: NeoTheme.cashGreen,
                        radius: 10,
                        shadow: 3,
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          NeoIcon(NeoIconType.cash, size: 16),
                          SizedBox(width: 5),
                          Text(
                            r'+$500 TEST',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              color: NeoTheme.inkBlack,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],

                const SizedBox(width: 8),

                // Gems Counter
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: NeoTheme.neoCardDecoration(
                    color: Colors.white,
                    radius: 10,
                    shadow: 3,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const NeoIcon(NeoIconType.gem, size: 18),
                      const SizedBox(width: 5),
                      Text(
                        '${game.playerData.gems}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: NeoTheme.boostCyan,
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // Franchise Map Button
                GestureDetector(
                  onTap: () {
                    HapticService.selection();
                    onOpenFranchise();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.boostCyan,
                      radius: 10,
                      shadow: 3,
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        NeoIcon(NeoIconType.crown, size: 16),
                        SizedBox(width: 5),
                        Text(
                          'ŞEHİRLER',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(width: 8),

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
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        NeoIcon(NeoIconType.gift, size: 16),
                        SizedBox(width: 5),
                        Text(
                          'ÖDÜL',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                      ],
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
                              final watched = await game.adService.showRewardedAd(placement: 'hud_2x_boost');
                              if (watched) {
                                game.adService.activate2xBoost();
                              }
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            decoration: NeoTheme.neoCardDecoration(
                              color: isActive ? NeoTheme.boostCyan : NeoTheme.cashGreen,
                              radius: 10,
                              shadow: 3,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const NeoIcon(NeoIconType.lightning, size: 16),
                                const SizedBox(width: 5),
                                Text(
                                  isActive ? '$minutes:$seconds' : '2X HIZ',
                                  style: const TextStyle(
                                    fontSize: 11,
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

          // 2. ZONE BADGE
          Positioned(
            top: 64,
            left: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: NeoTheme.neoCardDecoration(
                color: const Color(0xFFE2E8F0),
                radius: 6,
                borderWidth: 2,
                shadow: 2,
              ),
              child: const Text(
                'Sol: Tarla & Atölye | Sağ: Bakkal',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  color: NeoTheme.inkBlack,
                ),
              ),
            ),
          ),

          // 3. TEA BREAK BOOST GAUGE (Çay Molası)
          Positioned(
            top: 64,
            right: 16,
            child: GestureDetector(
              onTap: () {
                HapticService.heavy();
                SoundService.playLevelUp();
                game.adService.activate2xBoost();
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: NeoTheme.neoCardDecoration(
                  color: const Color(0xFFFEF08A),
                  radius: 8,
                  borderWidth: 2,
                  shadow: 3,
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    NeoIcon(NeoIconType.teaCup, size: 16),
                    SizedBox(width: 5),
                    Text(
                      'ÇAY MOLASI!',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: NeoTheme.inkBlack,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 4. BOTTOM CONTROLS (Joystick + Workers & Upgrades Buttons)
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
            bottom: 28,
            right: 20,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Workers Management Button
                GestureDetector(
                  onTap: () {
                    HapticService.selection();
                    onOpenWorkerManagement();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.cornYellow,
                      radius: 12,
                      shadow: 4,
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        NeoIcon(NeoIconType.worker, size: 22),
                        SizedBox(height: 3),
                        Text(
                          'İŞÇİLER',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(width: 10),

                // Player Upgrades Button
                GestureDetector(
                  onTap: () {
                    HapticService.selection();
                    onOpenUpgrades();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.purpleAccent,
                      radius: 12,
                      shadow: 4,
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        NeoIcon(NeoIconType.upgrade, size: 22),
                        SizedBox(height: 3),
                        Text(
                          'YÜKSELT',
                          style: TextStyle(
                            fontSize: 10,
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
