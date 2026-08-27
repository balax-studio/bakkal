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

  // Elastic Stack Jiggle Physics State
  double stackTiltAngle = 0.0;
  double stackAngularVelocity = 0.0;
  final double springK = 65.0; // Spring stiffness
  final double springDamping = 8.5; // Damping ratio

  final double bodyRadius = 18.0;

  PlayerComponent({required Vector2 position})
      : super(
          position: position,
          size: Vector2(56, 56),
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
      // Impulse jiggle on pickup
      stackAngularVelocity += (math.Random().nextBool() ? 1.0 : -1.0) * 4.0;
      return true;
    }
    return false;
  }

  ProductItem? takeTopProduct() {
    if (carriedItems.isNotEmpty) {
      // Impulse jiggle on drop
      stackAngularVelocity += (math.Random().nextBool() ? 1.0 : -1.0) * 3.0;
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
      final prevVel = velocity.clone();
      velocity = moveDir.normalized() * speed;
      facingAngle = math.atan2(velocity.y, velocity.x);
      walkCycleTimer += dt * 14.0;

      // Inertia target angle based on lateral acceleration
      final accelX = (velocity.x - prevVel.x) / (dt > 0 ? dt : 0.016);
      final targetTilt = (-accelX * 0.0008).clamp(-0.35, 0.35);

      // Spring-damper differential equation
      final springForce = (targetTilt - stackTiltAngle) * springK;
      final dampingForce = -stackAngularVelocity * springDamping;
      stackAngularVelocity += (springForce + dampingForce) * dt;
      stackTiltAngle += stackAngularVelocity * dt;

      // Solid collision resolution with independent axis wall sliding
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

      // Spring back to center when stationary
      final springForce = -stackTiltAngle * springK;
      final dampingForce = -stackAngularVelocity * springDamping;
      stackAngularVelocity += (springForce + dampingForce) * dt;
      stackTiltAngle += stackAngularVelocity * dt;
    }

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
    final shadowWidth = 36.0 + (isMoving ? math.sin(walkCycleTimer * 2) * 2.0 : 0.0);
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy + 18), width: shadowWidth, height: 16),
      NeoTheme.shadowPaint,
    );

    // 2. Animated Legs with Step Swing
    final legSwing = isMoving ? math.sin(walkCycleTimer) * 6.0 : 0.0;
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

    // 3. Squash & Stretch Torso
    final stepSquash = isMoving ? (math.cos(walkCycleTimer * 2) * 0.08) : 0.0;
    final bodyHeight = 20.0 * (1.0 - stepSquash);
    final bodyWidth = 26.0 * (1.0 + stepSquash);

    final bodyColor = isBoosted ? NeoTheme.boostCyan : const Color(0xFF2563EB);
    final bodyRect = Rect.fromCenter(center: Offset(cx, cy + (stepSquash * 2.0)), width: bodyWidth, height: bodyHeight);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(bodyColor),
      strokePaint: NeoTheme.stroke(width: 2.8),
      shadowOffset: 2.5,
    );

    // Work Apron
    final apronRect = Rect.fromCenter(center: Offset(cx, cy + 2), width: 14, height: 13);
    canvas.drawRect(apronRect, Paint()..color = Colors.white);
    canvas.drawRect(apronRect, NeoTheme.stroke(width: 1.8));

    // 4. Head & Shopkeeper Cap
    final headRect = Rect.fromCenter(center: Offset(cx, cy - 14), width: 20, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFD1A4)),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 2.0,
    );

    final capRect = Rect.fromCenter(center: Offset(cx, cy - 20), width: 24, height: 9);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(capRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 1.5,
    );

    // 5. Elastic Jiggle Stacked Crates on Back
    _renderCarriedStack(canvas, cx, cy);

    // 6. Capacity Badge
    _renderCapacityBadge(canvas, cx, cy);

    canvas.restore();
  }

  void _renderCarriedStack(Canvas canvas, double cx, double cy) {
    if (carriedItems.isEmpty) return;

    final itemType = carriedItems.first.type;
    final stackHeight = carriedItems.length;

    for (int i = 0; i < stackHeight; i++) {
      canvas.save();
      // Cumulative spring sway per tier
      final tierFactor = (i + 1) / stackHeight;
      final tierAngle = stackTiltAngle * (0.8 + (i * 0.4));
      final itemY = cy - 24.0 - (i * 12.0);
      final itemX = cx + (tierAngle * 18.0 * tierFactor);

      canvas.translate(itemX, itemY);
      canvas.rotate(tierAngle);

      final crateRect = Rect.fromCenter(
        center: Offset.zero,
        width: 24,
        height: 12,
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

    final badgeY = cy - 38.0 - (carriedItems.length * 12.0);
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
