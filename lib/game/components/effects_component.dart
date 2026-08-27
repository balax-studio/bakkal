import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';

/// Floating text effect (e.g. "+$10", "DOLU!", "KİLİT AÇILDI!")
class FloatingTextComponent extends PositionComponent {
  final String text;
  final Color color;
  final Color borderColor;
  double lifeTime = 0.0;
  final double maxLife = 1.0;

  FloatingTextComponent({
    required this.text,
    required Vector2 position,
    this.color = NeoTheme.cashGreen,
    this.borderColor = NeoTheme.inkBlack,
  }) : super(position: position, size: Vector2(100, 30), priority: 200);

  @override
  void update(double dt) {
    super.update(dt);
    lifeTime += dt;
    position.y -= 40 * dt; // Float upward
    if (lifeTime >= maxLife) {
      removeFromParent();
    }
  }

  @override
  void render(Canvas canvas) {
    final progress = lifeTime / maxLife;
    final opacity = (1.0 - progress).clamp(0.0, 1.0);

    final textSpan = TextSpan(
      text: text,
      style: TextStyle(
        color: color.withValues(alpha: opacity),
        fontSize: 16,
        fontWeight: FontWeight.w900,
        fontFamily: 'Roboto',
        shadows: [
          Shadow(
            color: borderColor.withValues(alpha: opacity),
            offset: const Offset(2, 2),
            blurRadius: 0,
          ),
        ],
      ),
    );

    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(-textPainter.width / 2, -textPainter.height / 2));
  }
}

/// Curved flying item from a source point to target point
class FlyingItemComponent extends PositionComponent {
  final ProductType type;
  final Vector2 startPos;
  final PositionComponent target;
  final VoidCallback onArrive;

  double progress = 0.0;
  final double duration = 0.35; // Fast and snappy
  late final double arcHeight;

  FlyingItemComponent({
    required this.type,
    required this.startPos,
    required this.target,
    required this.onArrive,
  }) : super(position: startPos.clone(), size: Vector2(22, 22), priority: 150) {
    arcHeight = 40.0 + (math.Random().nextDouble() * 20.0);
  }

  @override
  void update(double dt) {
    super.update(dt);
    progress += dt / duration;

    if (progress >= 1.0) {
      onArrive();
      removeFromParent();
      return;
    }

    // Quadratic Bezier interpolation with arc
    final p0 = startPos;
    final p2 = target.position;
    final p1 = Vector2(
      (p0.x + p2.x) / 2,
      math.min(p0.y, p2.y) - arcHeight,
    );

    final t = progress;
    final u = 1 - t;
    position.x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
    position.y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
  }

  @override
  void render(Canvas canvas) {
    final rect = Rect.fromCenter(
      center: const Offset(11, 11),
      width: 18,
      height: 18,
    );

    // Draw Neo-Brutalist product cube
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(rect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(type.color),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
  }
}

class ParticleItem {
  Vector2 position = Vector2.zero();
  final Vector2 velocity;
  final double size;
  final Color color;

  ParticleItem({
    required this.velocity,
    required this.size,
    required this.color,
  });
}

/// Particle explosion when unlocking or completing milestones
class ParticleBurstComponent extends PositionComponent {
  final List<ParticleItem> particles = [];
  double lifeTime = 0.0;
  final double maxLife = 0.8;

  ParticleBurstComponent({
    required Vector2 position,
    int count = 24,
    List<Color>? colors,
  }) : super(position: position, priority: 180) {
    final rand = math.Random();
    final palette = colors ??
        [
          NeoTheme.cashGreen,
          NeoTheme.cornYellow,
          NeoTheme.tomatoRed,
          NeoTheme.boostCyan,
          NeoTheme.purpleAccent,
        ];

    for (int i = 0; i < count; i++) {
      final angle = rand.nextDouble() * 2 * math.pi;
      final speed = 80.0 + rand.nextDouble() * 160.0;
      final size = 4.0 + rand.nextDouble() * 6.0;
      final color = palette[rand.nextInt(palette.length)];
      particles.add(ParticleItem(
        velocity: Vector2(math.cos(angle) * speed, math.sin(angle) * speed),
        size: size,
        color: color,
      ));
    }
  }

  @override
  void update(double dt) {
    super.update(dt);
    lifeTime += dt;
    for (final p in particles) {
      p.position.add(p.velocity * dt);
      p.velocity.y += 180 * dt; // Gravity
    }
    if (lifeTime >= maxLife) {
      removeFromParent();
    }
  }

  @override
  void render(Canvas canvas) {
    final progress = lifeTime / maxLife;
    final alpha = (1.0 - progress).clamp(0.0, 1.0);

    for (final p in particles) {
      final paint = Paint()..color = p.color.withValues(alpha: alpha);
      final borderPaint = Paint()
        ..color = NeoTheme.inkBlack.withValues(alpha: alpha)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;

      final rect = Rect.fromCenter(
        center: Offset(p.position.x, p.position.y),
        width: p.size,
        height: p.size,
      );

      canvas.drawRect(rect, paint);
      canvas.drawRect(rect, borderPaint);
    }
  }
}
