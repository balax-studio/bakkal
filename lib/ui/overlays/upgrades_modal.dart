import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../game/mini_mart_game.dart';

class UpgradesModal extends StatefulWidget {
  final MiniMartGame game;
  final VoidCallback onClose;

  const UpgradesModal({
    super.key,
    required this.game,
    required this.onClose,
  });

  @override
  State<UpgradesModal> createState() => _UpgradesModalState();
}

class _UpgradesModalState extends State<UpgradesModal> {
  @override
  Widget build(BuildContext context) {
    final player = widget.game.playerData;

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
              // Header
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
                      '⚡ MAĞAZA YÜKSELTMELERİ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: NeoTheme.inkBlack),
                    onPressed: widget.onClose,
                  ),
                ],
              ),

              const SizedBox(height: 14),

              // 1. Movement Speed Upgrade Card
              _buildUpgradeCard(
                icon: '🏃',
                title: 'Karakter Hızı',
                level: 'Sv. ${player.speedLevel}',
                benefit: '${player.moveSpeed.toInt()} px/s',
                cost: player.speedUpgradeCost,
                canAfford: player.cash >= player.speedUpgradeCost,
                onUpgrade: () {
                  if (player.cash >= player.speedUpgradeCost) {
                    setState(() {
                      player.cash -= player.speedUpgradeCost;
                      player.speedLevel += 1;
                    });
                    _applyAndSave();
                  }
                },
              ),

              const SizedBox(height: 10),

              // 2. Backpack Capacity Upgrade Card
              _buildUpgradeCard(
                icon: '🎒',
                title: 'Taşıma Kapasitesi',
                level: 'Sv. ${player.capacityLevel}',
                benefit: '${player.maxCapacity} Koli',
                cost: player.capacityUpgradeCost,
                canAfford: player.cash >= player.capacityUpgradeCost,
                onUpgrade: () {
                  if (player.cash >= player.capacityUpgradeCost) {
                    setState(() {
                      player.cash -= player.capacityUpgradeCost;
                      player.capacityLevel += 1;
                    });
                    _applyAndSave();
                  }
                },
              ),

              const SizedBox(height: 10),

              // 3. Profit Multiplier Upgrade Card
              _buildUpgradeCard(
                icon: '💰',
                title: 'Kâr Çarpanı',
                level: 'Sv. ${player.profitLevel}',
                benefit: '${player.profitMultiplier.toStringAsFixed(2)}x Fiyat',
                cost: player.profitUpgradeCost,
                canAfford: player.cash >= player.profitUpgradeCost,
                onUpgrade: () {
                  if (player.cash >= player.profitUpgradeCost) {
                    setState(() {
                      player.cash -= player.profitUpgradeCost;
                      player.profitLevel += 1;
                    });
                    _applyAndSave();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _applyAndSave() {
    SoundService.playLevelUp();
    HapticService.heavy();
    widget.game.notifyStateChanged();
    widget.game.saveGame();
  }

  Widget _buildUpgradeCard({
    required String icon,
    required String title,
    required String level,
    required String benefit,
    required int cost,
    required bool canAfford,
    required VoidCallback onUpgrade,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: NeoTheme.neoCardDecoration(
        color: const Color(0xFFF8FAFC),
        radius: 10,
        borderWidth: 2,
        shadow: 2,
      ),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: NeoTheme.inkBlack),
                ),
                Text(
                  '$level • $benefit',
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: canAfford ? onUpgrade : null,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: NeoTheme.neoCardDecoration(
                color: canAfford ? NeoTheme.cashGreen : const Color(0xFFE2E8F0),
                radius: 8,
                borderWidth: 2,
                shadow: canAfford ? 2 : 0,
              ),
              child: Text(
                '\$$cost',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: canAfford ? NeoTheme.inkBlack : const Color(0xFF94A3B8),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
