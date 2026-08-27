import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class UnlockPadComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String unlockId;
  final String title;
  final int totalCost;
  final VoidCallback onUnlocked;
  int currentContributed = 0;

  double drainCooldown = 0.0;
  double pulseTimer = 0.0;

  UnlockPadComponent({
    required this.unlockId,
    required this.title,
    required this.totalCost,
    required Vector2 position,
    required this.onUnlocked,
  }) : super(
          position: position,
          size: Vector2(100, 70),
          anchor: Anchor.center,
          priority: 15, // Ground-level priority
        );

  int get remainingCost => totalCost - currentContributed;
  double get progress => (currentContributed / totalCost).clamp(0.0, 1.0);

  @override
  void update(double dt) {
    super.update(dt);
    pulseTimer += dt * 4.0;

    final player = game.player;
    final dist = (player.position - position).length;

    if (dist < 55.0 && game.playerData.cash > 0 && remainingCost > 0) {
      drainCooldown -= dt;
      if (drainCooldown <= 0) {
        drainCooldown = 0.08;

        final transferAmount = math.min(5, math.min(game.playerData.cash, remainingCost));
        if (transferAmount > 0) {
          game.playerData.cash -= transferAmount;
          currentContributed += transferAmount;
          game.notifyStateChanged();
          SoundService.playHarvest();
          HapticService.light();

          if (currentContributed >= totalCost) {
            _triggerUnlock();
          }
        }
      }
    }
  }

  void _triggerUnlock() {
    game.playerData.unlockedAreas.add(unlockId);
    game.saveGame();
    game.notifyStateChanged();

    SoundService.playUnlock();
    HapticService.heavy();

    game.world.add(
      ParticleBurstComponent(
        position: position,
        count: 36,
        colors: [
          NeoTheme.cashGreen,
          NeoTheme.goldCoin,
          NeoTheme.boostCyan,
          NeoTheme.purpleAccent,
          Colors.white,
        ],
      ),
    );

    game.world.add(
      FloatingTextComponent(
        text: 'ACILDI: $title!',
        position: position - Vector2(0, 40),
        color: NeoTheme.cashGreen,
      ),
    );

    onUnlocked();
    removeFromParent();
  }

  @override
  void render(Canvas canvas) {
    final scale = 1.0 + math.sin(pulseTimer) * 0.04;
    final cx = size.x * 0.5;
    final cy = size.y * 0.5;
    const w = 84.0;
    const h = 48.0;

    canvas.save();
    canvas.translate(cx, cy);
    canvas.scale(scale);

    // 1. Isometric Drop Shadow
    final shadowOval = Rect.fromCenter(center: const Offset(3, 4), width: w, height: h);
    canvas.drawOval(shadowOval, NeoTheme.shadowPaint);

    // 2. Base Isometric Ground Oval
    final baseOval = Rect.fromCenter(center: Offset.zero, width: w, height: h);
    canvas.drawOval(baseOval, Paint()..color = const Color(0xFFFFFFFF));

    // 3. Progress Arc Fill
    if (progress > 0) {
      final fillPaint = Paint()
        ..color = NeoTheme.cashGreen.withValues(alpha: 0.85)
        ..style = PaintingStyle.fill;
      canvas.drawArc(
        baseOval,
        -math.pi / 2,
        progress * 2 * math.pi,
        true,
        fillPaint,
      );
    }

    // 4. Neo-Brutalist Border
    canvas.drawOval(baseOval, NeoTheme.stroke(width: 3.0, color: NeoTheme.inkBlack));

    // 5. Title & Remaining Cost Badge
    final titleSpan = TextSpan(
      text: title,
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final titlePainter = TextPainter(text: titleSpan, textDirection: TextDirection.ltr);
    titlePainter.layout();
    titlePainter.paint(canvas, Offset(-titlePainter.width / 2, -14));

    final costSpan = TextSpan(
      text: '\$$remainingCost',
      style: const TextStyle(
        color: NeoTheme.cashDarkGreen,
        fontSize: 13,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final costPainter = TextPainter(text: costSpan, textDirection: TextDirection.ltr);
    costPainter.layout();
    costPainter.paint(canvas, Offset(-costPainter.width / 2, 0));

    canvas.restore();
  }
}
