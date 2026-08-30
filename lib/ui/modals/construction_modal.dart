import 'package:flutter/material.dart';
import '../../core/audio/haptic_feedback.dart';
import '../../core/theme/station_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../domain/station_state.dart';

class ConstructionModal extends StatelessWidget {
  final StationState stationState;
  final VoidCallback onClose;

  const ConstructionModal({
    super.key,
    required this.stationState,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 440,
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          padding: const EdgeInsets.all(18),
          decoration: StationTheme.neoCard(
            background: StationTheme.paper,
            hasShadow: true,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                children: [
                  const Icon(Icons.architecture_rounded,
                      color: StationTheme.red, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'İnşaat & Tesis Yatırımları',
                    style: StationTheme.font(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: StationTheme.ink,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close_rounded,
                        color: StationTheme.ink, size: 22),
                    onPressed: onClose,
                  ),
                ],
              ),
              const Divider(color: StationTheme.ink, thickness: 2.0),
              const SizedBox(height: 8),

              // Upgrade Cards List
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      // 1. Pompa Adası
                      _buildUpgradeCard(
                        context: context,
                        icon: Icons.local_gas_station_rounded,
                        color: StationTheme.green,
                        title: 'Pompa Adası Ekle (Maks 4)',
                        description:
                            'İstasyona yeni bir dolum peronu ekler. Müşteri kapasitesini artırır.',
                        cost: 5000.0 * stationState.pumpsCount,
                        isUnlocked: stationState.pumpsCount >= 4,
                        unlockedLabel: 'MAKS SEVİYE (${stationState.pumpsCount} Pompa)',
                        onBuy: () {
                          if (stationState.upgradePumps()) {
                            StationHaptics.success();
                          } else {
                            StationHaptics.heavy();
                          }
                        },
                      ),
                      const SizedBox(height: 8),

                      // 2. Oto Yıkama
                      _buildUpgradeCard(
                        context: context,
                        icon: Icons.local_car_wash_rounded,
                        color: StationTheme.blue,
                        title: 'Otomatik Tünel Oto Yıkama',
                        description:
                            'Yakıt alan müşteriler ek yıkama ücreti öder. İstasyon itibarını artırır.',
                        cost: 12000.0,
                        isUnlocked: stationState.hasCarWash,
                        unlockedLabel: 'KURULDU ✓',
                        onBuy: () {
                          if (stationState.buildCarWash()) {
                            StationHaptics.success();
                          } else {
                            StationHaptics.heavy();
                          }
                        },
                      ),
                      const SizedBox(height: 8),

                      // 3. Güneş Santrali
                      _buildUpgradeCard(
                        context: context,
                        icon: Icons.solar_power_rounded,
                        color: StationTheme.amber,
                        title: 'Çatı Güneş Paneli Santrali',
                        description:
                            'Gündüz saatlerinde bataryaları ücretsiz doldurur ve elektrik maliyetini sıfırlar.',
                        cost: 8000.0,
                        isUnlocked: stationState.hasSolarPanels,
                        unlockedLabel: 'KURULDU ✓',
                        onBuy: () {
                          if (stationState.buildSolarPanels()) {
                            StationHaptics.success();
                          } else {
                            StationHaptics.heavy();
                          }
                        },
                      ),
                      const SizedBox(height: 8),

                      // 4. EV Hızlı Şarj
                      _buildUpgradeCard(
                        context: context,
                        icon: Icons.ev_station_rounded,
                        color: StationTheme.evCyan,
                        title: 'Elektrikli Hızlı Şarj İstasyonu',
                        description:
                            'Elektrikli SUV ve araçların istasyona gelmesini sağlar.',
                        cost: 10000.0,
                        isUnlocked: stationState.hasEvCharger,
                        unlockedLabel: 'KURULDU ✓',
                        onBuy: () {
                          if (stationState.buildEvCharger()) {
                            StationHaptics.success();
                          } else {
                            StationHaptics.heavy();
                          }
                        },
                      ),
                      const SizedBox(height: 8),

                      // 5. İstasyon Müdürü
                      _buildUpgradeCard(
                        context: context,
                        icon: Icons.badge_rounded,
                        color: StationTheme.red,
                        title: 'İstasyon Müdürü İşe Al',
                        description:
                            'Pompaları otomatik çalıştırır, biten yakıtı sipariş eder ve oyunda değilken AFK gelir üretir.',
                        cost: 15000.0,
                        isUnlocked: stationState.hasManager,
                        unlockedLabel: 'GÖREVDE ✓',
                        onBuy: () {
                          if (stationState.hireManager()) {
                            StationHaptics.success();
                          } else {
                            StationHaptics.heavy();
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUpgradeCard({
    required BuildContext context,
    required IconData icon,
    required Color color,
    required String title,
    required String description,
    required double cost,
    required bool isUnlocked,
    required String unlockedLabel,
    required VoidCallback onBuy,
  }) {
    final canAfford = stationState.money >= cost;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: StationTheme.paperDark,
        borderRadius: BorderRadius.circular(StationTheme.rMd),
        border: Border.all(color: StationTheme.ink, width: 2.0),
      ),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(StationTheme.rSm),
              border: Border.all(color: StationTheme.ink, width: 1.8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: StationTheme.font(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  description,
                  style: StationTheme.font(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    color: StationTheme.muted,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          if (isUnlocked)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: StationTheme.green.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(StationTheme.rSm),
                border: Border.all(color: StationTheme.green, width: 1.5),
              ),
              child: Text(
                unlockedLabel,
                style: StationTheme.font(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: StationTheme.greenDark,
                ),
              ),
            )
          else
            TactileButton(
              compact: true,
              isPrimary: canAfford,
              onPressed: canAfford ? onBuy : null,
              child: Text('₺${cost.toInt()}'),
            ),
        ],
      ),
    );
  }
}
