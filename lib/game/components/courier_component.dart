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

class CourierComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  CourierOrder? currentOrder;
  double nextOrderCooldown = 5.0;
  double interactCooldown = 0.0;
  double animBounce = 0.0;
  late final SolidBox solidCollider;

  CourierComponent({
    required Vector2 position,
  }) : super(
          position: position,
          size: Vector2(100, 75),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    solidCollider = SolidBox(
      id: 'courier_bike',
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 4),
        width: 70,
        height: 48,
      ),
      label: 'Kurye Motoru',
    );
  }

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    game.physicsWorld.addObstacle(solidCollider);
    _generateNewOrder();
  }

  @override
  void onRemove() {
    game.physicsWorld.removeObstacle('courier_bike');
    super.onRemove();
  }

  void _generateNewOrder() {
    // Generate combo order based on unlocked items
    final possibleItems = [
      ProductType.bread,
      ProductType.ayran,
      ProductType.tomatoPaste,
      ProductType.chips,
      ProductType.seeds,
      ProductType.teaCup,
      ProductType.toast,
    ];

    final r = math.Random();
    possibleItems.shuffle(r);

    final item1 = possibleItems[0];
    final count1 = 2 + r.nextInt(4); // 2 to 5

    final item2 = possibleItems[1];
    final count2 = 1 + r.nextInt(3); // 1 to 3

    final totalValue = (item1.basePrice * count1 + item2.basePrice * count2) * 2;

    currentOrder = CourierOrder(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      requiredItems: {
        item1: count1,
        item2: count2,
      },
      rewardCash: totalValue + 150,
      rewardGems: 2 + r.nextInt(3),
      remainingSeconds: 75.0,
    );

    SoundService.playSpecialEvent();
  }

  @override
  void update(double dt) {
    super.update(dt);
    animBounce += dt * 3;

    if (currentOrder != null) {
      currentOrder!.remainingSeconds -= dt;
      if (currentOrder!.remainingSeconds <= 0) {
        currentOrder = null;
        nextOrderCooldown = 15.0;
      }
    } else {
      nextOrderCooldown -= dt;
      if (nextOrderCooldown <= 0) {
        _generateNewOrder();
      }
    }

    // Player Interaction (Fulfill requested order items)
    interactCooldown -= dt;
    if (interactCooldown <= 0 && currentOrder != null) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 72.0 && player.carriedItems.isNotEmpty) {
        final topItem = player.carriedItems.last;
        final reqCount = currentOrder!.requiredItems[topItem.type] ?? 0;

        if (reqCount > 0) {
          player.takeTopProduct();
          currentOrder!.requiredItems[topItem.type] = reqCount - 1;
          if (currentOrder!.requiredItems[topItem.type] == 0) {
            currentOrder!.requiredItems.remove(topItem.type);
          }

          SoundService.playStockShelf();
          HapticService.light();
          interactCooldown = 0.15;

          // Check if order is fully completed!
          if (currentOrder!.requiredItems.isEmpty) {
            final cash = currentOrder!.rewardCash;
            final gems = currentOrder!.rewardGems;

            game.playerData.cash += cash;
            game.playerData.gems += gems;

            SoundService.playLevelUp();
            HapticService.medium();

            game.world.add(
              FloatingTextComponent(
                text: '🏆 SİPARİŞ TAMAMLANDI! +$cash +$gems Elmas',
                position: position - Vector2(0, 45),
                color: NeoTheme.goldCoin,
              ),
            );

            currentOrder = null;
            nextOrderCooldown = 20.0;
          }
        }
      }
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    final bob = math.sin(animBounce) * 1.5;

    // 1. Motorcycle Shadow
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy + 18), width: 68, height: 26),
      NeoTheme.shadowPaint,
    );

    // 2. Motorcycle Body (Red & Yellow Neo-Brutalist Scooter)
    // Wheels
    final wheelPaint = Paint()..color = const Color(0xFF1E293B);
    canvas.drawCircle(Offset(cx - 22, cy + 12), 10, wheelPaint);
    canvas.drawCircle(Offset(cx - 22, cy + 12), 10, NeoTheme.stroke(width: 2.0));
    canvas.drawCircle(Offset(cx + 22, cy + 12), 10, wheelPaint);
    canvas.drawCircle(Offset(cx + 22, cy + 12), 10, NeoTheme.stroke(width: 2.0));

    // Scooter Body
    final bodyPath = Path()
      ..moveTo(cx - 20, cy + 8 + bob)
      ..lineTo(cx - 10, cy - 8 + bob)
      ..lineTo(cx + 10, cy - 8 + bob)
      ..lineTo(cx + 24, cy + 8 + bob)
      ..lineTo(cx + 6, cy + 10 + bob)
      ..close();
    canvas.drawPath(bodyPath, Paint()..color = NeoTheme.tomatoRed);
    canvas.drawPath(bodyPath, NeoTheme.stroke(width: 2.5));

    // Courier Delivery Box (Yellow Box on back)
    final boxRect = Rect.fromCenter(center: Offset(cx - 14, cy - 12 + bob), width: 22, height: 20);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(boxRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.cornYellow),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    // Handlebars & Headlight
    canvas.drawCircle(Offset(cx + 16, cy - 6 + bob), 4, Paint()..color = Colors.white);
    canvas.drawCircle(Offset(cx + 16, cy - 6 + bob), 4, NeoTheme.stroke(width: 1.5));

    // 3. Order Bubble Above Scooter
    if (currentOrder != null) {
      final reqs = currentOrder!.requiredItems.entries.map((e) => '${e.value}x ${e.key.emoji}').join(' + ');
      final orderText = '🛵 PAKET: $reqs (⏳${currentOrder!.remainingSeconds.toInt()}s)';

      final span = TextSpan(
        text: orderText,
        style: const TextStyle(
          color: NeoTheme.inkBlack,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          fontFamily: 'sans-serif',
        ),
      );
      final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
      tp.layout();

      final pillRect = Rect.fromCenter(center: Offset(cx, cy - 36), width: tp.width + 16, height: 22);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(pillRect, const Radius.circular(8)),
        fillPaint: NeoTheme.fill(const Color(0xFFFEF08A)),
        strokePaint: NeoTheme.stroke(width: 2.0),
        shadowOffset: 2.5,
      );
      tp.paint(canvas, Offset(cx - tp.width / 2, cy - 36 - tp.height / 2));
    } else {
      final span = const TextSpan(
        text: '🛵 Kurye Yolda...',
        style: TextStyle(
          color: Colors.white,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          fontFamily: 'sans-serif',
        ),
      );
      final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
      tp.layout();

      final pillRect = Rect.fromCenter(center: Offset(cx, cy - 36), width: tp.width + 14, height: 20);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(pillRect, const Radius.circular(6)),
        fillPaint: NeoTheme.fill(const Color(0xFF64748B)),
        strokePaint: NeoTheme.stroke(width: 1.5),
        shadowOffset: 2.0,
      );
      tp.paint(canvas, Offset(cx - tp.width / 2, cy - 36 - tp.height / 2));
    }
  }
}
