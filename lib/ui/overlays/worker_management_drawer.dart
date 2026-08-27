import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../../game/mini_mart_game.dart';

class WorkerManagementDrawer extends StatefulWidget {
  final MiniMartGame game;
  final VoidCallback onClose;

  const WorkerManagementDrawer({
    super.key,
    required this.game,
    required this.onClose,
  });

  @override
  State<WorkerManagementDrawer> createState() => _WorkerManagementDrawerState();
}

class _WorkerManagementDrawerState extends State<WorkerManagementDrawer> {
  WorkerRole selectedRole = WorkerRole.farmer;

  void _hireWorker(WorkerRole role) {
    final stats = widget.game.playerData.getWorkerStats(role);
    final cost = stats.hireCost;

    if (widget.game.playerData.cash >= cost) {
      setState(() {
        widget.game.playerData.cash -= cost;
        stats.hiredCount += 1;
        widget.game.cashNotifier.value = widget.game.playerData.cash;
        widget.game.spawnWorker(role);
      });

      SoundService.playLevelUp();
      HapticService.heavy();
    }
  }

  void _upgradeWorker(WorkerRole role) {
    final stats = widget.game.playerData.getWorkerStats(role);
    final cost = stats.upgradeCost;

    if (widget.game.playerData.cash >= cost) {
      setState(() {
        widget.game.playerData.cash -= cost;
        stats.level += 1;
        widget.game.cashNotifier.value = widget.game.playerData.cash;
      });

      SoundService.playLevelUp();
      HapticService.medium();
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentCash = widget.game.playerData.cash;
    final currentStats = widget.game.playerData.getWorkerStats(selectedRole);

    return Scaffold(
      backgroundColor: Colors.black.withValues(alpha: 0.55),
      body: Center(
        child: Container(
          width: 380,
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
          padding: const EdgeInsets.all(20),
          decoration: NeoTheme.neoCardDecoration(
            color: Colors.white,
            radius: 16,
            shadow: 6,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // 1. Header (Title + Close Button)
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: NeoTheme.neoCardDecoration(
                      color: NeoTheme.cornYellow,
                      radius: 8,
                      shadow: 2,
                    ),
                    child: const Text('👷‍♂️', style: TextStyle(fontSize: 20)),
                  ),
                  const SizedBox(width: 10),
                  const Text(
                    'İŞÇİ YÖNETİMİ',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: NeoTheme.inkBlack,
                    ),
                  ),
                  const Spacer(),
                  GestureDetector(
                    onTap: () {
                      HapticService.selection();
                      widget.onClose();
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

              // 2. Class Selector Tabs (4 Roles)
              Row(
                children: WorkerRole.values.map((role) {
                  final isSelected = role == selectedRole;
                  final stats = widget.game.playerData.getWorkerStats(role);

                  String roleIcon = '🌾';
                  if (role == WorkerRole.stocker) roleIcon = '📦';
                  if (role == WorkerRole.cashier) roleIcon = '💳';
                  if (role == WorkerRole.cleaner) roleIcon = '🧹';

                  return Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedRole = role;
                        });
                        HapticService.selection();
                      },
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: NeoTheme.neoCardDecoration(
                          color: isSelected ? role.color : const Color(0xFFF1F5F9),
                          radius: 8,
                          borderWidth: isSelected ? 2.5 : 1.5,
                          shadow: isSelected ? 3 : 1,
                        ),
                        child: Column(
                          children: [
                            Text(roleIcon, style: const TextStyle(fontSize: 16)),
                            const SizedBox(height: 2),
                            Text(
                              '(${stats.hiredCount})',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                color: isSelected ? Colors.white : NeoTheme.inkBlack,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 16),

              // 3. Selected Worker Details Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: NeoTheme.neoCardDecoration(
                  color: selectedRole.color.withValues(alpha: 0.12),
                  radius: 12,
                  borderWidth: 2.0,
                  shadow: 3,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          selectedRole.title,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: NeoTheme.inkBlack,
                          ),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: NeoTheme.neoCardDecoration(
                            color: NeoTheme.goldCoin,
                            radius: 6,
                            shadow: 1.5,
                          ),
                          child: Text(
                            'SEVİYE ${currentStats.level}',
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: NeoTheme.inkBlack,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      selectedRole.description,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF475569),
                      ),
                    ),
                    const Divider(height: 20, thickness: 1.5),

                    // Stats BARS
                    _buildStatRow('Taşıma Kapasitesi', '${currentStats.capacity} Ürün', (currentStats.capacity / 10).clamp(0.1, 1.0)),
                    const SizedBox(height: 8),
                    _buildStatRow('Hareket Hızı', '+${((currentStats.speedMultiplier - 1.0) * 100).toInt()}%', (currentStats.speedMultiplier / 2.5).clamp(0.2, 1.0)),
                    const SizedBox(height: 8),
                    _buildStatRow('Çalışan Sayısı', '${currentStats.hiredCount} İşçi', (currentStats.hiredCount / 5).clamp(0.0, 1.0)),
                  ],
                ),
              ),

              const SizedBox(height: 18),

              // 4. Proportional Action Buttons: "İşe Al" & "Geliştir"
              Row(
                children: [
                  // Hire Button
                  Expanded(
                    child: GestureDetector(
                      onTap: currentCash >= currentStats.hireCost ? () => _hireWorker(selectedRole) : null,
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: NeoTheme.neoCardDecoration(
                          color: currentCash >= currentStats.hireCost ? NeoTheme.cashGreen : const Color(0xFF94A3B8),
                          radius: 10,
                          shadow: currentCash >= currentStats.hireCost ? 3 : 1,
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'İŞE AL',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              '\$${currentStats.hireCost}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 10),

                  // Upgrade Button
                  Expanded(
                    child: GestureDetector(
                      onTap: currentCash >= currentStats.upgradeCost ? () => _upgradeWorker(selectedRole) : null,
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: NeoTheme.neoCardDecoration(
                          color: currentCash >= currentStats.upgradeCost ? NeoTheme.purpleAccent : const Color(0xFF94A3B8),
                          radius: 10,
                          shadow: currentCash >= currentStats.upgradeCost ? 3 : 1,
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'GELİŞTİR',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              '\$${currentStats.upgradeCost}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, double progress) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: NeoTheme.inkBlack),
            ),
            Text(
              value,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: NeoTheme.inkBlack),
            ),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: const Color(0xFFCBD5E1),
            valueColor: AlwaysStoppedAnimation<Color>(selectedRole.color),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
