import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import 'field_component.dart';
import 'shelf_component.dart';

enum WorkerRole {
  restocker,
  cashier,
}

class WorkerComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final WorkerRole role;
  final List<ProductItem> carriedItems = [];
  final int maxCapacity = 4;
  final double moveSpeed = 125.0;

  ProduceFieldComponent? targetField;
  ShelfComponent? targetShelf;
  double actionCooldown = 0.0;
  double walkCycle = 0.0;

  WorkerComponent({
    required this.role,
    required Vector2 spawnPosition,
  }) : super(
          position: spawnPosition,
          size: Vector2(42, 42),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  @override
  void update(double dt) {
    super.update(dt);
    walkCycle += dt * 10.0;

    if (role == WorkerRole.restocker) {
      _handleRestockerLoop(dt);
    } else {
      _handleCashierLoop(dt);
    }

    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  void _handleRestockerLoop(double dt) {
    if (carriedItems.length < maxCapacity) {
      // 1. Walk to an available field to harvest
      final fields = game.fields.where((f) => f.isMounted).toList();
      if (fields.isNotEmpty) {
        targetField ??= fields.first;
        final standPos = targetField!.position + Vector2(0, 40);
        final diff = standPos - position;
        if (diff.length < 15.0) {
          actionCooldown -= dt;
          if (actionCooldown <= 0) {
            actionCooldown = 0.18;
            for (int i = 0; i < targetField!.slotCount; i++) {
              if (targetField!.isRipe[i] && carriedItems.length < maxCapacity) {
                targetField!.isRipe[i] = false;
                targetField!.cropTimers[i] = 0.0;
                carriedItems.add(ProductItem(type: targetField!.productType));
                SoundService.playHarvest();
                break;
              }
            }
          }
        } else {
          final vel = diff.normalized() * moveSpeed;
          position.setFrom(
            game.physicsWorld.resolveMovement(
              currentPos: position,
              velocity: vel,
              dt: dt,
              radius: 14.0,
              worldMinX: 60.0,
              worldMaxX: game.worldWidth - 60.0,
              worldMinY: 160.0,
              worldMaxY: game.worldHeight - 80.0,
            ),
          );
        }
      }
    } else {
      // 2. Full backpack: walk to target shelf to restock
      final shelves = game.shelves.where((s) => s.isMounted && !s.isFull).toList();
      if (shelves.isNotEmpty) {
        targetShelf ??= shelves.first;
        final standPos = targetShelf!.position + Vector2(0, 38);
        final diff = standPos - position;
        if (diff.length < 15.0) {
          actionCooldown -= dt;
          if (actionCooldown <= 0) {
            actionCooldown = 0.14;
            if (carriedItems.isNotEmpty && !targetShelf!.isFull) {
              final item = carriedItems.removeLast();
              targetShelf!.storedItems.add(item);
              SoundService.playStockShelf();
            } else {
              targetShelf = null;
              targetField = null;
            }
          }
        } else {
          final vel = diff.normalized() * moveSpeed;
          position.setFrom(
            game.physicsWorld.resolveMovement(
              currentPos: position,
              velocity: vel,
              dt: dt,
              radius: 14.0,
              worldMinX: 60.0,
              worldMaxX: game.worldWidth - 60.0,
              worldMinY: 160.0,
              worldMaxY: game.worldHeight - 80.0,
            ),
          );
        }
      }
    }
  }

  void _handleCashierLoop(double dt) {
    final standPos = game.cashier.cashierStandPosition;
    final diff = standPos - position;
    if (diff.length > 4.0) {
      final vel = diff.normalized() * moveSpeed;
      position.add(vel * dt);
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5;

    // 1. 2.5D Isometric Ground Shadow
    canvas.drawOval(
      Rect.fromCenter(center: Offset(cx, cy + 14), width: 30, height: 14),
      NeoTheme.shadowPaint,
    );

    // 2. Uniform Body
    final bodyColor = role == WorkerRole.restocker ? NeoTheme.cornYellow : NeoTheme.purpleAccent;
    final bodyRect = Rect.fromCenter(center: Offset(cx, cy + 2), width: 24, height: 20);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(bodyColor),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 2.0,
    );

    // Apron badge
    canvas.drawRect(
      Rect.fromCenter(center: Offset(cx, cy + 3), width: 14, height: 12),
      Paint()..color = Colors.white,
    );
    canvas.drawRect(
      Rect.fromCenter(center: Offset(cx, cy + 3), width: 14, height: 12),
      NeoTheme.stroke(width: 1.5),
    );

    // 3. Head & Cap
    final headRect = Rect.fromCenter(center: Offset(cx, cy - 10), width: 18, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFD1A4)),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 1.5,
    );

    final capRect = Rect.fromCenter(center: Offset(cx, cy - 16), width: 22, height: 8);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(capRect, const Radius.circular(3)),
      fillPaint: NeoTheme.fill(bodyColor),
      strokePaint: NeoTheme.stroke(width: 1.8),
      shadowOffset: 1.5,
    );

    // 4. 2.5D Carried Crates Stack
    if (carriedItems.isNotEmpty) {
      for (int i = 0; i < carriedItems.length; i++) {
        final crateRect = Rect.fromCenter(
          center: Offset(cx, cy - 24.0 - (i * 10.0)),
          width: 20,
          height: 10,
        );
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(crateRect, const Radius.circular(2)),
          fillPaint: NeoTheme.fill(carriedItems[i].type.color),
          strokePaint: NeoTheme.stroke(width: 1.5),
          shadowOffset: 1.5,
        );
      }
    }
  }
}
