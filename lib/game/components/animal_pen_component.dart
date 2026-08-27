import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import '../physics/collision_system.dart';
import 'effects_component.dart';

class AnimalPenComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final String title;
  final ProductType productType;
  final double produceSeconds;
  final int maxProduce = 6;

  final List<ProductItem> produceBuffer = [];
  double currentTimer = 0.0;
  double interactCooldown = 0.0;
  double animTime = 0.0;
  late final SolidBox solidCollider;

  AnimalPenComponent({
    required this.id,
    required this.title,
    required this.productType,
    required Vector2 position,
    this.produceSeconds = 2.5,
  }) : super(
          position: position,
          size: Vector2(115, 95),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    solidCollider = SolidBox(
      id: id,
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 4),
        width: 88,
        height: 58,
      ),
      label: title,
    );
  }

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    game.physicsWorld.addObstacle(solidCollider);
  }

  @override
  void onRemove() {
    game.physicsWorld.removeObstacle(id);
    super.onRemove();
  }

  @override
  void update(double dt) {
    super.update(dt);
    animTime += dt;

    final isBoosted = game.adService.is2xBoostActive.value;
    final speedMultiplier = isBoosted ? 2.0 : 1.0;

    // Animal Production
    if (produceBuffer.length < maxProduce) {
      currentTimer += dt * speedMultiplier;
      if (currentTimer >= produceSeconds) {
        currentTimer = 0.0;
        produceBuffer.add(ProductItem(type: productType));
        SoundService.playHarvest();
      }
    }

    // Player Collection
    interactCooldown -= dt;
    if (interactCooldown <= 0 && produceBuffer.isNotEmpty) {
      final player = game.player;
      final dist = (player.position - position).length;
      if (dist < 72.0 && player.canAddProduct(productType)) {
        final item = produceBuffer.removeLast();
        player.addProduct(item.type);
        interactCooldown = 0.12;

        SoundService.playHarvest();
        HapticService.light();

        game.world.add(
          FloatingTextComponent(
            text: '+1 ${productType.displayName}',
            position: position - Vector2(0, 35),
            color: productType.color,
          ),
        );
      }
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 96.0;
    const h = 54.0;
    const depth = 16.0;

    // 1. Shadow
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 4)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 4)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Wooden Pen Floor & Fence
    final fenceColor = const Color(0xFFB45309);
    final floorColor = const Color(0xFFFEF3C7);

    // Floor
    final floorPath = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(floorPath, Paint()..color = floorColor);
    canvas.drawPath(floorPath, NeoTheme.stroke(width: 3.0));

    // Extrusion
    final leftSide = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSide, Paint()..color = fenceColor);
    canvas.drawPath(leftSide, NeoTheme.stroke(width: 3.0));

    final rightSide = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSide, Paint()..color = const Color(0xFF92400E));
    canvas.drawPath(rightSide, NeoTheme.stroke(width: 3.0));

    // 3. Render Animated Animals
    if (productType == ProductType.egg) {
      // 2 Chickens bobbing
      _drawChicken(canvas, cx - 18, cy - 4, math.sin(animTime * 4.0) * 3);
      _drawChicken(canvas, cx + 16, cy + 2, math.cos(animTime * 4.0) * 3);
    } else {
      // 1 Cow chewing grass
      _drawCow(canvas, cx, cy - 2, math.sin(animTime * 2.5) * 2);
    }

    // 4. Produce Basket
    for (int i = 0; i < produceBuffer.length; i++) {
      final bx = cx + 22 + (i % 3) * 6;
      final by = cy + 10 - (i ~/ 3) * 6;
      canvas.drawCircle(Offset(bx, by), 4, Paint()..color = productType.color);
      canvas.drawCircle(Offset(bx, by), 4, NeoTheme.stroke(width: 1.0));
    }

    // 5. Title Header Pill
    final badgeText = '$title (${produceBuffer.length}/$maxProduce)';
    final span = TextSpan(
      text: badgeText,
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();

    final pillRect = Rect.fromCenter(center: Offset(cx, cy - h * 0.5 - 10), width: tp.width + 12, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(pillRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    tp.paint(canvas, Offset(cx - tp.width / 2, cy - h * 0.5 - 10 - tp.height / 2));
  }

  void _drawChicken(Canvas canvas, double x, double y, double bob) {
    final bodyRect = Rect.fromCenter(center: Offset(x, y + bob), width: 14, height: 12);
    canvas.drawOval(bodyRect, Paint()..color = Colors.white);
    canvas.drawOval(bodyRect, NeoTheme.stroke(width: 1.5));

    // Comb
    canvas.drawCircle(Offset(x - 2, y - 6 + bob), 3, Paint()..color = NeoTheme.tomatoRed);
    // Beak
    final beak = Path()
      ..moveTo(x + 6, y + bob)
      ..lineTo(x + 10, y + 2 + bob)
      ..lineTo(x + 6, y + 4 + bob)
      ..close();
    canvas.drawPath(beak, Paint()..color = NeoTheme.cornYellow);
  }

  void _drawCow(Canvas canvas, double x, double y, double bob) {
    final bodyRect = Rect.fromCenter(center: Offset(x, y + bob), width: 26, height: 18);
    canvas.drawRRect(RRect.fromRectAndRadius(bodyRect, const Radius.circular(6)), Paint()..color = Colors.white);
    canvas.drawRRect(RRect.fromRectAndRadius(bodyRect, const Radius.circular(6)), NeoTheme.stroke(width: 2.0));

    // Black spots
    canvas.drawCircle(Offset(x - 5, y - 2 + bob), 4, Paint()..color = const Color(0xFF1E293B));
    canvas.drawCircle(Offset(x + 6, y + 2 + bob), 3, Paint()..color = const Color(0xFF1E293B));

    // Snout
    canvas.drawOval(Rect.fromCenter(center: Offset(x + 10, y + 4 + bob), width: 8, height: 6), Paint()..color = const Color(0xFFFDA4AF));
  }
}
