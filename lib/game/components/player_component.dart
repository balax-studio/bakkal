import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';

class PlayerComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final List<ProductItem> carriedItems = [];
  Vector2 velocity = Vector2.zero();
  double facingAngle = 0.0;
  double walkCycleTimer = 0.0;
  double wobbleTimer = 0.0;

  final double bodyRadius = 18.0;

  PlayerComponent({required Vector2 position})
      : super(
          position: position,
          size: Vector2(52, 52),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  int get currentCount => carriedItems.length;
  int get maxCapacity => game.playerData.maxCapacity;
  bool get isFull => currentCount >= maxCapacity;

  bool canAddProduct(ProductType type) {
    if (isFull) return false;
    if (carriedItems.isEmpty) return true;
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

      // Solid collision resolution with independent axis wall sliding (physics engine)
      final resolvedPos = game.physicsWorld.resolveMovement(
        currentPos: position,
        velocity: velocity,
        dt: dt,
        radius: bodyRadius,
        worldMinX: 60.0,
        worldMaxX: game.worldWidth - 60.0,
        worldMinY: 160.0,
        worldMaxY: game.worldHeight - 80.0,
      );

      position.setFrom(resolvedPos);
    } else {
      velocity = Vector2.zero();
      walkCycleTimer = 0.0;
    }

    // Dynamic 2.5D Y-sorting priority
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  @override
  void render(Canvas canvas) {
    final isMoving = velocity.length > 0.1;
    final isBoosted = game.adService.is2xBoostActive.value;
    final cx = size.x * 0.5;
    final cy = size.y * 0.5;

    canvas.save();

    // 1. 2.5D Isometric Ground Shadow
    final shadowPaint = NeoTheme.shadowPaint;
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy + 18), width: 36, height: 16),
      shadowPaint,
    );

    // 2. Animated 2.5D Legs
    final legSwing = isMoving ? math.sin(walkCycleTimer) * 5.0 : 0.0;
    final legPaint = NeoTheme.fill(const Color(0xFF1E293B));
    final legStroke = NeoTheme.stroke(width: 2.2);

    // Left Leg
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(cx - 7, cy + 12 + legSwing), width: 9, height: 14),
        const Radius.circular(3),
      ),
      fillPaint: legPaint,
      strokePaint: legStroke,
      shadowOffset: 1.5,
    );

    // Right Leg
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset(cx + 7, cy + 12 - legSwing), width: 9, height: 14),
        const Radius.circular(3),
      ),
      fillPaint: legPaint,
      strokePaint: legStroke,
      shadowOffset: 1.5,
    );

    // 3. Torso / Body (Vibrant Blue/Cyan Outfit)
    final bodyColor = isBoosted ? NeoTheme.boostCyan : const Color(0xFF2563EB);
    final bodyRect = Rect.fromCenter(center: Offset(cx, cy), width: 26, height: 20);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(bodyColor),
      strokePaint: NeoTheme.stroke(width: 2.8),
      shadowOffset: 2.5,
    );

    // White Work Apron Detail
    final apronRect = Rect.fromCenter(center: Offset(cx, cy + 2), width: 14, height: 14);
    canvas.drawRect(apronRect, Paint()..color = Colors.white);
    canvas.drawRect(apronRect, NeoTheme.stroke(width: 1.8));

    // 4. Head & 2.5D Cap
    final headRect = Rect.fromCenter(center: Offset(cx, cy - 14), width: 20, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFD1A4)),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 2.0,
    );

    // Red Shopkeeper Cap with Visor
    final capRect = Rect.fromCenter(center: Offset(cx, cy - 20), width: 24, height: 9);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(capRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 1.5,
    );

    // 5. Stacked 2.5D Product Crates on Back with wobble
    _renderCarriedStack(canvas, isMoving, cx, cy);

    // 6. Capacity Pill Badge Over Head
    _renderCapacityBadge(canvas, cx, cy);

    canvas.restore();
  }

  void _renderCarriedStack(Canvas canvas, bool isMoving, double cx, double cy) {
    if (carriedItems.isEmpty) return;

    final itemType = carriedItems.first.type;
    final stackHeight = carriedItems.length;
    final wobble = isMoving ? math.sin(wobbleTimer) * 0.10 : 0.0;

    for (int i = 0; i < stackHeight; i++) {
      canvas.save();
      final itemY = cy - 24.0 - (i * 11.0);
      final itemX = cx + (i * wobble * 6.0);

      canvas.translate(itemX, itemY);
      canvas.rotate(wobble * (i + 1) * 0.12);

      // 2.5D Isometric Mini Crate
      final crateRect = Rect.fromCenter(
        center: Offset.zero,
        width: 22,
        height: 11,
      );

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

  void _renderCapacityBadge(Canvas canvas, double cx, double cy) {
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

    final badgeY = cy - 36.0 - (carriedItems.length * 11.0);
    final badgeRect = Rect.fromCenter(
      center: Offset(cx, badgeY),
      width: tp.width + 14,
      height: 18,
    );

    final bgBadgeColor = isFullCapacity ? NeoTheme.tomatoRed : Colors.white;
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(badgeRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(bgBadgeColor),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    tp.paint(canvas, Offset(cx - tp.width / 2, badgeY - tp.height / 2));
  }
}
