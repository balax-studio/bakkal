import 'package:flutter/material.dart';
import '../../core/audio/haptic_feedback.dart';
import '../../core/theme/station_theme.dart';
import '../../core/widgets/tactile_button.dart';
import '../../domain/fuel_type.dart';
import '../../domain/station_state.dart';

class FuelOrderModal extends StatefulWidget {
  final StationState stationState;
  final VoidCallback onClose;

  const FuelOrderModal({
    super.key,
    required this.stationState,
    required this.onClose,
  });

  @override
  State<FuelOrderModal> createState() => _FuelOrderModalState();
}

class _FuelOrderModalState extends State<FuelOrderModal> {
  final Map<FuelType, double> _orderAmounts = {
    FuelType.benzin: 1000.0,
    FuelType.dizel: 1500.0,
    FuelType.lpg: 800.0,
    FuelType.elektrik: 50.0,
  };

  void _changeQty(FuelType fuel, double delta) {
    setState(() {
      final current = _orderAmounts[fuel] ?? 500.0;
      final updated = (current + delta).clamp(0.0, 5000.0);
      _orderAmounts[fuel] = updated;
    });
    StationHaptics.light();
  }

  void _order(FuelType fuel) {
    final amount = _orderAmounts[fuel] ?? 1000.0;
    if (amount <= 0) return;

    final success = widget.stationState.orderTanker(fuel, amount);
    if (success) {
      StationHaptics.success();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '${fuel.shortName} Tankeri yola çıktı! (15 sn içinde varacak)',
            style: StationTheme.font(color: Colors.white),
          ),
          backgroundColor: StationTheme.greenDark,
        ),
      );
      widget.onClose();
    } else {
      StationHaptics.heavy();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Kasada yeterli bakiye yok!',
            style: StationTheme.font(color: Colors.white),
          ),
          backgroundColor: StationTheme.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 420,
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
                  const Icon(Icons.local_shipping_rounded,
                      color: StationTheme.orange, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'Yakıt Siparişi (Tanker)',
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
                    onPressed: widget.onClose,
                  ),
                ],
              ),
              const Divider(color: StationTheme.ink, thickness: 2.0),
              const SizedBox(height: 10),

              // Fuel rows
              _buildFuelRow(FuelType.benzin),
              const SizedBox(height: 8),
              _buildFuelRow(FuelType.dizel),
              const SizedBox(height: 8),
              _buildFuelRow(FuelType.lpg),
              if (widget.stationState.hasEvCharger) ...[
                const SizedBox(height: 8),
                _buildFuelRow(FuelType.elektrik),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFuelRow(FuelType fuel) {
    final curTank = widget.stationState.tanks[fuel] ?? 0.0;
    final cap = widget.stationState.tankCapacities[fuel] ?? 5000.0;
    final orderQty = _orderAmounts[fuel] ?? 1000.0;
    final costPerUnit = widget.stationState.costs[fuel] ?? 30.0;
    final totalCost = orderQty * costPerUnit;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: StationTheme.paperDark,
        borderRadius: BorderRadius.circular(StationTheme.rMd),
        border: Border.all(color: StationTheme.ink, width: 2.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: fuel.color,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 6),
              Text(
                fuel.displayName,
                style: StationTheme.font(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w800,
                  color: StationTheme.ink,
                ),
              ),
              const Spacer(),
              Text(
                'Depo: ${curTank.toInt()} / ${cap.toInt()} ${fuel.unit}',
                style: StationTheme.font(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  color: StationTheme.muted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              TactileButton(
                compact: true,
                onPressed: () => _changeQty(fuel, -250),
                child: const Text('−'),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: StationTheme.paper,
                  borderRadius: BorderRadius.circular(StationTheme.rSm),
                  border: Border.all(color: StationTheme.ink, width: 1.8),
                ),
                child: Text(
                  '${orderQty.toInt()} ${fuel.unit}',
                  style: StationTheme.font(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              TactileButton(
                compact: true,
                onPressed: () => _changeQty(fuel, 250),
                child: const Text('+'),
              ),
              const Spacer(),
              TactileButton(
                compact: true,
                isWarn: true,
                onPressed: orderQty > 0 ? () => _order(fuel) : null,
                child: Text('Sipariş: ₺${totalCost.toInt()}'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
