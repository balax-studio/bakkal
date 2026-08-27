import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';

class LevelCompleteModal extends StatelessWidget {
  final MiniMartGame game;

  const LevelCompleteModal({
    super.key,
    required this.game,
  });

  @override
  Widget build(BuildContext context) {
    final nextLevelIdx = (game.playerData.activeMarketIndex + 1) % 3;
    final nextTitles = [
      'Organik Manav & Sera',
      'Fırın & Kahvaltı Atölyesi',
      'Mega Hipermarket & Gurme',
    ];
    final nextTitle = nextTitles[nextLevelIdx];

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
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    NeoIcon(NeoIconType.crown, size: 18),
                    SizedBox(width: 6),
                    Text(
                      'SEVKİYAT TAMAMLANDI!',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: NeoTheme.inkBlack,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),
              const NeoIcon(NeoIconType.motorcycle, size: 48),
              const SizedBox(height: 10),

              const Text(
                'Tebrikler!\nTüm siparişler kamyona yüklendi.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF64748B),
                ),
              ),

              const SizedBox(height: 14),

              // Next Destination Card
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
                      'SIRADAKİ MAĞAZA',
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8)),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      nextTitle,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: NeoTheme.purpleAccent,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // Advance Button
              GestureDetector(
                onTap: () {
                  HapticService.heavy();
                  SoundService.playLevelUp();
                  game.advanceToNextMarket();
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: NeoTheme.neoCardDecoration(
                    color: NeoTheme.cashGreen,
                    radius: 10,
                    shadow: 4,
                  ),
                  child: const Center(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        NeoIcon(NeoIconType.lightning, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'YENİ MARKETE GEÇ',
                          style: TextStyle(
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
            ],
          ),
        ),
      ),
    );
  }
}
