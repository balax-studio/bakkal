import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';
import '../mini_mart_game.dart';

/// Diorama Environment: Living Turkish Neighborhood street, cobblestones, sidewalk,
/// street lamps, striped awnings, animated retro minibus, and strolling neighborhood cat.
class DioramaEnvironmentComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  double animTime = 0.0;

  // Minibus state
  double vehicleProgress = -0.2;
  final double vehicleSpeed = 0.12;

  // Cat state
  double catProgress = 0.0;
  bool catWalkingRight = true;

  DioramaEnvironmentComponent()
      : super(
          position: Vector2.zero(),
          size: Vector2(1150, 950),
          priority: -180, // Far background layer behind floors
        );

  @override
  void update(double dt) {
    super.update(dt);
    animTime += dt;

    // 1. Minibus cycle along bottom street (left to right)
    vehicleProgress += vehicleSpeed * dt;
    if (vehicleProgress > 1.3) {
      vehicleProgress = -0.3; // Reset loop
    }

    // 2. Cat strolling along the sidewalk
    if (catWalkingRight) {
      catProgress += 0.06 * dt;
      if (catProgress >= 1.0) {
        catWalkingRight = false;
      }
    } else {
      catProgress -= 0.06 * dt;
      if (catProgress <= 0.0) {
        catWalkingRight = true;
      }
    }
  }

  @override
  void render(Canvas canvas) {
    final w = size.x;
    final h = size.y;

    // =========================================================================
    // 1. DIORAMA BASE & ASPHALT ROADWAY (Surrounds the store on Top & Bottom)
    // =========================================================================
    // Base Ground Grass Canvas
    canvas.drawRect(Rect.fromLTWH(-60, -60, w + 120, h + 120), Paint()..color = const Color(0xFF2D6A4F));

    // Bottom Neighborhood Street (Asphalt)
    final roadRect = Rect.fromLTWH(0, h - 85, w, 85);
    canvas.drawRect(roadRect, Paint()..color = const Color(0xFF1E293B));
    canvas.drawRect(roadRect, NeoTheme.stroke(width: 3.0));

    // Yellow Dashed Center Lane
    final dashPaint = Paint()
      ..color = const Color(0xFFFBBF24)
      ..strokeWidth = 3.0
      ..style = PaintingStyle.stroke;
    for (double x = 20; x < w - 20; x += 40) {
      canvas.drawLine(Offset(x, h - 42), Offset(x + 20, h - 42), dashPaint);
    }

    // Sidewalk Curbstones (Kaldırım Bordür Taşları)
    final curbRect = Rect.fromLTWH(0, h - 100, w, 15);
    canvas.drawRect(curbRect, Paint()..color = const Color(0xFF94A3B8));
    canvas.drawRect(curbRect, NeoTheme.stroke(width: 2.0));
    final curbDividerPaint = NeoTheme.stroke(width: 1.5, color: const Color(0xFF475569));
    for (double x = 0; x < w; x += 30) {
      canvas.drawLine(Offset(x, h - 100), Offset(x, h - 85), curbDividerPaint);
    }

    // Top Neighborhood Cobblestone Path
    final topCobbleRect = Rect.fromLTWH(0, 0, w, 65);
    canvas.drawRect(topCobbleRect, Paint()..color = const Color(0xFF64748B));
    canvas.drawRect(topCobbleRect, NeoTheme.stroke(width: 2.5));

    // =========================================================================
    // 2. ARCHITECTURAL PROPS (Street Lamps, Canopies, Fences, Sacks)
    // =========================================================================
    // Street Lamp on Bottom Left Sidewalk
    _drawStreetLamp(canvas, 80, h - 115);
    _drawStreetLamp(canvas, w - 120, h - 115);
    _drawStreetLamp(canvas, 550, h - 115);

    // Farm Post & Rail Wooden Fences (Left Border)
    _drawWoodenFence(canvas, 10, 80, 10, h - 120);
    _drawWoodenFence(canvas, 10, 80, 520, 80);

    // Irrigation Canal with Animated Water Stream (Left Farm border)
    _drawIrrigationCanal(canvas, 525, 130, 25, h - 250);

    // Bakkal Red-White Striped Awning & Roof Shadow (Top of Supermarket)
    _drawStoreAwning(canvas, 570, 70, w - 620, 32);

    // Warehouse Jute Sacks & Wooden Pallets by Loading Dock
    _drawPalletAndSacks(canvas, 545, 110);

    // =========================================================================
    // 3. DYNAMIC AMBIENT ACTORS (Minibus & Strolling Cat)
    // =========================================================================
    // Animated Retro Minibus / Dolmuş
    final busX = vehicleProgress * (w + 160) - 80;
    _drawRetroMinibus(canvas, busX, h - 45);

    // Strolling Neighborhood Cat on Sidewalk
    final catX = 140 + catProgress * 300;
    _drawStrollingCat(canvas, catX, h - 92, catWalkingRight);
  }

  void _drawStreetLamp(Canvas canvas, double x, double y) {
    // Soft Ambient Light Cone
    final lightCone = Path()
      ..moveTo(x, y - 28)
      ..lineTo(x - 30, y + 25)
      ..lineTo(x + 30, y + 25)
      ..close();
    canvas.drawPath(lightCone, Paint()..color = const Color(0x22FDE047));

    // Lamp Post Pole
    canvas.drawLine(Offset(x, y + 20), Offset(x, y - 28), NeoTheme.stroke(width: 4.0, color: const Color(0xFF0F172A)));
    // Lantern Fixture
    final lanternRect = Rect.fromCenter(center: Offset(x, y - 28), width: 14, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(lanternRect, const Radius.circular(3)),
      fillPaint: NeoTheme.fill(const Color(0xFFFBBF24)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 1.5,
    );
  }

  void _drawWoodenFence(Canvas canvas, double x1, double y1, double x2, double y2) {
    final fencePaint = Paint()
      ..color = const Color(0xFF92400E)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(x1, y1), Offset(x2, y2), fencePaint);

    final isHorizontal = (y1 - y2).abs() < 5;
    if (isHorizontal) {
      for (double x = x1; x <= x2; x += 40) {
        final postRect = Rect.fromCenter(center: Offset(x, y1), width: 6, height: 16);
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(postRect, const Radius.circular(2)),
          fillPaint: NeoTheme.fill(const Color(0xFFB45309)),
          strokePaint: NeoTheme.stroke(width: 1.5),
          shadowOffset: 1.0,
        );
      }
    } else {
      for (double y = y1; y <= y2; y += 40) {
        final postRect = Rect.fromCenter(center: Offset(x1, y), width: 16, height: 6);
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(postRect, const Radius.circular(2)),
          fillPaint: NeoTheme.fill(const Color(0xFFB45309)),
          strokePaint: NeoTheme.stroke(width: 1.5),
          shadowOffset: 1.0,
        );
      }
    }
  }

  void _drawIrrigationCanal(Canvas canvas, double x, double y, double width, double height) {
    final canalRect = Rect.fromLTWH(x, y, width, height);
    // Stone Bed
    canvas.drawRect(canalRect, Paint()..color = const Color(0xFF475569));
    canvas.drawRect(canalRect, NeoTheme.stroke(width: 2.5));

    // Flowing Water with Animated Ripples
    final waterRect = Rect.fromLTWH(x + 3, y + 3, width - 6, height - 6);
    canvas.drawRect(waterRect, Paint()..color = const Color(0xFF0284C7));

    final waveOffset = (animTime * 30) % 24;
    final wavePaint = Paint()
      ..color = const Color(0xFF38BDF8)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;
    for (double wy = y + 10; wy < y + height - 10; wy += 24) {
      final curY = wy + waveOffset;
      if (curY < y + height - 5) {
        canvas.drawLine(Offset(x + 6, curY), Offset(x + width - 6, curY), wavePaint);
      }
    }
  }

  void _drawStoreAwning(Canvas canvas, double x, double y, double width, double height) {
    // Drop Shadow under Awning
    canvas.drawRect(Rect.fromLTWH(x + 4, y + height, width, 12), NeoTheme.shadowPaint);

    // Red and White Striped Canopy
    final numStripes = (width / 24).ceil();
    final stripeW = width / numStripes;

    for (int i = 0; i < numStripes; i++) {
      final stripeRect = Rect.fromLTWH(x + i * stripeW, y, stripeW, height);
      final color = (i % 2 == 0) ? NeoTheme.tomatoRed : Colors.white;
      NeoTheme.drawNeoRect(
        canvas,
        stripeRect,
        fillPaint: NeoTheme.fill(color),
        strokePaint: NeoTheme.stroke(width: 2.0),
        shadowOffset: 0,
      );

      // Scalloped Awning Hem
      canvas.drawCircle(Offset(x + i * stripeW + stripeW * 0.5, y + height), stripeW * 0.5, Paint()..color = color);
      canvas.drawCircle(Offset(x + i * stripeW + stripeW * 0.5, y + height), stripeW * 0.5, NeoTheme.stroke(width: 1.5));
    }
  }

  void _drawPalletAndSacks(Canvas canvas, double x, double y) {
    // Wooden Pallet
    final palletRect = Rect.fromCenter(center: Offset(x, y), width: 36, height: 24);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(palletRect, const Radius.circular(3)),
      fillPaint: NeoTheme.fill(const Color(0xFFD97706)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    // Jute Flour & Grain Sacks on Pallet
    final sack1 = Rect.fromCenter(center: Offset(x - 6, y - 6), width: 14, height: 16);
    final sack2 = Rect.fromCenter(center: Offset(x + 8, y - 6), width: 14, height: 16);
    final sack3 = Rect.fromCenter(center: Offset(x, y - 16), width: 16, height: 14);

    final sackPaint = Paint()..color = const Color(0xFFD4A373);
    for (final s in [sack1, sack2, sack3]) {
      canvas.drawOval(s, sackPaint);
      canvas.drawOval(s, NeoTheme.stroke(width: 1.5));
    }
  }

  void _drawRetroMinibus(Canvas canvas, double x, double y) {
    final bob = math.sin(animTime * 12) * 1.5;

    // Shadow
    canvas.drawOval(Rect.fromCenter(center: Offset(x, y + 16), width: 72, height: 22), NeoTheme.shadowPaint);

    // Wheels
    final wheelPaint = Paint()..color = const Color(0xFF0F172A);
    canvas.drawCircle(Offset(x - 22, y + 12), 9, wheelPaint);
    canvas.drawCircle(Offset(x - 22, y + 12), 9, NeoTheme.stroke(width: 2.0));
    canvas.drawCircle(Offset(x + 22, y + 12), 9, wheelPaint);
    canvas.drawCircle(Offset(x + 22, y + 12), 9, NeoTheme.stroke(width: 2.0));

    // Yellow Body (Classic Turkish Dolmuş)
    final busRect = Rect.fromCenter(center: Offset(x, y - 2 + bob), width: 68, height: 28);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(busRect, const Radius.circular(8)),
      fillPaint: NeoTheme.fill(const Color(0xFFFACC15)),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 2.5,
    );

    // Windows
    final winRect1 = Rect.fromLTWH(x - 26, y - 10 + bob, 16, 10);
    final winRect2 = Rect.fromLTWH(x - 6, y - 10 + bob, 16, 10);
    final winRect3 = Rect.fromLTWH(x + 14, y - 10 + bob, 14, 10);

    final winPaint = Paint()..color = const Color(0xFFE0F2FE);
    for (final w in [winRect1, winRect2, winRect3]) {
      canvas.drawRRect(RRect.fromRectAndRadius(w, const Radius.circular(2)), winPaint);
      canvas.drawRRect(RRect.fromRectAndRadius(w, const Radius.circular(2)), NeoTheme.stroke(width: 1.2));
    }

    // Headlights
    canvas.drawCircle(Offset(x + 32, y + 2 + bob), 4, Paint()..color = Colors.white);
    canvas.drawCircle(Offset(x + 32, y + 2 + bob), 4, NeoTheme.stroke(width: 1.5));
  }

  void _drawStrollingCat(Canvas canvas, double x, double y, bool faceRight) {
    final stepOffset = math.sin(animTime * 8) * 2;
    final scaleX = faceRight ? 1.0 : -1.0;

    canvas.save();
    canvas.translate(x, y);
    canvas.scale(scaleX, 1.0);

    // Cat Shadow
    canvas.drawOval(const Offset(0, 8) & const Size(18, 6), NeoTheme.shadowPaint);

    // Cat Body (Orange Tabby)
    final bodyRect = Rect.fromCenter(center: Offset(0, stepOffset), width: 14, height: 10);
    canvas.drawOval(bodyRect, Paint()..color = const Color(0xFFF97316));
    canvas.drawOval(bodyRect, NeoTheme.stroke(width: 1.2));

    // Cat Head
    final headCenter = Offset(7, -3 + stepOffset);
    canvas.drawCircle(headCenter, 5, Paint()..color = const Color(0xFFF97316));
    canvas.drawCircle(headCenter, 5, NeoTheme.stroke(width: 1.2));

    // Cat Tail
    final tail = Path()
      ..moveTo(-6, stepOffset)
      ..quadraticBezierTo(-12, -6 + stepOffset, -10, -10 + stepOffset);
    canvas.drawPath(tail, NeoTheme.stroke(width: 2.0, color: const Color(0xFFEA580C)));

    canvas.restore();
  }
}
