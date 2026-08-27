import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../mini_mart_game.dart';

class PlayerComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final List<ProductItem> carriedItems = [];
  Vector2 velocity = Vector2.zero();
  double facingAngle = 0.0;
  double walkCycleTimer = 0.0;
  double wobbleTimer = 0.0;

  PlayerComponent({required Vector2 position})
      : super(
          position: position,
          size: Vector2(48, 48),
          anchor: Anchor.center,
          priority: 100,
        );

  int get currentCount => carriedItems.length;
  int get maxCapacity => game.playerData.maxCapacity;
  bool get isFull => currentCount >= maxCapacity;

  bool canAddProduct(ProductType type) {
    if (isFull) return false;
    if (carriedItems.isEmpty) return true;
    // Allow carrying matching products or single-category per trip for clarity
    return carriedItems.first.type == type;
  }

  bool addProduct(ProductType type) {
    if (canAddProduct(type)) {
      carriedItems.add(ProductItem(type: type));
      return true;
    }
    return false;
  }

  ProductItem? takeTopProduct() {
    if (carriedItems.isNotEmpty) {
      return carriedItems.removeLast();
    }
    return null;
  }

  @override
  void update(double dt) {
    super.update(dt);

    final moveDir = game.joystickDirection;
    final isBoosted = game.adService.is2xBoostActive.value;
    final speedMultiplier = isBoosted ? 1.6 : 1.0;
    final speed = game.playerData.moveSpeed * speedMultiplier;

    if (moveDir.length > 0.1) {
      velocity = moveDir.normalized() * speed;
      facingAngle = math.atan2(velocity.y, velocity.x);
      walkCycleTimer += dt * 12.0;
      wobbleTimer += dt * 8.0;

      // Update position with game bounds clamping
      position.add(velocity * dt);
      position.x = position.x.clamp(60.0, game.worldWidth - 60.0);
      position.y = position.y.clamp(60.0, game.worldHeight - 60.0);
    } else {
      velocity = Vector2.zero();
      walkCycleTimer = 0.0;
    }
  }

  @override
  void render(Canvas canvas) {
    final isMoving = velocity.length > 0.1;
    final isBoosted = game.adService.is2xBoostActive.value;

    canvas.save();

    // 1. Draw Ground Shadow (Hard 45-degree offset)
    final shadowPaint = Paint()..color = NeoTheme.shadowBlack;
    canvas.drawOval(
      Rect.fromCenter(center: const Offset(24, 44), width: 38, height: 16),
      shadowPaint,
    );

    // 2. Animated Legs
    final legSwing = isMoving ? math.sin(walkCycleTimer) * 6.0 : 0.0;
    final legPaint = NeoTheme.fill(const Color(0xFF2C3E50));
    final legStroke = NeoTheme.stroke(width: 2.5);

    // Left Leg
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(16, 38 + legSwing), width: 10, height: 16),
        const Radius.circular(3),
      ),
      fillPaint: legPaint,
      strokePaint: legStroke,
      shadowOffset: 2,
    );

    // Right Leg
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(32, 38 - legSwing), width: 10, height: 16),
        const Radius.circular(3),
      ),
      fillPaint: legPaint,
      strokePaint: legStroke,
      shadowOffset: 2,
    );

    // 3. Torso / Body (Neo-Brutalist Vibrant Outfit)
    final bodyColor = isBoosted ? NeoTheme.boostCyan : const Color(0xFF3B82F6);
    final bodyRect = Rect.fromCenter(center: const Offset(24, 26), width: 28, height: 22);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(bodyColor),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 3.0,
    );

    // Apron / Shirt Detail
    final apronRect = Rect.fromCenter(center: const Offset(24, 28), width: 16, height: 16);
    canvas.drawRect(apronRect, Paint()..color = Colors.white);
    canvas.drawRect(apronRect, NeoTheme.stroke(width: 2.0));

    // 4. Head & Stylized Cap
    final headRect = Rect.fromCenter(center: const Offset(24, 12), width: 22, height: 20);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFD1A4)), // Skin tone
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 2.0,
    );

    // Cap / Visor
    final capRect = Rect.fromCenter(center: const Offset(24, 5), width: 26, height: 10);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(capRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 2.0,
    );

    // 5. Stacked Product Crates on Back (with inertia wobble)
    _renderCarriedStack(canvas, isMoving);

    // 6. Capacity Badge Over Head
    _renderCapacityBadge(canvas);

    canvas.restore();
  }

  void _renderCarriedStack(Canvas canvas, bool isMoving) {
    if (carriedItems.isEmpty) return;

    final itemType = carriedItems.first.type;
    final stackHeight = carriedItems.length;

    // Stack wobble angle based on movement inertia
    final wobble = isMoving ? math.sin(wobbleTimer) * 0.12 : 0.0;

    for (int i = 0; i < stackHeight; i++) {
      canvas.save();
      final itemY = -8.0 - (i * 12.0);
      final itemX = 24.0 + (i * wobble * 8.0);

      canvas.translate(itemX, itemY);
      canvas.rotate(wobble * (i + 1) * 0.15);

      final crateRect = Rect.fromCenter(
        center: Offset.zero,
        width: 22,
        height: 12,
      );

      // Draw Low-Poly Crate
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(crateRect, const Radius.circular(3)),
        fillPaint: NeoTheme.fill(itemType.color),
        strokePaint: NeoTheme.stroke(width: 2.0),
        shadowOffset: 2.0,
      );

      canvas.restore();
    }
  }

  void _renderCapacityBadge(Canvas canvas) {
    final isFullCapacity = isFull;
    final text = isFullCapacity
        ? 'DOLU ($currentCount/$maxCapacity)'
        : '$currentCount/$maxCapacity';

    final textSpan = TextSpan(
      text: text,
      style: TextStyle(
        color: isFullCapacity ? Colors.white : NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );

    final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
    tp.layout();

    final badgeY = -18.0 - (carriedItems.length * 12.0);
    final badgeRect = Rect.fromCenter(
      center: Offset(24, badgeY),
      width: tp.width + 14,
      height: 18,
    );

    // Neo-Brutalist Pill
    final bgBadgeColor = isFullCapacity ? NeoTheme.tomatoRed : Colors.white;
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(badgeRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(bgBadgeColor),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    tp.paint(canvas, Offset(24 - tp.width / 2, badgeY - tp.height / 2));
  }
}
