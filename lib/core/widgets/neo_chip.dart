import 'package:flutter/material.dart';
import '../theme/station_theme.dart';

class NeoChip extends StatelessWidget {
  final String? label;
  final Widget? icon;
  final Widget value;
  final Color backgroundColor;
  final Color borderColor;
  final double minWidth;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  const NeoChip({
    super.key,
    this.label,
    this.icon,
    required this.value,
    this.backgroundColor = StationTheme.paper,
    this.borderColor = StationTheme.ink,
    this.minWidth = 60,
    this.padding = const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      constraints: BoxConstraints(minWidth: minWidth),
      padding: padding,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(StationTheme.rMd),
        border: Border.all(color: borderColor, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: StationTheme.ink,
            offset: Offset(2.0, 2.0),
            blurRadius: 0,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (label != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 2),
              child: Text(
                label!,
                style: StationTheme.font(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w800,
                  color: StationTheme.muted,
                  letterSpacing: 0.6,
                ),
              ),
            ),
          Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (icon != null) ...[
                icon!,
                const SizedBox(width: 5),
              ],
              DefaultTextStyle(
                style: StationTheme.font(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: StationTheme.ink,
                ),
                child: value,
              ),
            ],
          ),
        ],
      ),
    );

    if (onTap != null) {
      return GestureDetector(
        onTap: onTap,
        child: card,
      );
    }
    return card;
  }
}

class NeoProgressBar extends StatelessWidget {
  final double progress; // 0.0 to 1.0
  final Color fillColor;
  final double width;
  final double height;

  const NeoProgressBar({
    super.key,
    required this.progress,
    required this.fillColor,
    this.width = 54,
    this.height = 8,
  });

  @override
  Widget build(BuildContext context) {
    final clamped = progress.clamp(0.0, 1.0);
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: const Color(0x2822303C),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: StationTheme.ink, width: 1.2),
      ),
      child: Align(
        alignment: Alignment.centerLeft,
        child: FractionallySizedBox(
          widthFactor: clamped,
          child: Container(
            decoration: BoxDecoration(
              color: fillColor,
              borderRadius: BorderRadius.circular(3),
            ),
          ),
        ),
      ),
    );
  }
}
