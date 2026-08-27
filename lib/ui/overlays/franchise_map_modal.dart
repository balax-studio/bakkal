import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';

class FranchiseMapModal extends StatelessWidget {
  final MiniMartGame game;
  final VoidCallback onClose;

  const FranchiseMapModal({
    super.key,
    required this.game,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final player = game.playerData;
    final currentCityIdx = player.activeMarketIndex;

    final cities = [
      {
        'name': 'İSTANBUL',
        'title': 'Mahalle Bakkalı & Organik Tarım',
        'desc': 'Taş fırın, sera domatesi, taze süt ve demlik çay standı.',
        'multiplier': '1.0x',
        'color': NeoTheme.grassGreen,
        'icon': NeoIconType.farmer,
      },
      {
        'name': 'İZMİR',
        'title': 'Ege Gurme & Şarküteri',
        'desc': 'Zeytinyağı, soğuk süt tankları, özel ayran şelalesi ve kurye filosu.',
        'multiplier': '2.5x',
        'color': NeoTheme.boostCyan,
        'icon': NeoIconType.stocker,
      },
      {
        'name': 'ANKARA',
        'title': 'Mega Hipermarket & Lojistik Üssü',
        'desc': 'Endüstriyel sera tünelleri, otomatik kasa hatları ve toptancı tırları.',
        'multiplier': '5.0x',
        'color': NeoTheme.purpleAccent,
        'icon': NeoIconType.crown,
      },
    ];

    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 380,
          margin: const EdgeInsets.symmetric(horizontal: 16),
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
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.goldCoin,
                      radius: 8,
                      shadow: 2,
                    ),
                    child: const NeoIcon(NeoIconType.crown, size: 20),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'ŞEHİR FRANCHISE AĞI',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: NeoTheme.inkBlack,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {
                      HapticService.selection();
                      onClose();
                    },
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: NeoTheme.neoCardDecoration(
                        color: NeoTheme.tomatoRed,
                        radius: 8,
                        shadow: 2,
                      ),
                      child: const Icon(Icons.close, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // City Cards List
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: cities.length,
                separatorBuilder: (context, index) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final city = cities[index];
                  final isCurrent = index == currentCityIdx;
                  final isUnlocked = index <= currentCityIdx;

                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: NeoTheme.neoCardDecoration(
                      color: isCurrent
                          ? (city['color'] as Color).withValues(alpha: 0.12)
                          : const Color(0xFFF8FAFC),
                      radius: 10,
                      borderWidth: isCurrent ? 2.5 : 1.5,
                      shadow: isCurrent ? 3 : 1,
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: NeoTheme.neoCardDecoration(
                            color: isUnlocked ? (city['color'] as Color) : const Color(0xFF94A3B8),
                            radius: 8,
                            shadow: 1.5,
                          ),
                          child: NeoIcon(city['icon'] as NeoIconType, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    city['name'] as String,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                      color: NeoTheme.inkBlack,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: NeoTheme.neoCardDecoration(
                                      color: NeoTheme.goldCoin,
                                      radius: 4,
                                      borderWidth: 1.2,
                                      shadow: 1,
                                    ),
                                    child: Text(
                                      city['multiplier'] as String,
                                      style: const TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w900,
                                        color: NeoTheme.inkBlack,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                city['title'] as String,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF475569),
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (isCurrent)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: NeoTheme.neoCardDecoration(
                              color: NeoTheme.cashGreen,
                              radius: 6,
                              shadow: 1.5,
                            ),
                            child: const Text(
                              'AKTİF',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                          )
                        else if (isUnlocked)
                          GestureDetector(
                            onTap: () {
                              HapticService.heavy();
                              game.playerData.activeMarketIndex = index;
                              game.saveGame();
                              game.notifyStateChanged();
                              onClose();
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: NeoTheme.neoCardDecoration(
                                color: NeoTheme.purpleAccent,
                                radius: 6,
                                shadow: 1.5,
                              ),
                              child: const Text(
                                'GEÇ',
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          )
                        else
                          const Icon(Icons.lock, color: Color(0xFF94A3B8), size: 18),
                      ],
                    ),
                  );
                },
              ),

              const SizedBox(height: 16),

              // Franchise Expansion Button
              GestureDetector(
                onTap: () {
                  HapticService.heavy();
                  SoundService.playLevelUp();
                  final nextIdx = (player.activeMarketIndex + 1) % 3;
                  player.activeMarketIndex = nextIdx;
                  player.profitLevel += 1; // Permanent +25% prestige bonus
                  game.saveGame();
                  game.notifyStateChanged();
                  onClose();
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 13),
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
                          'FRANCHISE GENİŞLET (+%25 KALICI KÂR)',
                          style: TextStyle(
                            fontSize: 12,
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
