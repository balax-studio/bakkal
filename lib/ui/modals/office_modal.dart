import 'package:flutter/material.dart';
import '../../core/audio/haptic_feedback.dart';
import '../../core/theme/station_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../domain/fuel_type.dart';
import '../../domain/station_state.dart';

class OfficeModal extends StatelessWidget {
  final StationState stationState;
  final VoidCallback onClose;

  const OfficeModal({
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
                  const Icon(Icons.analytics_rounded,
                      color: StationTheme.green, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'İstasyon Ofisi & Fiyat Tarifesi',
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

              // Statistics Banner
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: StationTheme.paperDark,
                  borderRadius: BorderRadius.circular(StationTheme.rMd),
                  border: Border.all(color: StationTheme.ink, width: 2.0),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCol(
                        'Toplam Ciro', '₺${stationState.totalRevenue.toInt()}'),
                    _buildStatCol('Hizmet Verilen',
                        '${stationState.totalCustomersServed} Araç'),
                    _buildStatCol(
                        'İtibar', '★ ${stationState.reputation.toStringAsFixed(1)}'),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              Text(
                'LİTRE / BİRİM SATIŞ FİYATLARI',
                style: StationTheme.font(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: StationTheme.muted,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 6),

              // Price Adjustment rows
              ...FuelType.values.map((fuel) {
                if (fuel == FuelType.elektrik && !stationState.hasEvCharger) {
                  return const SizedBox.shrink();
                }
                return _buildPriceRow(context, fuel);
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCol(String label, String value) {
    return Column(
      children: [
        Text(
          label,
          style: StationTheme.font(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: StationTheme.muted,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: StationTheme.font(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            color: StationTheme.ink,
          ),
        ),
      ],
    );
  }

  Widget _buildPriceRow(BuildContext context, FuelType fuel) {
    final curPrice = stationState.prices[fuel] ?? fuel.defaultPricePerUnit;
    final wholesaleCost = stationState.costs[fuel] ?? fuel.defaultCostPerUnit;
    final profit = curPrice - wholesaleCost;

    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: StationTheme.paperDark,
        borderRadius: BorderRadius.circular(StationTheme.rSm),
        border: Border.all(color: StationTheme.ink, width: 1.8),
      ),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              color: fuel.color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  fuel.displayName,
                  style: StationTheme.font(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  'Alış: ₺${wholesaleCost.toStringAsFixed(1)} · Kâr: ₺${profit.toStringAsFixed(1)}/${fuel.unit}',
                  style: StationTheme.font(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: profit >= 0
                        ? StationTheme.greenDark
                        : StationTheme.redDark,
                  ),
                ),
              ],
            ),
          ),
          TactileButton(
            compact: true,
            onPressed: () {
              stationState.adjustPrice(fuel, -0.5);
              StationHaptics.light();
            },
            child: const Text('−'),
          ),
          const SizedBox(width: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: StationTheme.paper,
              borderRadius: BorderRadius.circular(StationTheme.rSm),
              border: Border.all(color: StationTheme.ink, width: 1.5),
            ),
            child: Text(
              '₺${curPrice.toStringAsFixed(1)}',
              style: StationTheme.font(
                fontSize: 13,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(width: 6),
          TactileButton(
            compact: true,
            onPressed: () {
              stationState.adjustPrice(fuel, 0.5);
              StationHaptics.light();
            },
            child: const Text('+'),
          ),
        ],
      ),
    );
  }
}
