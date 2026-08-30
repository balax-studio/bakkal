import 'dart:math';
import 'package:flutter/material.dart';
import '../../core/audio/haptic_feedback.dart';
import '../../core/theme/station_theme.dart';

class RadialFabMenu extends StatefulWidget {
  final VoidCallback onOpenBuild;
  final VoidCallback onOpenOrder;
  final VoidCallback onOpenOffice;

  const RadialFabMenu({
    super.key,
    required this.onOpenBuild,
    required this.onOpenOrder,
    required this.onOpenOffice,
  });

  @override
  State<RadialFabMenu> createState() => _RadialFabMenuState();
}

class _RadialFabMenuState extends State<RadialFabMenu>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isOpen = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 260),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() {
      _isOpen = !_isOpen;
      if (_isOpen) {
        _controller.forward();
        StationHaptics.medium();
      } else {
        _controller.reverse();
        StationHaptics.light();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Arc Item 1: İnşaat & Tesisler (Top: 0 deg / Upwards)
        _buildSubButton(
          angle: -pi / 2, // 90 deg up
          distance: 140.0,
          icon: Icons.store_mall_directory_rounded,
          label: 'İnşaat',
          color: StationTheme.red,
          onTap: () {
            _toggle();
            widget.onOpenBuild();
          },
        ),

        // Arc Item 2: Yakıt Siparişi (Up-Right: 45 deg)
        _buildSubButton(
          angle: -pi / 4, // 45 deg up-right
          distance: 135.0,
          icon: Icons.local_shipping_rounded,
          label: 'Sipariş',
          color: StationTheme.orange,
          onTap: () {
            _toggle();
            widget.onOpenOrder();
          },
        ),

        // Arc Item 3: Ofis & Muhasebe (Right: 0 deg)
        _buildSubButton(
          angle: 0, // 0 deg right
          distance: 140.0,
          icon: Icons.analytics_rounded,
          label: 'Ofis',
          color: StationTheme.green,
          onTap: () {
            _toggle();
            widget.onOpenOffice();
          },
        ),

        // Main Pump FAB Trigger
        GestureDetector(
          onTap: _toggle,
          child: Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: StationTheme.red,
              shape: BoxShape.circle,
              border: Border.all(color: StationTheme.ink, width: 2.5),
              boxShadow: StationTheme.neoShadow,
            ),
            child: Center(
              child: AnimatedRotation(
                turns: _isOpen ? 0.25 : 0.0,
                duration: const Duration(milliseconds: 200),
                child: Icon(
                  _isOpen ? Icons.close_rounded : Icons.local_gas_station_rounded,
                  color: Colors.white,
                  size: 28,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSubButton({
    required double angle,
    required double distance,
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final progress = CurvedAnimation(
          parent: _controller,
          curve: Curves.easeOutBack,
        ).value;

        final double currentDist = distance * progress;
        final double x = cos(angle) * currentDist;
        final double y = sin(angle) * currentDist;

        return Positioned(
          left: 4 + x,
          top: 4 + y,
          child: Transform.scale(
            scale: progress,
            child: Opacity(
              opacity: progress.clamp(0.0, 1.0),
              child: GestureDetector(
                onTap: progress > 0.8 ? onTap : null,
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: StationTheme.paper,
                    shape: BoxShape.circle,
                    border: Border.all(color: StationTheme.ink, width: 2.2),
                    boxShadow: StationTheme.neoShadowSmall,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(icon, color: color, size: 20),
                      Text(
                        label,
                        style: StationTheme.font(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w800,
                          color: StationTheme.ink,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
