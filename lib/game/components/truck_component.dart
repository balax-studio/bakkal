import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class TruckComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final int requiredItems;
  int currentDelivered = 0;
  double deliverCooldown = 0.0;
  bool isCompleted = false;

  TruckComponent({
    required Vector2 position,
    this.requiredItems = 25,
  }) : super(
          position: position,
          size: Vector2(130, 90),
          anchor: Anchor.center,
          priority: 45,
        );

  double get progress => (currentDelivered / requiredItems).clamp(0.0, 1.0);

  @override
  void update(double dt) {
    super.update(dt);

    if (isCompleted) return;

    // Check player proximity to load truck
    final player = game.player;
    final dist = (player.position - position).length;

    if (dist < 75.0 && player.carriedItems.isNotEmpty) {
      deliverCooldown -= dt;
      if (deliverCooldown <= 0) {
        deliverCooldown = 0.12;
        final item = player.takeTopProduct();
        if (item != null) {
          currentDelivered += 1;
          SoundService.playStockShelf();
          HapticService.light();

          // Reward instant cash for delivery
          game.playerData.cash += (item.type.basePrice * 1.5).round();
          game.notifyStateChanged();

          if (currentDelivered >= requiredItems) {
            isCompleted = true;
            _triggerMarketCompletion();
          }
        }
      }
    }
  }

  void _triggerMarketCompletion() {
    SoundService.playLevelUp();
    HapticService.heavy();

    // Massive confetti explosion
    game.world.add(
      ParticleBurstComponent(
        position: position,
        count: 50,
        colors: [
          NeoTheme.goldCoin,
          NeoTheme.cashGreen,
          NeoTheme.boostCyan,
          NeoTheme.tomatoRed,
          NeoTheme.purpleAccent,
          Colors.white,
        ],
      ),
    );

    game.world.add(
      FloatingTextComponent(
        text: 'MARKET TAMAMLANDI! 🚚🎉',
        position: position - Vector2(0, 50),
        color: NeoTheme.goldCoin,
      ),
    );

    // Notify Game to show Level Transition Modal
    game.onLevelGoalCompleted();
  }

  @override
  void render(Canvas canvas) {
    // 1. Shadow
    final shadowRect = Rect.fromCenter(center: const Offset(65, 52), width: 124, height: 74);
    canvas.drawRect(shadowRect, Paint()..color = NeoTheme.shadowBlack);

    // 2. Truck Cargo Container (Neo-Brutalist Bold Box)
    final cargoRect = Rect.fromCenter(center: const Offset(45, 42), width: 78, height: 64);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(cargoRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(NeoTheme.boostCyan),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 0,
    );

    // Cargo Ridges / Striping
    for (int i = 0; i < 4; i++) {
      final lineX = 18.0 + (i * 18.0);
      canvas.drawLine(
        Offset(lineX, 14),
        Offset(lineX, 70),
        NeoTheme.stroke(width: 2.0, color: const Color(0xFF00B4D8)),
      );
    }

    // 3. Truck Cabin
    final cabinRect = Rect.fromCenter(center: const Offset(102, 42), width: 36, height: 52);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(cabinRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 0,
    );

    // Windshield
    final windshieldRect = Rect.fromCenter(center: const Offset(105, 30), width: 22, height: 20);
    canvas.drawRect(windshieldRect, Paint()..color = Colors.white);
    canvas.drawRect(windshieldRect, NeoTheme.stroke(width: 2.0));

    // Wheels
    final wheelPaint = Paint()..color = NeoTheme.inkBlack;
    canvas.drawCircle(const Offset(25, 78), 10, wheelPaint);
    canvas.drawCircle(const Offset(70, 78), 10, wheelPaint);
    canvas.drawCircle(const Offset(105, 78), 10, wheelPaint);

    // 4. Delivery Progress Bar & Badge
    final barBgRect = Rect.fromCenter(center: const Offset(65, -8), width: 110, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(barBgRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    // Fill bar
    if (progress > 0) {
      final fillWidth = 106.0 * progress;
      final fillRect = Rect.fromLTWH(12, -14, fillWidth, 12);
      canvas.drawRect(
        fillRect,
        Paint()..color = isCompleted ? NeoTheme.cashGreen : NeoTheme.goldCoin,
      );
    }

    final barText = isCompleted ? 'SEVKİYAT HAZIR' : 'HEDEF: $currentDelivered/$requiredItems';
    final span = TextSpan(
      text: barText,
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();
    tp.paint(canvas, Offset(65 - tp.width / 2, -14));
  }
}
