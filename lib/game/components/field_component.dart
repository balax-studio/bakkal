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

class ProduceFieldComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final ProductType productType;
  final int slotCount;
  late final List<double> cropTimers;
  late final List<bool> isRipe;

  double harvestCooldown = 0.0;
  late final SolidBox solidCollider;

  ProduceFieldComponent({
    required this.id,
    required this.productType,
    required Vector2 position,
    this.slotCount = 4,
  }) : super(
          position: position,
          size: Vector2(120, 110),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
    cropTimers = List.generate(slotCount, (i) => i * 0.5);
    isRipe = List.filled(slotCount, false);

    // Solid obstacle bounds for physics engine (blocks character walking through)
    solidCollider = SolidBox(
      id: id,
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 4),
        width: 90,
        height: 64,
      ),
      label: '${productType.displayName} Field',
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

    final isBoosted = game.adService.is2xBoostActive.value;
    final growthMultiplier = isBoosted ? 2.0 : 1.0;

    // 1. Grow Crops
    for (int i = 0; i < slotCount; i++) {
      if (!isRipe[i]) {
        cropTimers[i] += dt * growthMultiplier;
        if (cropTimers[i] >= productType.growthSeconds) {
          isRipe[i] = true;
          cropTimers[i] = productType.growthSeconds;
        }
      }
    }

    // 2. Check Player Proximity for Harvest (Player stands just near the planter boundary)
    harvestCooldown -= dt;
    if (harvestCooldown <= 0) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 80.0 && player.canAddProduct(productType)) {
        for (int i = 0; i < slotCount; i++) {
          if (isRipe[i] && player.canAddProduct(productType)) {
            isRipe[i] = false;
            cropTimers[i] = 0.0;
            harvestCooldown = 0.14;

            final slotPos = _getSlotPosition(i);
            game.world.add(
              FlyingItemComponent(
                type: productType,
                startPos: slotPos,
                target: player,
                onArrive: () {
                  final added = player.addProduct(productType);
                  if (added) {
                    SoundService.playHarvest();
                    HapticService.light();
                  }
                },
              ),
            );
            break;
          }
        }
      }
    }
  }

  Vector2 _getSlotPosition(int index) {
    final row = index ~/ 2;
    final col = index % 2;
    return Vector2(
      position.x - 22 + col * 44,
      position.y - 12 + row * 26,
    );
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 100.0;
    const h = 56.0;
    const depth = 16.0; // 2.5D extrusion depth

    // 1. Drop Shadow underneath 2.5D Planter Bed
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 4)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 4)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Front-Left Wood Planks Extrusion
    final leftSidePath = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSidePath, Paint()..color = const Color(0xFFC07030));
    canvas.drawPath(leftSidePath, NeoTheme.stroke(width: 3.0));

    // 3. Front-Right Wood Planks Extrusion (Slightly darker for 2.5D lighting)
    final rightSidePath = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSidePath, Paint()..color = const Color(0xFFA55A20));
    canvas.drawPath(rightSidePath, NeoTheme.stroke(width: 3.0));

    // 4. Top Diamond Surface (Dark Fertile Soil)
    final topSoilPath = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topSoilPath, Paint()..color = const Color(0xFF4A3528));
    canvas.drawPath(topSoilPath, NeoTheme.stroke(width: 3.0));

    // Wood Rim Inner Border
    final innerSoilPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 6)
      ..lineTo(cx + w * 0.5 - 10, cy)
      ..lineTo(cx, cy + h * 0.5 - 6)
      ..lineTo(cx - w * 0.5 + 10, cy)
      ..close();
    canvas.drawPath(innerSoilPath, Paint()..color = const Color(0xFF382518));

    // 5. Render 2.5D Crop Slots
    final slotOffsets = [
      Offset(cx - 22, cy - 10), // Top Left
      Offset(cx + 22, cy - 10), // Top Right
      Offset(cx - 18, cy + 12), // Bottom Left
      Offset(cx + 18, cy + 12), // Bottom Right
    ];

    for (int i = 0; i < slotCount; i++) {
      final slotCenter = slotOffsets[i];
      final progress = (cropTimers[i] / productType.growthSeconds).clamp(0.0, 1.0);
      final ripe = isRipe[i];

      // Isometric Soil Mound
      canvas.drawOval(
        Rect.fromCenter(center: Offset(slotCenter.dx, slotCenter.dy + 3), width: 18, height: 9),
        Paint()..color = const Color(0xFF2B1B10),
      );

      if (progress < 0.3) {
        // Sprout
        final stemPaint = NeoTheme.stroke(width: 2.0, color: NeoTheme.cashGreen);
        canvas.drawLine(slotCenter, Offset(slotCenter.dx, slotCenter.dy - 6), stemPaint);
      } else if (!ripe) {
        // Growing Plant
        final growth = (progress - 0.3) / 0.7;
        final stemPaint = NeoTheme.stroke(width: 2.5, color: NeoTheme.cashGreen);
        canvas.drawLine(slotCenter, Offset(slotCenter.dx, slotCenter.dy - 8 * growth), stemPaint);

        final bulbRect = Rect.fromCenter(
          center: Offset(slotCenter.dx, slotCenter.dy - 12 * growth),
          width: 12 * growth,
          height: 12 * growth,
        );
        canvas.drawOval(bulbRect, Paint()..color = productType.color.withValues(alpha: 0.6));
        canvas.drawOval(bulbRect, NeoTheme.stroke(width: 1.5));
      } else {
        // Ripe 2.5D Crop with bounce
        final fruitCenter = Offset(slotCenter.dx, slotCenter.dy - 14);
        final fruitRect = Rect.fromCenter(center: fruitCenter, width: 20, height: 20);

        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(fruitRect, const Radius.circular(5)),
          fillPaint: NeoTheme.fill(productType.color),
          strokePaint: NeoTheme.stroke(width: 2.5),
          shadowOffset: 2.0,
        );

        // Leaf
        canvas.drawCircle(Offset(fruitCenter.dx, fruitCenter.dy - 12), 4, Paint()..color = NeoTheme.cashGreen);
        canvas.drawCircle(Offset(fruitCenter.dx, fruitCenter.dy - 12), 4, NeoTheme.stroke(width: 1.5));
      }
    }

    // 6. 2.5D Badge Name Tag
    final titleSpan = TextSpan(
      text: productType.displayName.toUpperCase(),
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: titleSpan, textDirection: TextDirection.ltr);
    tp.layout();
    tp.paint(canvas, Offset(cx - tp.width / 2, cy + depth + 6));
  }
}
