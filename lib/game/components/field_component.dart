import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class ProduceFieldComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final ProductType productType;
  final int slotCount;
  late final List<double> cropTimers;
  late final List<bool> isRipe;

  double harvestCooldown = 0.0;

  ProduceFieldComponent({
    required this.id,
    required this.productType,
    required Vector2 position,
    this.slotCount = 4,
  }) : super(
          position: position,
          size: Vector2(110, 110),
          anchor: Anchor.center,
          priority: 40,
        ) {
    cropTimers = List.generate(slotCount, (i) => i * 0.5); // Stagger initial growth
    isRipe = List.filled(slotCount, false);
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

    // 2. Check Player Proximity for Harvest
    harvestCooldown -= dt;
    if (harvestCooldown <= 0) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 70.0 && player.canAddProduct(productType)) {
        for (int i = 0; i < slotCount; i++) {
          if (isRipe[i] && player.canAddProduct(productType)) {
            // Harvest crop!
            isRipe[i] = false;
            cropTimers[i] = 0.0;
            harvestCooldown = 0.15; // Snappy harvest rate

            // Launch flying item to player
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
      position.x - 24 + col * 48,
      position.y - 24 + row * 48,
    );
  }

  @override
  void render(Canvas canvas) {
    // 1. Raised Garden Plot Base (Neo-Brutalist Wood & Soil)
    final plotRect = Rect.fromCenter(center: const Offset(55, 55), width: 105, height: 105);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(plotRect, const Radius.circular(8)),
      fillPaint: NeoTheme.fill(NeoTheme.woodShelf),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 4.0,
    );

    // Dark Soil Interior
    final soilRect = Rect.fromCenter(center: const Offset(55, 55), width: 90, height: 90);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(soilRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(NeoTheme.soilBrown),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 0,
    );

    // 2. Render Crop Slots
    for (int i = 0; i < slotCount; i++) {
      final row = i ~/ 2;
      final col = i % 2;
      final cx = 33.0 + col * 44.0;
      final cy = 33.0 + row * 44.0;

      final progress = (cropTimers[i] / productType.growthSeconds).clamp(0.0, 1.0);
      final ripe = isRipe[i];

      // Draw Soil Mound
      canvas.drawOval(
        Rect.fromCenter(center: Offset(cx, cy + 6), width: 26, height: 12),
        Paint()..color = const Color(0xFF4E342E),
      );

      if (progress < 0.3) {
        // Tiny Sprout
        final stemPaint = NeoTheme.stroke(width: 2.0, color: NeoTheme.cashGreen);
        canvas.drawLine(Offset(cx, cy + 6), Offset(cx, cy), stemPaint);
      } else if (!ripe) {
        // Growing Plant
        final growthScale = (progress - 0.3) / 0.7;
        final stemPaint = NeoTheme.stroke(width: 2.5, color: NeoTheme.cashGreen);
        canvas.drawLine(Offset(cx, cy + 6), Offset(cx, cy - 4 * growthScale), stemPaint);

        // Small unripe bulb
        final bulbRect = Rect.fromCenter(
          center: Offset(cx, cy - 6 * growthScale),
          width: 12 * growthScale,
          height: 12 * growthScale,
        );
        canvas.drawOval(bulbRect, Paint()..color = productType.color.withValues(alpha: 0.6));
        canvas.drawOval(bulbRect, NeoTheme.stroke(width: 1.5));
      } else {
        // Ripe and ready with bounce glow
        final fruitRect = Rect.fromCenter(center: Offset(cx, cy - 6), width: 22, height: 22);
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(fruitRect, const Radius.circular(5)),
          fillPaint: NeoTheme.fill(productType.color),
          strokePaint: NeoTheme.stroke(width: 2.5),
          shadowOffset: 2.0,
        );

        // Leaf icon on top
        final leafPaint = Paint()..color = NeoTheme.cashGreen;
        canvas.drawCircle(Offset(cx, cy - 14), 4, leafPaint);
        canvas.drawCircle(Offset(cx, cy - 14), 4, NeoTheme.stroke(width: 1.5));
      }
    }

    // 3. Name Tag
    final titleSpan = TextSpan(
      text: '${productType.emoji} ${productType.displayName}',
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 10,
        fontWeight: FontWeight.w900,
      ),
    );
    final tp = TextPainter(text: titleSpan, textDirection: TextDirection.ltr);
    tp.layout();
    tp.paint(canvas, Offset(55 - tp.width / 2, 92));
  }
}
