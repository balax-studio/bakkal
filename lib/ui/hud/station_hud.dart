import 'package:flutter/material.dart';
import '../../core/theme/station_theme.dart';
import '../../core/widgets/neo_chip.dart';
import '../../domain/fuel_type.dart';
import '../../domain/station_state.dart';
import 'radial_fab_menu.dart';

class StationHud extends StatelessWidget {
  final StationState stationState;
  final VoidCallback onOpenBuild;
  final VoidCallback onOpenOrder;
  final VoidCallback onOpenOffice;

  const StationHud({
    super.key,
    required this.stationState,
    required this.onOpenBuild,
    required this.onOpenOrder,
    required this.onOpenOffice,
  });

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: stationState,
      builder: (context, _) {
        return SafeArea(
          child: Stack(
            children: [
              // 1. TOP HUD STATUS BARS
              Positioned(
                top: 8,
                left: 10,
                right: 10,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Row 1: Day, Clock, Cash (₺), Reputation
                    Row(
                      children: [
                        // Day & Clock Chip
                        NeoChip(
                          icon: const Icon(Icons.calendar_today_rounded,
                              size: 14, color: StationTheme.ink),
                          value: Text(
                            'GÜN ${stationState.day} · ${stationState.timeString}',
                            style: StationTheme.font(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),

                        // Cash Chip
                        Expanded(
                          child: NeoChip(
                            icon: const Icon(Icons.monetization_on_rounded,
                                size: 16, color: StationTheme.amberDark),
                            value: Text(
                              '₺${stationState.money.toStringAsFixed(0)}',
                              style: StationTheme.font(
                                fontSize: 14.5,
                                fontWeight: FontWeight.w900,
                                color: StationTheme.ink,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),

                        // Reputation Chip
                        NeoChip(
                          icon: const Icon(Icons.star_rounded,
                              size: 16, color: StationTheme.amber),
                          value: Text(
                            stationState.reputation.toStringAsFixed(1),
                            style: StationTheme.font(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Row 2: Fuel Capacity Level Chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          _buildFuelChip(FuelType.benzin),
                          const SizedBox(width: 5),
                          _buildFuelChip(FuelType.dizel),
                          const SizedBox(width: 5),
                          _buildFuelChip(FuelType.lpg),
                          if (stationState.hasEvCharger) ...[
                            const SizedBox(width: 5),
                            _buildFuelChip(FuelType.elektrik),
                          ],
                        ],
                      ),
                    ),

                    // Row 3: Active Tanker Alerts (if in-flight)
                    if (stationState.activeShipments.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      _buildIncomingTankerBanner(),
                    ],
                  ],
                ),
              ),

              // 2. BOTTOM-LEFT RADIAL FAB MENU
              Positioned(
                bottom: 20,
                left: 18,
                child: RadialFabMenu(
                  onOpenBuild: onOpenBuild,
                  onOpenOrder: onOpenOrder,
                  onOpenOffice: onOpenOffice,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFuelChip(FuelType fuel) {
    final cur = stationState.tanks[fuel] ?? 0.0;
    final cap = stationState.tankCapacities[fuel] ?? 5000.0;
    final ratio = (cur / cap).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: StationTheme.paper,
        borderRadius: BorderRadius.circular(StationTheme.rSm),
        border: Border.all(color: StationTheme.ink, width: 1.8),
        boxShadow: StationTheme.neoShadowSmall,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: fuel.color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            fuel.shortName,
            style: StationTheme.font(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: StationTheme.muted,
            ),
          ),
          const SizedBox(width: 6),
          NeoProgressBar(
            progress: ratio,
            fillColor: fuel.color,
            width: 42,
            height: 6,
          ),
          const SizedBox(width: 5),
          Text(
            '${cur.toInt()}',
            style: StationTheme.font(
              fontSize: 10.5,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIncomingTankerBanner() {
    final shipment = stationState.activeShipments.first;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: StationTheme.paperDark,
        borderRadius: BorderRadius.circular(StationTheme.rSm),
        border: Border.all(color: StationTheme.orange, width: 1.8),
        boxShadow: StationTheme.neoShadowSmall,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.local_shipping_rounded,
              color: StationTheme.orange, size: 15),
          const SizedBox(width: 5),
          Text(
            '${shipment.fuelType.shortName} Tankeri Yolda (${shipment.remainingSeconds.toInt()}s)',
            style: StationTheme.font(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: StationTheme.ink,
            ),
          ),
        ],
      ),
    );
  }
}
