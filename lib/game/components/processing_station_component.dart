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

class ProcessingStationComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final String title;
  final ProductType inputType;
  final ProductType outputType;
  final double processSeconds;
  final Color machineColor;

  final List<ProductItem> inputBuffer = [];
  final List<ProductItem> outputBuffer = [];
  final int maxCapacity = 6;

  double currentProgress = 0.0;
  double interactCooldown = 0.0;
  double animTime = 0.0;
  late final SolidBox solidCollider;

  ProcessingStationComponent({
    required this.id,
    required this.title,
    required this.inputType,
    required this.outputType,
    required Vector2 position,
    this.processSeconds = 2.0,
    required this.machineColor,
  }) : super(
          position: position,
          size: Vector2(110, 85),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    solidCollider = SolidBox(
      id: id,
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 2),
        width: 84,
        height: 54,
      ),
      label: title,
    );
  }

  bool get canAcceptInput => inputBuffer.length < maxCapacity;
  bool get hasOutput => outputBuffer.isNotEmpty;

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

    // 1. Process Crafting
    if (inputBuffer.isNotEmpty && outputBuffer.length < maxCapacity) {
      currentProgress += dt * speedMultiplier;
      if (currentProgress >= processSeconds) {
        currentProgress = 0.0;
        inputBuffer.removeLast();
        outputBuffer.add(ProductItem(type: outputType));

        SoundService.playStockShelf();
        HapticService.light();

        game.world.add(
          FloatingTextComponent(
            text: '+1 ${outputType.displayName}',
            position: position - Vector2(0, 35),
            color: outputType.color,
          ),
        );
      }
    } else {
      currentProgress = 0.0;
    }

    // 2. Player Proximity Interaction (Unload input from player & Collect output to player)
    interactCooldown -= dt;
    if (interactCooldown <= 0) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 72.0) {
        // Collect finished output to player
        if (hasOutput && player.canAddProduct(outputType)) {
          outputBuffer.removeLast();
          player.addProduct(outputType);
          interactCooldown = 0.12;
          SoundService.playHarvest();
          HapticService.light();
          return;
        }

        // Drop raw input from player to station
        if (canAcceptInput && player.carriedItems.isNotEmpty && player.carriedItems.last.type == inputType) {
          final item = player.takeTopProduct();
          if (item != null) {
            inputBuffer.add(item);
            interactCooldown = 0.12;
            SoundService.playStockShelf();
            HapticService.light();
          }
        }
      }
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 92.0;
    const h = 48.0;
    const depth = 22.0;

    // 1. Drop Shadow
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 4)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 4)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Machine Left Panel
    final leftSide = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSide, Paint()..color = machineColor.withValues(alpha: 0.85));
    canvas.drawPath(leftSide, NeoTheme.stroke(width: 2.8));

    // 3. Machine Right Panel
    final rightSide = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSide, Paint()..color = machineColor.withValues(alpha: 0.7));
    canvas.drawPath(rightSide, NeoTheme.stroke(width: 2.8));

    // 4. Top Isometric Working Surface
    final topSurface = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topSurface, Paint()..color = machineColor);
    canvas.drawPath(topSurface, NeoTheme.stroke(width: 2.8));

    // 5. Specialized 2.5D Animated Machine Apparatus per Product Type
    _drawApparatus(canvas, cx, cy);

    // 6. Input Hopper (Left) & Output Tray (Right)
    final inputHopperRect = Rect.fromCenter(center: Offset(cx - 24, cy + 2), width: 22, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(inputHopperRect, const Radius.circular(3)),
      fillPaint: NeoTheme.fill(inputType.color.withValues(alpha: 0.85)),
      strokePaint: NeoTheme.stroke(width: 1.5),
      shadowOffset: 1.5,
    );

    final outputTrayRect = Rect.fromCenter(center: Offset(cx + 24, cy + 2), width: 22, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(outputTrayRect, const Radius.circular(3)),
      fillPaint: NeoTheme.fill(outputType.color),
      strokePaint: NeoTheme.stroke(width: 1.5),
      shadowOffset: 1.5,
    );

    // 7. Animated Crafting Progress Bar
    final progressFraction = (currentProgress / processSeconds).clamp(0.0, 1.0);
    if (inputBuffer.isNotEmpty) {
      final barRect = Rect.fromCenter(center: Offset(cx, cy + depth + 4), width: 50, height: 8);
      canvas.drawRect(barRect, Paint()..color = const Color(0xFF1E293B));
      canvas.drawRect(
        Rect.fromLTWH(cx - 25, cy + depth, 50 * progressFraction, 8),
        Paint()..color = NeoTheme.goldCoin,
      );
      canvas.drawRect(barRect, NeoTheme.stroke(width: 1.5));
    }

    // 8. Title Header Pill (Zero Emojis, crisp vector label)
    final badgeText = '$title (${inputBuffer.length} / ${outputBuffer.length})';
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

  void _drawApparatus(Canvas canvas, double cx, double cy) {
    if (outputType == ProductType.bread || outputType == ProductType.flour) {
      // 1. Değirmen / Fırın (Stone Wheel & Brick Chimney with Flame glow)
      final gearAngle = animTime * 3.5;
      final millCenter = Offset(cx, cy - 6);
      canvas.drawCircle(millCenter, 9, Paint()..color = const Color(0xFF78350F));
      canvas.drawCircle(millCenter, 9, NeoTheme.stroke(width: 1.8));
      for (int i = 0; i < 4; i++) {
        final a = gearAngle + i * (math.pi / 2);
        canvas.drawLine(
          millCenter,
          Offset(millCenter.dx + math.cos(a) * 9, millCenter.dy + math.sin(a) * 9),
          NeoTheme.stroke(width: 1.5, color: const Color(0xFFFDE68A)),
        );
      }
      // Chimney Smoke
      if (inputBuffer.isNotEmpty) {
        final puff = math.sin(animTime * 5.0) * 3;
        canvas.drawCircle(Offset(cx - 16, cy - 22 + puff), 4, Paint()..color = Colors.white.withValues(alpha: 0.6));
        canvas.drawCircle(Offset(cx - 14, cy - 30 + puff), 5, Paint()..color = Colors.white.withValues(alpha: 0.4));
      }
    } else if (outputType == ProductType.ayran || outputType == ProductType.yogurt) {
      // 2. Ayran Şelalesi (Glass Churning Vat with Bubbling Liquid)
      final vatRect = Rect.fromCenter(center: Offset(cx, cy - 8), width: 24, height: 22);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(vatRect, const Radius.circular(5)),
        fillPaint: NeoTheme.fill(const Color(0xFFBAE6FD)),
        strokePaint: NeoTheme.stroke(width: 1.8),
        shadowOffset: 1.5,
      );
      // Whirling Froth
      final swirl = math.sin(animTime * 6.0) * 4;
      canvas.drawCircle(Offset(cx + swirl, cy - 8), 3, Paint()..color = Colors.white);
      canvas.drawCircle(Offset(cx - swirl * 0.7, cy - 12), 2, Paint()..color = Colors.white);
    } else if (outputType == ProductType.teaCup) {
      // 3. Semaver (Turkish Copper Samovar with Steam)
      final semaverRect = Rect.fromCenter(center: Offset(cx, cy - 8), width: 18, height: 22);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(semaverRect, const Radius.circular(4)),
        fillPaint: NeoTheme.fill(const Color(0xFFB45309)),
        strokePaint: NeoTheme.stroke(width: 1.8),
        shadowOffset: 1.5,
      );
      // Double Teapot top
      canvas.drawCircle(Offset(cx, cy - 20), 4, Paint()..color = const Color(0xFFDC2626));
      canvas.drawCircle(Offset(cx, cy - 20), 4, NeoTheme.stroke(width: 1.2));
      // Aromatic Steam
      if (inputBuffer.isNotEmpty) {
        final steam = math.sin(animTime * 4.0) * 3;
        canvas.drawCircle(Offset(cx + steam, cy - 28), 2.5, Paint()..color = Colors.white.withValues(alpha: 0.5));
      }
    } else if (outputType == ProductType.seeds) {
      // 4. Çekirdek Kavurma Kazanı (Rotating Drum & Flame Glow)
      final drumRect = Rect.fromCenter(center: Offset(cx, cy - 6), width: 22, height: 18);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(drumRect, const Radius.circular(4)),
        fillPaint: NeoTheme.fill(const Color(0xFF451A03)),
        strokePaint: NeoTheme.stroke(width: 1.8),
        shadowOffset: 1.5,
      );
      // Golden Spark
      if (inputBuffer.isNotEmpty) {
        canvas.drawCircle(Offset(cx, cy - 6), 3, Paint()..color = NeoTheme.cornYellow);
      }
    } else if (outputType == ProductType.chips) {
      // 5. Cips Fritözü (Stainless Steel Fryer with Golden Slices)
      final fryerRect = Rect.fromCenter(center: Offset(cx, cy - 6), width: 24, height: 18);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(fryerRect, const Radius.circular(3)),
        fillPaint: NeoTheme.fill(const Color(0xFF94A3B8)),
        strokePaint: NeoTheme.stroke(width: 1.8),
        shadowOffset: 1.5,
      );
      // Frying bubbles
      if (inputBuffer.isNotEmpty) {
        final b1 = math.sin(animTime * 8.0) * 4;
        canvas.drawCircle(Offset(cx - 4 + b1, cy - 6), 2, Paint()..color = NeoTheme.cornYellow);
        canvas.drawCircle(Offset(cx + 4 - b1, cy - 8), 2.5, Paint()..color = const Color(0xFFFDE047));
      }
    } else {
      // General Industrial Cog Mechanism
      final gearAngle = animTime * 4.0;
      final gearCenter = Offset(cx, cy - 4);
      canvas.drawCircle(gearCenter, 7, Paint()..color = const Color(0xFF334155));
      canvas.drawCircle(gearCenter, 7, NeoTheme.stroke(width: 1.5));
      for (int g = 0; g < 4; g++) {
        final a = gearAngle + (g * math.pi / 2);
        final tx = gearCenter.dx + math.cos(a) * 9;
        final ty = gearCenter.dy + math.sin(a) * 9;
        canvas.drawCircle(Offset(tx, ty), 2, Paint()..color = const Color(0xFFF1F5F9));
        canvas.drawCircle(Offset(tx, ty), 2, NeoTheme.stroke(width: 1.0));
      }
    }
  }
}
