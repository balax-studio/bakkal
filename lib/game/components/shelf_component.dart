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

class ShelfComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final ProductType productType;
  final int maxCapacity;
  final List<ProductItem> storedItems = [];

  double restockCooldown = 0.0;
  late final SolidBox solidCollider;

  ShelfComponent({
    required this.id,
    required this.productType,
    required Vector2 position,
    this.maxCapacity = 12,
  }) : super(
          position: position,
          size: Vector2(110, 85),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    // Solid obstacle bounds for physics collision
    solidCollider = SolidBox(
      id: id,
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 2),
        width: 80,
        height: 52,
      ),
      label: '${productType.displayName} Shelf',
    );
  }

  int get currentStock => storedItems.length;
  bool get isFull => currentStock >= maxCapacity;
  bool get hasStock => storedItems.isNotEmpty;

  ProductItem? takeProduct() {
    if (storedItems.isNotEmpty) {
      return storedItems.removeLast();
    }
    return null;
  }

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    game.physicsWorld.addObstacle(solidCollider);
  }

  @override
  void onRemove() {
    game.physicsWorld.removeObstacle(id);
    super.onRemove();
  }

  @override
  void update(double dt) {
    super.update(dt);

    // Unload from player to shelf when player stands in proximity
    restockCooldown -= dt;
    if (restockCooldown <= 0 && !isFull) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 72.0 && player.carriedItems.isNotEmpty) {
        if (player.carriedItems.last.type == productType) {
          final item = player.takeTopProduct();
          if (item != null) {
            storedItems.add(item);
            restockCooldown = 0.12;
            SoundService.playStockShelf();
            HapticService.light();

            game.world.add(
              FloatingTextComponent(
                text: '+1 ${productType.displayName}',
                position: position - Vector2(0, 35),
                color: NeoTheme.cornYellow,
              ),
            );
          }
        }
      }
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 90.0;
    const h = 48.0;
    const depth = 22.0; // 2.5D vertical shelf height

    // 1. Drop Shadow
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 4)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 4)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Front-Left Face (Wood Shelf Stand)
    final leftSidePath = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSidePath, Paint()..color = const Color(0xFFD98E48));
    canvas.drawPath(leftSidePath, NeoTheme.stroke(width: 3.0));

    // 3. Front-Right Face (Darker wood for 2.5D light source)
    final rightSidePath = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSidePath, Paint()..color = const Color(0xFFB87030));
    canvas.drawPath(rightSidePath, NeoTheme.stroke(width: 3.0));

    // 4. Top Isometric Tray Face
    final topTrayPath = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topTrayPath, Paint()..color = const Color(0xFFF2B06D));
    canvas.drawPath(topTrayPath, NeoTheme.stroke(width: 3.0));

    // Inner tray recess
    final innerTrayPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 5)
      ..lineTo(cx + w * 0.5 - 8, cy)
      ..lineTo(cx, cy + h * 0.5 - 5)
      ..lineTo(cx - w * 0.5 + 8, cy)
      ..close();
    canvas.drawPath(innerTrayPath, Paint()..color = const Color(0xFFDC9550));

    // 5. Render 2.5D Stored Product Isometric Blocks
    final itemCount = storedItems.length;
    final maxColumns = 6;
    for (int i = 0; i < itemCount; i++) {
      final row = i ~/ maxColumns;
      final col = i % maxColumns;

      final isoOffX = -20.0 + (col * 7.0) - (row * 6.0);
      final isoOffY = -4.0 + (col * 3.5) + (row * 8.0);

      final itemCenter = Offset(cx + isoOffX, cy + isoOffY);

      // 2.5D Product Block
      final itemRect = Rect.fromCenter(center: itemCenter, width: 10, height: 12);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(itemRect, const Radius.circular(2)),
        fillPaint: NeoTheme.fill(productType.color),
        strokePaint: NeoTheme.stroke(width: 1.5),
        shadowOffset: 1.5,
      );
    }

    // 6. 2.5D Stock Header Badge
    final badgeText = '${productType.displayName}: $currentStock/$maxCapacity';
    final textSpan = TextSpan(
      text: badgeText,
      style: TextStyle(
        color: isFull ? NeoTheme.cashGreen : (currentStock == 0 ? NeoTheme.tomatoRed : NeoTheme.inkBlack),
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
    tp.layout();

    final badgeRect = Rect.fromCenter(center: Offset(cx, cy - h * 0.5 - 10), width: tp.width + 12, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(badgeRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    tp.paint(canvas, Offset(cx - tp.width / 2, cy - h * 0.5 - 10 - tp.height / 2));
  }
}
