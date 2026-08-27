import 'package:flame/extensions.dart';
import 'package:flutter/material.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';

class VirtualJoystickWidget extends StatefulWidget {
  final Function(Vector2) onDirectionChanged;

  const VirtualJoystickWidget({super.key, required this.onDirectionChanged});

  @override
  State<VirtualJoystickWidget> createState() => _VirtualJoystickWidgetState();
}

class _VirtualJoystickWidgetState extends State<VirtualJoystickWidget> {
  Offset _knobOffset = Offset.zero;
  final double _radius = 65.0;
  final double _knobRadius = 26.0;
  bool _isActive = false;

  void _onPanStart(DragStartDetails details) {
    setState(() => _isActive = true);
    HapticService.selection();
  }

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      _knobOffset += details.delta;
      final distance = _knobOffset.distance;
      if (distance > _radius) {
        _knobOffset = Offset.fromDirection(_knobOffset.direction, _radius);
      }
    });

    final normalized = Vector2(
      _knobOffset.dx / _radius,
      _knobOffset.dy / _radius,
    );
    widget.onDirectionChanged(normalized);
  }

  void _onPanEnd(DragEndDetails details) {
    setState(() {
      _knobOffset = Offset.zero;
      _isActive = false;
    });
    widget.onDirectionChanged(Vector2.zero());
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onPanStart: _onPanStart,
      onPanUpdate: _onPanUpdate,
      onPanEnd: _onPanEnd,
      onPanCancel: () => _onPanEnd(DragEndDetails()),
      child: Container(
        width: _radius * 2 + 20,
        height: _radius * 2 + 20,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.85),
          shape: BoxShape.circle,
          border: Border.all(color: NeoTheme.inkBlack, width: 3.0),
          boxShadow: NeoTheme.neoBoxShadow(offset: 3.0),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Center Dot
            Container(
              width: 8,
              height: 8,
              decoration: const BoxDecoration(
                color: NeoTheme.inkBlack,
                shape: BoxShape.circle,
              ),
            ),
            // Movable Knob
            Transform.translate(
              offset: _knobOffset,
              child: Container(
                width: _knobRadius * 2,
                height: _knobRadius * 2,
                decoration: BoxDecoration(
                  color: _isActive ? NeoTheme.boostCyan : NeoTheme.tomatoRed,
                  shape: BoxShape.circle,
                  border: Border.all(color: NeoTheme.inkBlack, width: 3.0),
                  boxShadow: NeoTheme.neoBoxShadow(offset: 2.0),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
