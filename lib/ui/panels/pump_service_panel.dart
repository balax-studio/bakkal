import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/audio/haptic_feedback.dart';
import '../../core/theme/station_theme.dart';
import '../../core/widgets/digital_led_display.dart';
import '../../core/widgets/tactile_button.dart';
import '../../domain/station_state.dart';
import '../../game/components/customer_vehicle_component.dart';

class PumpServicePanel extends StatefulWidget {
  final CustomerVehicleComponent vehicle;
  final StationState stationState;
  final Function({
    required CustomerVehicleComponent vehicle,
    required double filledUnits,
    required double earnedCash,
    bool cleanedWindows,
  }) onComplete;
  final VoidCallback onDismiss;

  const PumpServicePanel({
    super.key,
    required this.vehicle,
    required this.stationState,
    required this.onComplete,
    required this.onDismiss,
  });

  @override
  State<PumpServicePanel> createState() => _PumpServicePanelState();
}

class _PumpServicePanelState extends State<PumpServicePanel> {
  double _selectedTargetLiters = 0.0;
  double _currentLiters = 0.0;
  double _currentCost = 0.0;
  bool _isPumping = false;
  bool _isFinished = false;
  bool _cleanedWindows = false;
  Timer? _pumpTimer;

  @override
  void initState() {
    super.initState();
    // Default to requested full demand
    _selectedTargetLiters = widget.vehicle.order.demandedUnits;
  }

  @override
  void dispose() {
    _pumpTimer?.cancel();
    super.dispose();
  }

  void _setPresetCash(double cash) {
    if (_isPumping || _isFinished) return;
    final price = widget.stationState.prices[widget.vehicle.order.fuelType] ?? 40.0;
    setState(() {
      _selectedTargetLiters = double.parse((cash / price).toStringAsFixed(1));
    });
    StationHaptics.light();
  }

  void _setFullTank() {
    if (_isPumping || _isFinished) return;
    setState(() {
      _selectedTargetLiters = widget.vehicle.order.demandedUnits;
    });
    StationHaptics.light();
  }

  void _startPumping() {
    if (_isPumping || _isFinished) return;

    final available =
        widget.stationState.tanks[widget.vehicle.order.fuelType] ?? 0.0;
    if (available <= 0.5) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Depoda ${widget.vehicle.order.fuelType.displayName} kalmadı! Önce tanker siparişi verin.',
            style: StationTheme.font(color: Colors.white),
          ),
          backgroundColor: StationTheme.red,
        ),
      );
      return;
    }

    setState(() {
      _isPumping = true;
      widget.vehicle.state = VehicleState.refueling;
    });

    final target = _selectedTargetLiters;
    final price = widget.stationState.prices[widget.vehicle.order.fuelType] ?? 40.0;

    _pumpTimer = Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (!mounted) return;

      setState(() {
        _currentLiters += 1.2;
        _currentCost = _currentLiters * price;

        if (_currentLiters >= target) {
          _currentLiters = target;
          _currentCost = _currentLiters * price;
          _isPumping = false;
          _isFinished = true;
          _pumpTimer?.cancel();

          // Deduct from station state and award money
          widget.stationState.performRefuel(
            fuelType: widget.vehicle.order.fuelType,
            requestedUnits: _currentLiters,
            maxBudget: _currentCost * 1.2,
          );

          StationHaptics.success();
        }
      });
    });
  }

  void _finishAndDepart() {
    widget.onComplete(
      vehicle: widget.vehicle,
      filledUnits: _currentLiters,
      earnedCash: _currentCost,
      cleanedWindows: _cleanedWindows,
    );
  }

  @override
  Widget build(BuildContext context) {
    final order = widget.vehicle.order;
    final fuel = order.fuelType;

    return Center(
      child: Material(
        color: Colors.transparent,
        child: Container(
          width: 380,
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(16),
          decoration: StationTheme.neoCard(
            background: StationTheme.paper,
            hasShadow: true,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header: Customer Vehicle & Demand
              Row(
                children: [
                  Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      color: fuel.color,
                      shape: BoxShape.circle,
                      border: Border.all(color: StationTheme.ink, width: 1.5),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${order.vehicleType.name} · ${fuel.displayName}',
                      style: StationTheme.font(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: StationTheme.ink,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded,
                        color: StationTheme.ink, size: 20),
                    onPressed: widget.onDismiss,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Digital LED Dispenser Screen
              DigitalLedDisplay(
                liters: _currentLiters,
                cost: _currentCost,
              ),
              const SizedBox(height: 12),

              // Preset Quick Fill Buttons
              if (!_isFinished) ...[
                Row(
                  children: [
                    Expanded(
                      child: TactileButton(
                        compact: true,
                        onPressed: _isPumping ? null : () => _setPresetCash(50),
                        child: const Text('50 ₺'),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: TactileButton(
                        compact: true,
                        onPressed: _isPumping ? null : () => _setPresetCash(100),
                        child: const Text('100 ₺'),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: TactileButton(
                        compact: true,
                        onPressed: _isPumping ? null : () => _setPresetCash(250),
                        child: const Text('250 ₺'),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: TactileButton(
                        compact: true,
                        isPrimary: true,
                        onPressed: _isPumping ? null : _setFullTank,
                        child: const Text('FULLE'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],

              // Main Action Buttons
              if (!_isFinished) ...[
                TactileButton(
                  isGood: true,
                  onPressed: _isPumping ? null : _startPumping,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.play_arrow_rounded, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        _isPumping ? 'DOLUM YAPILIYOR…' : 'POMPAYI BAŞLAT',
                        style: StationTheme.font(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                TactileButton(
                  isGood: true,
                  onPressed: _finishAndDepart,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        'TAMAMLA & UĞURLA (+₺${_currentCost.toInt()})',
                        style: StationTheme.font(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 8),

              // Auxiliary Service: Camları Temizle (+25₺ Bahşiş)
              if (!_cleanedWindows) ...[
                TactileButton(
                  compact: true,
                  onPressed: () {
                    setState(() => _cleanedWindows = true);
                    StationHaptics.light();
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.cleaning_services_rounded, size: 15),
                      SizedBox(width: 5),
                      Text('Camları Sil (+₺25 Bahşiş) ✨'),
                    ],
                  ),
                ),
                const SizedBox(height: 6),
              ],

              // Dismiss / Cancel Button
              if (!_isPumping && !_isFinished)
                TactileButton(
                  compact: true,
                  onPressed: widget.onDismiss,
                  child: const Text('Müşteriyi Gönder'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
