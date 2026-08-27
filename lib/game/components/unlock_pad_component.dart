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
          size: Vector2(90, 90),
          anchor: Anchor.center,
          priority: 30,
        );

  int get remainingCost => totalCost - currentContributed;
  double get progress => (currentContributed / totalCost).clamp(0.0, 1.0);

  @override
  void update(double dt) {
    super.update(dt);
    pulseTimer += dt * 4.0;

    // Check if player is standing on the pad
    final player = game.player;
    final dist = (player.position - position).length;

    if (dist < 50.0 && game.playerData.cash > 0 && remainingCost > 0) {
      drainCooldown -= dt;
      if (drainCooldown <= 0) {
        drainCooldown = 0.08; // Fast money intake

        final transferAmount = math.min(5, math.min(game.playerData.cash, remainingCost));
        if (transferAmount > 0) {
          game.playerData.cash -= transferAmount;
          currentContributed += transferAmount;
          game.notifyStateChanged();
          SoundService.playHarvest();
          HapticService.light();

          // If unlock completed!
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

    // Spawn celebration particles
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
    final scale = 1.0 + math.sin(pulseTimer) * 0.03;
    canvas.save();
    canvas.translate(45, 45);
    canvas.scale(scale);

    // 1. Shadow
    canvas.drawCircle(const Offset(3, 3), 42, Paint()..color = NeoTheme.shadowBlack);

    // 2. Base Pad Circle
    final basePaint = Paint()..color = const Color(0xFFF1F5F9);
    canvas.drawCircle(Offset.zero, 42, basePaint);

    // 3. Progress Arc (Fill Circle)
    if (progress > 0) {
      final fillPaint = Paint()
        ..color = NeoTheme.cashGreen
        ..style = PaintingStyle.fill;
      canvas.drawArc(
        Rect.fromCircle(center: Offset.zero, radius: 42),
        -math.pi / 2,
        progress * 2 * math.pi,
        true,
        fillPaint,
      );
    }

    // 4. Outer Border
    final borderPaint = NeoTheme.stroke(width: 3.5, color: NeoTheme.inkBlack);
    canvas.drawCircle(Offset.zero, 42, borderPaint);

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
    final tpTitle = TextPainter(text: titleSpan, textDirection: TextDirection.ltr);
    tpTitle.layout();
    tpTitle.paint(canvas, Offset(-tpTitle.width / 2, -16));

    final costSpan = TextSpan(
      text: '\$$remainingCost',
      style: const TextStyle(
        color: NeoTheme.cashDarkGreen,
        fontSize: 13,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tpCost = TextPainter(text: costSpan, textDirection: TextDirection.ltr);
    tpCost.layout();
    tpCost.paint(canvas, Offset(-tpCost.width / 2, 2));

    canvas.restore();
  }
}
