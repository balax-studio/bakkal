import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class ThiefComponent extends PositionComponent with HasGameReference<MiniMartGame>, TapCallbacks {
  final Vector2 targetPos;
  final Vector2 exitPos;
  bool hasStolen = false;
  double speed = 90.0;
  double animTime = 0.0;
  bool isCaught = false;

  ThiefComponent({
    required Vector2 startPos,
    required this.targetPos,
    required this.exitPos,
  }) : super(
          position: startPos,
          size: Vector2(40, 52),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  void catchThief() {
    if (isCaught) return;
    isCaught = true;

    final reward = 75;
    game.playerData.cash += reward;
    SoundService.playCashCollect();
    HapticService.heavy();

    game.world.add(
      FloatingTextComponent(
        text: 'HIRSIZ YAKALANDI! +$reward \$',
        position: position - Vector2(0, 30),
        color: NeoTheme.tomatoRed,
      ),
    );

    removeFromParent();
  }

  @override
  void onTapDown(TapDownEvent event) {
    catchThief();
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (isCaught) return;

    animTime += dt * 8;
    priority = IsometricMath.calculatePriority(position.x, position.y);

    // Check player physical proximity to catch
    final player = game.player;
    if ((player.position - position).length < 32.0) {
      catchThief();
      return;
    }

    final destination = hasStolen ? exitPos : targetPos;
    final diff = destination - position;

    if (diff.length < 12.0) {
      if (!hasStolen) {
        hasStolen = true;
        SoundService.playSpecialEvent();
      } else {
        // Escaped
        removeFromParent();
        return;
      }
    } else {
      final dir = diff.normalized();
      position += dir * speed * dt;
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    final legOffset = math.sin(animTime) * 4;

    // Shadow
    canvas.drawOval(Rect.fromCenter(center: Offset(cx, cy + 18), width: 26, height: 12), NeoTheme.shadowPaint);

    // Legs (Striped convict/black pants)
    final legPaint = Paint()..color = const Color(0xFF0F172A);
    canvas.drawRect(Rect.fromLTWH(cx - 7, cy + 6, 5, 12 + legOffset), legPaint);
    canvas.drawRect(Rect.fromLTWH(cx + 2, cy + 6, 5, 12 - legOffset), legPaint);

    // Body (Black/Grey Hoodie)
    final bodyRect = Rect.fromCenter(center: Offset(cx, cy - 2), width: 22, height: 20);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(const Color(0xFF334155)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 1.5,
    );

    // Head with Mask
    final headRect = Rect.fromCenter(center: Offset(cx, cy - 16), width: 16, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFFFED7AA)),
      strokePaint: NeoTheme.stroke(width: 1.5),
      shadowOffset: 1.0,
    );

    // Black Eye Mask
    canvas.drawRect(Rect.fromLTWH(cx - 8, cy - 19, 16, 5), Paint()..color = Colors.black);
    // White eye dots
    canvas.drawCircle(Offset(cx - 3, cy - 16), 1.5, Paint()..color = Colors.white);
    canvas.drawCircle(Offset(cx + 3, cy - 16), 1.5, Paint()..color = Colors.white);

    // Loot Bag (if stolen)
    if (hasStolen) {
      final bagRect = Rect.fromCenter(center: Offset(cx + 12, cy - 2), width: 14, height: 16);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(bagRect, const Radius.circular(4)),
        fillPaint: NeoTheme.fill(const Color(0xFFD97706)),
        strokePaint: NeoTheme.stroke(width: 1.5),
        shadowOffset: 1.5,
      );
      // Dollar sign on bag
      final span = const TextSpan(
        text: '\$',
        style: TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.bold),
      );
      final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(cx + 12 - tp.width / 2, cy - 2 - tp.height / 2));
    }

    // "HIRSIZ!" Alert Pill
    final alertSpan = const TextSpan(
      text: 'HIRSIZ!',
      style: TextStyle(
        color: Colors.white,
        fontSize: 8,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final alertTp = TextPainter(text: alertSpan, textDirection: TextDirection.ltr);
    alertTp.layout();

    final pillRect = Rect.fromCenter(center: Offset(cx, cy - 30), width: alertTp.width + 10, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(pillRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(NeoTheme.tomatoRed),
      strokePaint: NeoTheme.stroke(width: 1.5),
      shadowOffset: 1.5,
    );
    alertTp.paint(canvas, Offset(cx - alertTp.width / 2, cy - 30 - alertTp.height / 2));
  }
}
