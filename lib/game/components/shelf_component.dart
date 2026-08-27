import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

class ShelfComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  final ProductType productType;
  final int maxCapacity;
  final List<ProductItem> storedItems = [];

  double restockCooldown = 0.0;

  ShelfComponent({
    required this.id,
    required this.productType,
    required Vector2 position,
    this.maxCapacity = 12,
  }) : super(
          position: position,
          size: Vector2(100, 80),
          anchor: Anchor.center,
          priority: 50,
        );

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
  void update(double dt) {
    super.update(dt);

    // Unload from player to shelf
    restockCooldown -= dt;
    if (restockCooldown <= 0 && !isFull) {
      final player = game.player;
      final dist = (player.position - position).length;

      if (dist < 65.0 && player.carriedItems.isNotEmpty) {
        if (player.carriedItems.last.type == productType) {
          final item = player.takeTopProduct();
          if (item != null) {
            storedItems.add(item);
            restockCooldown = 0.12; // Fast restock cadence
            SoundService.playStockShelf();
            HapticService.light();

            // Spawn floating text on restock
            game.world.add(
              FloatingTextComponent(
                text: '+1 ${productType.displayName}',
                position: position - Vector2(0, 30),
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
    // 1. Shelf Base Rack
    final rackRect = Rect.fromCenter(center: const Offset(50, 40), width: 96, height: 74);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(rackRect, const Radius.circular(8)),
      fillPaint: NeoTheme.fill(NeoTheme.woodShelf),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 4.0,
    );

    // Inner Shelving Compartments
    final innerRect = Rect.fromCenter(center: const Offset(50, 42), width: 84, height: 58);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(innerRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(const Color(0xFFD49757)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 0,
    );

    // 2. Render Stored Items Grid (2 Rows x 6 Columns)
    final itemCount = storedItems.length;
    for (int i = 0; i < itemCount; i++) {
      final row = i ~/ 6;
      final col = i % 6;
      final cx = 17.0 + col * 13.0;
      final cy = 28.0 + row * 22.0;

      final itemRect = Rect.fromCenter(center: Offset(cx, cy), width: 11, height: 16);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(itemRect, const Radius.circular(2)),
        fillPaint: NeoTheme.fill(productType.color),
        strokePaint: NeoTheme.stroke(width: 1.5),
        shadowOffset: 1.5,
      );
    }

    // 3. Header Badge (Stock Count: e.g. "🍅 8/12")
    final badgeText = '${productType.emoji} $currentStock/$maxCapacity';
    final textSpan = TextSpan(
      text: badgeText,
      style: TextStyle(
        color: isFull ? NeoTheme.cashGreen : (currentStock == 0 ? NeoTheme.tomatoRed : NeoTheme.inkBlack),
        fontSize: 10,
        fontWeight: FontWeight.w900,
      ),
    );
    final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
    tp.layout();

    final badgeRect = Rect.fromCenter(center: const Offset(50, -4), width: tp.width + 12, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(badgeRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    tp.paint(canvas, Offset(50 - tp.width / 2, -4 - tp.height / 2));
  }
}
