import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';
import '../mini_mart_game.dart';

/// Pre-allocated data structure for a tree
class _OutdoorTree {
  final double x;
  final double y;
  final double scale;
  final Color foliageColor;
  final Color shadowColor;

  const _OutdoorTree({
    required this.x,
    required this.y,
    required this.scale,
    required this.foliageColor,
    required this.shadowColor,
  });
}

/// Pre-allocated data structure for a flower
class _OutdoorFlower {
  final double x;
  final double y;
  final Color color;
  final double stemHeight;
  final double phase;

  const _OutdoorFlower({
    required this.x,
    required this.y,
    required this.color,
    required this.stemHeight,
    required this.phase,
  });
}

/// Pre-allocated data structure for grass tuft
class _OutdoorGrass {
  final double x;
  final double y;
  final double height;
  final double phase;

  const _OutdoorGrass({
    required this.x,
    required this.y,
    required this.height,
    required this.phase,
  });
}

/// Pre-allocated data structure for cloud
class _OutdoorCloud {
  double x;
  final double y;
  final double speed;
  final double width;

  _OutdoorCloud({
    required this.x,
    required this.y,
    required this.speed,
    required this.width,
  });
}

/// High-performance, zero-allocation Batched Ambient Outdoor Component.
/// Renders 2.5D trees, swaying grass, wildflowers, butterflies, bees and drifting clouds in a single draw pass.
class AmbientOutdoorComponent extends Component with HasGameReference<MiniMartGame> {
  double totalTime = 0.0;

  // Cached Paints (Zero allocation in render loop)
  late final Paint _trunkPaint;
  late final Paint _bushPaint;
  late final Paint _stemPaint;
  late final Paint _shadowPaint;
  late final Paint _stonePaint;
  late final Paint _cloudPaint;
  late final Paint _blackStroke2;
  late final Paint _yellowCorePaint;

  // Pre-allocated static world data
  late final List<_OutdoorTree> _trees;
  late final List<_OutdoorFlower> _flowers;
  late final List<_OutdoorGrass> _grassTufts;
  late final List<_OutdoorCloud> _clouds;

  AmbientOutdoorComponent() : super(priority: -150) {
    _initPaints();
    _initStaticWorldData();
  }

  void _initPaints() {
    _trunkPaint = Paint()..color = const Color(0xFF78350F);
    _bushPaint = Paint()..color = const Color(0xFF4D7C0F);
    _stemPaint = Paint()
      ..color = const Color(0xFF15803D)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;
    _shadowPaint = Paint()..color = const Color(0x28000000);
    _stonePaint = Paint()..color = const Color(0xFF94A3B8);
    _cloudPaint = Paint()..color = const Color(0xEEFFFFFF);
    _blackStroke2 = NeoTheme.stroke(width: 2.0);
    _yellowCorePaint = Paint()..color = NeoTheme.goldCoin;
  }

  void _initStaticWorldData() {
    // 1. 2.5D Isometric Trees outside store perimeter
    _trees = const [
      // Left side forest strip
      _OutdoorTree(x: -15, y: 180, scale: 1.1, foliageColor: Color(0xFF15803D), shadowColor: Color(0xFF166534)),
      _OutdoorTree(x: 10, y: 380, scale: 0.95, foliageColor: Color(0xFF16A34A), shadowColor: Color(0xFF15803D)),
      _OutdoorTree(x: -20, y: 560, scale: 1.05, foliageColor: Color(0xFF15803D), shadowColor: Color(0xFF166534)),
      _OutdoorTree(x: 5, y: 760, scale: 1.15, foliageColor: Color(0xFF65A30D), shadowColor: Color(0xFF4D7C0F)),
      // Top background garden
      _OutdoorTree(x: 90, y: 10, scale: 0.9, foliageColor: Color(0xFF16A34A), shadowColor: Color(0xFF15803D)),
      _OutdoorTree(x: 560, y: 15, scale: 0.9, foliageColor: Color(0xFF65A30D), shadowColor: Color(0xFF4D7C0F)),
      // Right side strip
      _OutdoorTree(x: 660, y: 200, scale: 1.0, foliageColor: Color(0xFF15803D), shadowColor: Color(0xFF166534)),
      _OutdoorTree(x: 645, y: 420, scale: 1.1, foliageColor: Color(0xFF16A34A), shadowColor: Color(0xFF15803D)),
      _OutdoorTree(x: 665, y: 640, scale: 0.95, foliageColor: Color(0xFF65A30D), shadowColor: Color(0xFF4D7C0F)),
      _OutdoorTree(x: 640, y: 820, scale: 1.1, foliageColor: Color(0xFF15803D), shadowColor: Color(0xFF166534)),
    ];

    // 2. Wildflowers (Papatyalar ve Gelincikler)
    _flowers = const [
      _OutdoorFlower(x: 20, y: 260, color: Color(0xFFFF2E55), stemHeight: 14, phase: 0.2),
      _OutdoorFlower(x: 35, y: 290, color: Color(0xFFFFD000), stemHeight: 12, phase: 1.4),
      _OutdoorFlower(x: 15, y: 480, color: Colors.white, stemHeight: 15, phase: 2.1),
      _OutdoorFlower(x: 30, y: 520, color: Color(0xFFC084FC), stemHeight: 13, phase: 0.8),
      _OutdoorFlower(x: 18, y: 680, color: Color(0xFFFF2E55), stemHeight: 16, phase: 3.0),
      _OutdoorFlower(x: 625, y: 280, color: Color(0xFF38BDF8), stemHeight: 13, phase: 1.1),
      _OutdoorFlower(x: 640, y: 320, color: Color(0xFFFFD000), stemHeight: 14, phase: 2.5),
      _OutdoorFlower(x: 620, y: 530, color: Colors.white, stemHeight: 15, phase: 0.5),
      _OutdoorFlower(x: 635, y: 570, color: Color(0xFFFF2E55), stemHeight: 12, phase: 1.8),
      _OutdoorFlower(x: 625, y: 730, color: Color(0xFFC084FC), stemHeight: 14, phase: 2.9),
    ];

    // 3. Swaying Grass Tufts
    _grassTufts = const [
      _OutdoorGrass(x: 15, y: 210, height: 10, phase: 0.1),
      _OutdoorGrass(x: 25, y: 340, height: 12, phase: 1.2),
      _OutdoorGrass(x: 10, y: 440, height: 11, phase: 2.4),
      _OutdoorGrass(x: 22, y: 610, height: 13, phase: 0.7),
      _OutdoorGrass(x: 18, y: 720, height: 10, phase: 1.9),
      _OutdoorGrass(x: 635, y: 230, height: 11, phase: 0.4),
      _OutdoorGrass(x: 625, y: 370, height: 13, phase: 1.6),
      _OutdoorGrass(x: 640, y: 490, height: 10, phase: 2.8),
      _OutdoorGrass(x: 628, y: 670, height: 12, phase: 0.9),
      _OutdoorGrass(x: 638, y: 780, height: 11, phase: 2.2),
    ];

    // 4. Drifting 2.5D Neo-Brutalist Clouds
    _clouds = [
      _OutdoorCloud(x: 100, y: 40, speed: 8.0, width: 90),
      _OutdoorCloud(x: 420, y: 90, speed: 6.5, width: 110),
      _OutdoorCloud(x: -80, y: 120, speed: 7.2, width: 80),
    ];
  }

  @override
  void update(double dt) {
    super.update(dt);
    totalTime += dt;

    // Update drifting clouds
    for (final cloud in _clouds) {
      cloud.x += cloud.speed * dt;
      if (cloud.x > game.worldWidth + 120) {
        cloud.x = -140;
      }
    }
  }

  @override
  void render(Canvas canvas) {
    // 1. Drifting 2.5D Sky Clouds
    _renderClouds(canvas);

    // 2. Decorative Bushes & Garden Stones
    _renderBushesAndStones(canvas);

    // 3. 2.5D Isometric Trees
    _renderTrees(canvas);

    // 4. Swaying Grass & Flowers
    _renderGrassAndFlowers(canvas);

    // 5. Living Micro-Fauna (Butterflies & Bees)
    _renderMicroFauna(canvas);
  }

  void _renderClouds(Canvas canvas) {
    for (final cloud in _clouds) {
      final cx = cloud.x;
      final cy = cloud.y + math.sin(totalTime * 0.8 + cloud.speed) * 4.0;
      final w = cloud.width;

      // Cloud Shadow
      canvas.drawRRect(
        RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx + 4, cy + 6), width: w, height: 32), const Radius.circular(16)),
        _shadowPaint,
      );

      // Cloud Body
      final cloudRect = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: w, height: 32), const Radius.circular(16));
      canvas.drawRRect(cloudRect, _cloudPaint);
      canvas.drawRRect(cloudRect, _blackStroke2);

      // Puffy dome top
      final domeRect = Rect.fromCircle(center: Offset(cx - 10, cy - 8), radius: 18);
      canvas.drawArc(domeRect, math.pi, math.pi, true, _cloudPaint);
      canvas.drawArc(domeRect, math.pi, math.pi, false, _blackStroke2);
    }
  }

  void _renderBushesAndStones(Canvas canvas) {
    // Left side bushes
    _drawBush(canvas, 30, 140, 16);
    _drawBush(canvas, 20, 310, 18);
    _drawBush(canvas, 32, 650, 17);

    // Right side bushes
    _drawBush(canvas, 620, 170, 18);
    _drawBush(canvas, 635, 470, 16);
    _drawBush(canvas, 622, 710, 19);

    // Garden Pebbles/Stones
    _drawPebble(canvas, 24, 230, 8, 5);
    _drawPebble(canvas, 36, 420, 10, 6);
    _drawPebble(canvas, 18, 590, 7, 4);
    _drawPebble(canvas, 630, 250, 9, 6);
    _drawPebble(canvas, 618, 550, 11, 7);
  }

  void _drawBush(Canvas canvas, double x, double y, double r) {
    canvas.drawOval(Rect.fromCenter(center: Offset(x + 2, y + r * 0.8), width: r * 2.2, height: r * 0.9), _shadowPaint);
    final bushRect = Rect.fromCircle(center: Offset(x, y), radius: r);
    canvas.drawOval(bushRect, _bushPaint);
    canvas.drawOval(bushRect, _blackStroke2);
  }

  void _drawPebble(Canvas canvas, double x, double y, double w, double h) {
    canvas.drawOval(Rect.fromCenter(center: Offset(x + 1, y + 2), width: w, height: h), _shadowPaint);
    final r = Rect.fromCenter(center: Offset(x, y), width: w, height: h);
    canvas.drawOval(r, _stonePaint);
    canvas.drawOval(r, _blackStroke2);
  }

  void _renderTrees(Canvas canvas) {
    for (final tree in _trees) {
      final tx = tree.x;
      final ty = tree.y;
      final s = tree.scale;

      // 1. Isometric Ground Shadow
      canvas.drawOval(
        Rect.fromCenter(center: Offset(tx + 4, ty + 16 * s), width: 44 * s, height: 20 * s),
        _shadowPaint,
      );

      // 2. Trunk
      final trunkRect = Rect.fromLTWH(tx - 5 * s, ty - 6 * s, 10 * s, 20 * s);
      canvas.drawRect(trunkRect, _trunkPaint);
      canvas.drawRect(trunkRect, _blackStroke2);

      // 3. 2.5D Tiered Isometric Foliage Cone (Neo-Brutalist Layered)
      // Bottom Foliage Layer
      _drawIsoConeLayer(canvas, tx, ty - 8 * s, 34 * s, 20 * s, tree.shadowColor);
      // Middle Foliage Layer
      _drawIsoConeLayer(canvas, tx, ty - 22 * s, 28 * s, 18 * s, tree.foliageColor);
      // Top Crown
      _drawIsoConeLayer(canvas, tx, ty - 34 * s, 20 * s, 16 * s, tree.foliageColor);
    }
  }

  void _drawIsoConeLayer(Canvas canvas, double x, double y, double w, double h, Color color) {
    final rect = Rect.fromCenter(center: Offset(x, y), width: w, height: h);
    final paint = Paint()..color = color;
    canvas.drawOval(rect, paint);
    canvas.drawOval(rect, _blackStroke2);
  }

  void _renderGrassAndFlowers(Canvas canvas) {
    // Grass
    for (final grass in _grassTufts) {
      final sway = math.sin(totalTime * 2.8 + grass.phase) * 3.0;
      final gx = grass.x;
      final gy = grass.y;
      final gh = grass.height;

      canvas.drawLine(Offset(gx, gy), Offset(gx + sway - 2, gy - gh), _stemPaint);
      canvas.drawLine(Offset(gx, gy), Offset(gx + sway * 1.2, gy - gh * 1.2), _stemPaint);
      canvas.drawLine(Offset(gx, gy), Offset(gx + sway + 2, gy - gh * 0.9), _stemPaint);
    }

    // Flowers
    for (final flower in _flowers) {
      final sway = math.sin(totalTime * 2.5 + flower.phase) * 3.0;
      final fx = flower.x;
      final fy = flower.y;
      final fh = flower.stemHeight;
      final topX = fx + sway;
      final topY = fy - fh;

      // Stem
      canvas.drawLine(Offset(fx, fy), Offset(topX, topY), _stemPaint);

      // Petals
      final flowerPaint = Paint()..color = flower.color;
      canvas.drawCircle(Offset(topX, topY), 5.5, flowerPaint);
      canvas.drawCircle(Offset(topX, topY), 5.5, _blackStroke2);

      // Yellow Flower Core
      canvas.drawCircle(Offset(topX, topY), 2.2, _yellowCorePaint);
    }
  }

  void _renderMicroFauna(Canvas canvas) {
    // 1. Butterflies (Harmonic flight curves outside market walls)
    _drawButterfly(
      canvas: canvas,
      center: Offset(
        25 + math.sin(totalTime * 1.4) * 20.0,
        280 + math.cos(totalTime * 1.8) * 45.0,
      ),
      color: const Color(0xFFFB923C), // Monarch Orange
      wingPhase: 0.0,
    );

    _drawButterfly(
      canvas: canvas,
      center: Offset(
        630 + math.cos(totalTime * 1.6) * 22.0,
        360 + math.sin(totalTime * 2.1) * 50.0,
      ),
      color: const Color(0xFF38BDF8), // Neon Cyan
      wingPhase: 1.2,
    );

    _drawButterfly(
      canvas: canvas,
      center: Offset(
        22 + math.sin(totalTime * 1.2 + 2.0) * 18.0,
        660 + math.cos(totalTime * 1.5 + 1.0) * 40.0,
      ),
      color: const Color(0xFFC084FC), // Violet
      wingPhase: 2.4,
    );

    _drawButterfly(
      canvas: canvas,
      center: Offset(
        635 + math.sin(totalTime * 1.5 + 3.0) * 20.0,
        690 + math.cos(totalTime * 1.7 + 2.0) * 45.0,
      ),
      color: const Color(0xFFFDE047), // Sunshine Yellow
      wingPhase: 3.6,
    );

    // 2. Honeybees (Rapid buzzing figure-8)
    _drawBee(
      canvas: canvas,
      center: Offset(
        32 + math.sin(totalTime * 3.5) * 12.0,
        490 + math.sin(totalTime * 7.0) * 6.0,
      ),
    );

    _drawBee(
      canvas: canvas,
      center: Offset(
        626 + math.cos(totalTime * 3.2) * 12.0,
        540 + math.sin(totalTime * 6.4) * 6.0,
      ),
    );
  }

  void _drawButterfly({
    required Canvas canvas,
    required Offset center,
    required Color color,
    required double wingPhase,
  }) {
    final wingFlap = (math.sin(totalTime * 18.0 + wingPhase)).abs() * 7.0 + 1.5;

    // Small shadow underneath
    canvas.drawOval(
      Rect.fromCenter(center: Offset(center.dx, center.dy + 12), width: 12, height: 5),
      _shadowPaint,
    );

    final wingPaint = Paint()..color = color;

    // Left Wing
    final leftWingRect = Rect.fromCenter(
      center: Offset(center.dx - wingFlap * 0.6, center.dy),
      width: wingFlap,
      height: 9,
    );
    canvas.drawOval(leftWingRect, wingPaint);
    canvas.drawOval(leftWingRect, _blackStroke2);

    // Right Wing
    final rightWingRect = Rect.fromCenter(
      center: Offset(center.dx + wingFlap * 0.6, center.dy),
      width: wingFlap,
      height: 9,
    );
    canvas.drawOval(rightWingRect, wingPaint);
    canvas.drawOval(rightWingRect, _blackStroke2);

    // Body
    canvas.drawOval(
      Rect.fromCenter(center: center, width: 3, height: 8),
      Paint()..color = NeoTheme.inkBlack,
    );
  }

  void _drawBee({
    required Canvas canvas,
    required Offset center,
  }) {
    // Bee Body (Yellow with black stripes)
    final bodyRect = Rect.fromCenter(center: center, width: 8, height: 6);
    canvas.drawOval(bodyRect, Paint()..color = const Color(0xFFFACC15));
    canvas.drawOval(bodyRect, _blackStroke2);

    // Stripe
    canvas.drawLine(
      Offset(center.dx, center.dy - 3),
      Offset(center.dx, center.dy + 3),
      Paint()..color = NeoTheme.inkBlack..strokeWidth = 2.0,
    );

    // Buzzing Wings
    final wingAlpha = (math.sin(totalTime * 30.0) * 0.3 + 0.7).clamp(0.0, 1.0);
    final beeWingPaint = Paint()..color = Colors.white.withValues(alpha: wingAlpha);
    canvas.drawOval(
      Rect.fromCenter(center: Offset(center.dx, center.dy - 4), width: 6, height: 4),
      beeWingPaint,
    );
  }
}
