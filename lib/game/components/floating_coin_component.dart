import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/station_theme.dart';

class FloatingCoinComponent extends PositionComponent {
  final String text;
  final Color color;
  double _lifeTime = 0.0;
  final double maxLife = 1.2;

  FloatingCoinComponent({
    required Vector2 position,
    required this.text,
    this.color = StationTheme.amber,
  }) : super(position: position, size: Vector2(80, 30));

  @override
  void update(double dt) {
    super.update(dt);
    _lifeTime += dt;
    // Float upwards
    position.y -= 35 * dt;

    if (_lifeTime >= maxLife) {
      removeFromParent();
    }
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);
    final opacity = (1.0 - (_lifeTime / maxLife)).clamp(0.0, 1.0);

    final textSpan = TextSpan(
      text: text,
      style: TextStyle(
        fontFamily: 'Courier',
        fontSize: 16,
        fontWeight: FontWeight.w900,
        color: color.withValues(alpha: opacity),
        shadows: [
          Shadow(
            color: Colors.black.withValues(alpha: opacity * 0.8),
            offset: const Offset(1.5, 1.5),
            blurRadius: 0,
          ),
        ],
      ),
    );

    final tp = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    )..layout();

    tp.paint(canvas, Offset.zero);
  }
}
