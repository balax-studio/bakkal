import 'package:flutter/material.dart';
import '../theme/station_theme.dart';

class DigitalLedDisplay extends StatelessWidget {
  final double liters;
  final double cost;

  const DigitalLedDisplay({
    super.key,
    required this.liters,
    required this.cost,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: StationTheme.lcdBg,
        borderRadius: BorderRadius.circular(StationTheme.rMd),
        border: Border.all(color: StationTheme.lcdBorder, width: 2.5),
        boxShadow: const [
          BoxShadow(
            color: Color(0x80000000),
            offset: Offset(0, 4),
            blurRadius: 10,
            spreadRadius: -2,
          ),
          BoxShadow(
            color: StationTheme.ink,
            offset: Offset(3.0, 3.0),
            blurRadius: 0,
          ),
        ],
      ),
      child: Row(
        children: [
          // Liter Cell
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'LİTRE',
                  style: StationTheme.font(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF5C7768),
                    letterSpacing: 2.0,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  liters.toStringAsFixed(1),
                  style: StationTheme.lcdFont(
                    fontSize: 32,
                    color: StationTheme.ledGreen,
                  ),
                ),
              ],
            ),
          ),
          // Vertical Separator
          Container(
            width: 2,
            height: 48,
            margin: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF2B3A31), Colors.transparent],
              ),
              borderRadius: BorderRadius.circular(1),
            ),
          ),
          // Tutar Cell
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'TUTAR ₺',
                  style: StationTheme.font(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF7A6845),
                    letterSpacing: 2.0,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  cost.toStringAsFixed(0),
                  style: StationTheme.lcdFont(
                    fontSize: 32,
                    color: StationTheme.ledAmber,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
