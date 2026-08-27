import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../mini_mart_game.dart';

class DirtPuddleComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  double cleanProgress = 0.0;
  final double requiredCleanTime = 0.8;
  final String id;

  DirtPuddleComponent({
    required this.id,
    required Vector2 position,
  }) : super(
          position: position,
          size: Vector2(36, 24),
          anchor: Anchor.center,
        ) {
    priority = -80; // Rendered flat on store floor
  }

  void progressClean(double dt) {
    cleanProgress += dt;
    if (cleanProgress >= requiredCleanTime) {
      SoundService.playCleanSweep();
      HapticService.light();
      removeFromParent();
    }
  }

  @override
  void update(double dt) {
    super.update(dt);

    // Player cleaning proximity
    final player = game.player;
    final dist = (player.position - position).length;
    if (dist < 28.0) {
      progressClean(dt * 1.5);
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5;

    // Mud stain
    final mudPaint = Paint()..color = const Color(0xFF78350F).withValues(alpha: 0.6);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy), width: 30, height: 16), mudPaint);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx - 6, cy + 2), width: 14, height: 10), mudPaint);
    canvas.drawOval(Rect.fromCenter(center: Offset(cx + 8, cy - 3), width: 12, height: 8), mudPaint);

    // Footprints
    final footprintPaint = Paint()..color = const Color(0xFF451A03).withValues(alpha: 0.7);
    canvas.drawCircle(Offset(cx - 4, cy - 2), 2, footprintPaint);
    canvas.drawCircle(Offset(cx + 4, cy + 2), 2, footprintPaint);

    // Cleaning Progress Indicator
    if (cleanProgress > 0) {
      final prog = (cleanProgress / requiredCleanTime).clamp(0.0, 1.0);
      canvas.drawRect(Rect.fromLTWH(cx - 12, cy - 12, 24, 4), Paint()..color = Colors.black);
      canvas.drawRect(Rect.fromLTWH(cx - 12, cy - 12, 24 * prog, 4), Paint()..color = NeoTheme.boostCyan);
    }
  }
}
