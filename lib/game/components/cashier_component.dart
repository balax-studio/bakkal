import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class CashierComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  int accumulatedCash = 0;
  bool isCashierPresent = false;
  double checkoutTimer = 0.0;

  CashierComponent({
    required this.id,
    required Vector2 position,
  }) : super(
          position: position,
          size: Vector2(120, 80),
          anchor: Anchor.center,
          priority: 60,
        );

  Vector2 get customerQueueStart => position + Vector2(-60, 0);
  Vector2 get cashierStandPosition => position + Vector2(25, -20);
  Vector2 get cashTrayPosition => position + Vector2(25, 20);

  void addCash(int amount) {
    accumulatedCash += amount;
  }

  @override
  void update(double dt) {
    super.update(dt);

    // 1. Check if player or worker is standing behind register
    final player = game.player;
    final distToRegister = (player.position - cashierStandPosition).length;
    final hasWorkerCashier = game.playerData.unlockedAreas.contains('worker_cashier_1');

    isCashierPresent = (distToRegister < 45.0) || hasWorkerCashier;

    // 2. Check if player is near cash tray to collect accumulated cash
    final distToCash = (player.position - cashTrayPosition).length;
    if (distToCash < 50.0 && accumulatedCash > 0) {
      final cashToGive = accumulatedCash;
      accumulatedCash = 0;

      // Apply player profit multiplier
      final totalCash = (cashToGive * game.playerData.profitMultiplier).round();
      game.playerData.cash += totalCash;
      game.notifyStateChanged();

      SoundService.playCashCollect();
      HapticService.medium();

      // Spawn burst effect & floating cash text
      game.world.add(
        ParticleBurstComponent(
          position: cashTrayPosition,
          colors: [NeoTheme.cashGreen, NeoTheme.goldCoin, Colors.white],
        ),
      );
      game.world.add(
        FloatingTextComponent(
          text: '+$totalCash 💵',
          position: cashTrayPosition - Vector2(0, 20),
          color: NeoTheme.cashGreen,
        ),
      );
    }
  }

  @override
  void render(Canvas canvas) {
    // 1. Counter Base (Clean Neo-Brutalist Desk)
    final counterRect = Rect.fromCenter(center: const Offset(60, 40), width: 114, height: 74);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(counterRect, const Radius.circular(8)),
      fillPaint: NeoTheme.fill(NeoTheme.counterGray),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 4.0,
    );

    // Conveyor Belt Section
    final conveyorRect = Rect.fromCenter(center: const Offset(35, 40), width: 50, height: 58);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(conveyorRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFF37474F)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 0,
    );

    // Register / POS Terminal
    final posRect = Rect.fromCenter(center: const Offset(82, 28), width: 28, height: 24);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(posRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFF1E293B)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    // Green Screen on POS
    canvas.drawRect(
      Rect.fromCenter(center: const Offset(82, 24), width: 18, height: 10),
      Paint()..color = isCashierPresent ? NeoTheme.cashGreen : Colors.redAccent,
    );

    // 2. Cash Tray & Green Bills Stack
    final trayRect = Rect.fromCenter(center: const Offset(82, 58), width: 34, height: 26);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(trayRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFFCFD8DC)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 0,
    );

    if (accumulatedCash > 0) {
      final billCount = math.min((accumulatedCash / 10).ceil(), 6);
      for (int i = 0; i < billCount; i++) {
        final billRect = Rect.fromCenter(
          center: Offset(82, 58.0 - (i * 3.0)),
          width: 26,
          height: 14,
        );
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(billRect, const Radius.circular(2)),
          fillPaint: NeoTheme.fill(NeoTheme.cashGreen),
          strokePaint: NeoTheme.stroke(width: 1.5),
          shadowOffset: 1.0,
        );
      }

      // Money Amount Badge
      final cashText = '\$$accumulatedCash';
      final span = TextSpan(
        text: cashText,
        style: const TextStyle(
          color: NeoTheme.inkBlack,
          fontSize: 9,
          fontWeight: FontWeight.w900,
        ),
      );
      final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(82 - tp.width / 2, 70));
    }

    // 3. Status Tag
    final statusText = isCashierPresent ? '✅ KASA AÇIK' : '⚠️ KASİYER BEKLENİYOR';
    final span = TextSpan(
      text: statusText,
      style: TextStyle(
        color: isCashierPresent ? NeoTheme.cashDarkGreen : NeoTheme.tomatoRed,
        fontSize: 9,
        fontWeight: FontWeight.w900,
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();
    tp.paint(canvas, Offset(60 - tp.width / 2, -6));
  }
}
