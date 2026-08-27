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

class TruckComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final int requiredItems;
  int currentDelivered = 0;
  double deliverCooldown = 0.0;
  bool isCompleted = false;

  late final SolidBox solidCollider;

  TruckComponent({
    required Vector2 position,
    this.requiredItems = 25,
  }) : super(
          position: position,
          size: Vector2(140, 100),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    // Solid obstacle bounds for physics collision
    solidCollider = SolidBox(
      id: 'truck_loading_bay',
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 4),
        width: 110,
        height: 60,
      ),
      label: 'Delivery Truck',
    );
  }

  double get progress => (currentDelivered / requiredItems).clamp(0.0, 1.0);

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    game.physicsWorld.addObstacle(solidCollider);
  }

  @override
  void onRemove() {
    game.physicsWorld.removeObstacle('truck_loading_bay');
    super.onRemove();
  }

  @override
  void update(double dt) {
    super.update(dt);

    if (isCompleted) return;

    final player = game.player;
    final dist = (player.position - position).length;

    if (dist < 80.0 && player.carriedItems.isNotEmpty) {
      deliverCooldown -= dt;
      if (deliverCooldown <= 0) {
        deliverCooldown = 0.12;
        final item = player.takeTopProduct();
        if (item != null) {
          currentDelivered += 1;
          SoundService.playStockShelf();
          HapticService.light();

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
        text: 'MARKET TAMAMLANDI!',
        position: position - Vector2(0, 50),
        color: NeoTheme.goldCoin,
      ),
    );

    game.onLevelGoalCompleted();
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 110.0;
    const h = 54.0;
    const depth = 28.0;

    // 1. Shadow
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 8, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 6)
      ..lineTo(cx - w * 0.5 - 8, cy + depth + 6)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Cargo Container - Front-Left Extrusion
    final leftSidePath = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSidePath, Paint()..color = const Color(0xFF0096C7));
    canvas.drawPath(leftSidePath, NeoTheme.stroke(width: 3.0));

    // Cargo Container - Front-Right Extrusion
    final rightSidePath = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSidePath, Paint()..color = const Color(0xFF0077B6));
    canvas.drawPath(rightSidePath, NeoTheme.stroke(width: 3.0));

    // Cargo Container - Top Roof
    final topPath = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topPath, Paint()..color = NeoTheme.boostCyan);
    canvas.drawPath(topPath, NeoTheme.stroke(width: 3.0));

    // Truck Cabin Accent
    final cabinFront = Rect.fromCenter(center: Offset(cx + 34, cy + 8), width: 26, height: 22);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(cabinFront, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    // Windshield
    canvas.drawRect(
      Rect.fromCenter(center: Offset(cx + 34, cy + 4), width: 18, height: 8),
      Paint()..color = Colors.white,
    );

    // 3. Progress Bar & Goal Pill
    final barBgRect = Rect.fromCenter(center: Offset(cx, cy - h * 0.5 - 12), width: 110, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(barBgRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    if (progress > 0) {
      final fillWidth = 106.0 * progress;
      final fillRect = Rect.fromLTWH(cx - 53, cy - h * 0.5 - 18, fillWidth, 12);
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
    tp.paint(canvas, Offset(cx - tp.width / 2, cy - h * 0.5 - 12 - tp.height / 2));
  }
}
