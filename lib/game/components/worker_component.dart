import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import 'dirt_puddle_component.dart';
import 'field_component.dart';
import 'processing_station_component.dart';
import 'shelf_component.dart';

class WorkerComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final WorkerRole role;
  final List<ProductItem> carriedItems = [];

  ProduceFieldComponent? targetField;
  ProcessingStationComponent? targetStation;
  ShelfComponent? targetShelf;
  DirtPuddleComponent? targetPuddle;

  double actionCooldown = 0.0;
  double walkCycle = 0.0;

  WorkerComponent({
    required this.role,
    required Vector2 spawnPosition,
  }) : super(
          position: spawnPosition,
          size: Vector2(44, 44),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  int get maxCapacity => game.playerData.getWorkerStats(role).capacity;
  double get moveSpeed => 125.0 * game.playerData.getWorkerStats(role).speedMultiplier;

  @override
  void update(double dt) {
    super.update(dt);
    walkCycle += dt * 10.0;

    switch (role) {
      case WorkerRole.farmer:
        _handleFarmerLoop(dt);
        break;
      case WorkerRole.stocker:
        _handleStockerLoop(dt);
        break;
      case WorkerRole.cashier:
        _handleCashierLoop(dt);
        break;
      case WorkerRole.cleaner:
        _handleCleanerLoop(dt);
        break;
    }

    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  /// Farmer: Harvests fields / pens -> drops in processing stations / storage
  void _handleFarmerLoop(double dt) {
    if (carriedItems.length < maxCapacity) {
      // Find ripe field
      final fields = game.fields.where((f) => f.isMounted).toList();
      if (fields.isNotEmpty) {
        targetField ??= fields.first;
        final standPos = targetField!.position + Vector2(0, 40);
        final diff = standPos - position;
        if (diff.length < 16.0) {
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
          _moveTo(standPos, dt);
        }
      }
    } else {
      final itemType = carriedItems.last.type;
      final stations = game.world.children
          .whereType<ProcessingStationComponent>()
          .where((s) => s.inputType == itemType && s.canAcceptInput)
          .toList();

      if (stations.isNotEmpty) {
        targetStation ??= stations.first;
        final standPos = targetStation!.position + Vector2(0, 36);
        final diff = standPos - position;
        if (diff.length < 16.0) {
          actionCooldown -= dt;
          if (actionCooldown <= 0) {
            actionCooldown = 0.14;
            if (carriedItems.isNotEmpty && targetStation!.canAcceptInput && targetStation!.inputType == carriedItems.last.type) {
              final item = carriedItems.removeLast();
              targetStation!.inputBuffer.add(item);
              SoundService.playStockShelf();
            } else {
              targetStation = null;
            }
          }
        } else {
          _moveTo(standPos, dt);
        }
      } else {
        // Drop to matching shelf directly
        final shelves = game.shelves
            .where((s) => s.isMounted && s.productType == itemType && !s.isFull)
            .toList();

        if (shelves.isNotEmpty) {
          targetShelf ??= shelves.first;
          final standPos = targetShelf!.position + Vector2(0, 38);
          final diff = standPos - position;
          if (diff.length < 16.0) {
            actionCooldown -= dt;
            if (actionCooldown <= 0) {
              actionCooldown = 0.14;
              if (carriedItems.isNotEmpty && !targetShelf!.isFull && targetShelf!.productType == carriedItems.last.type) {
                final item = carriedItems.removeLast();
                targetShelf!.storedItems.add(item);
                SoundService.playStockShelf();
              } else {
                targetShelf = null;
              }
            }
          } else {
            _moveTo(standPos, dt);
          }
        } else {
          targetShelf = null;
          targetStation = null;
        }
      }
    }
  }

  /// Stocker: Picks finished products from processing stations -> restocks market shelves
  void _handleStockerLoop(double dt) {
    if (carriedItems.length < maxCapacity) {
      final stations = game.world.children.whereType<ProcessingStationComponent>().where((s) => s.hasOutput).toList();
      if (stations.isNotEmpty) {
        targetStation ??= stations.first;
        final standPos = targetStation!.position + Vector2(0, 36);
        final diff = standPos - position;
        if (diff.length < 16.0) {
          actionCooldown -= dt;
          if (actionCooldown <= 0) {
            actionCooldown = 0.14;
            if (targetStation!.hasOutput && carriedItems.length < maxCapacity) {
              final item = targetStation!.outputBuffer.removeLast();
              carriedItems.add(item);
              SoundService.playHarvest();
            } else {
              targetStation = null;
            }
          }
        } else {
          _moveTo(standPos, dt);
        }
      } else {
        // Fallback: Help restock raw crops to shelves
        _handleFarmerLoop(dt);
      }
    } else {
      final itemType = carriedItems.last.type;
      final shelves = game.shelves
          .where((s) => s.isMounted && s.productType == itemType && !s.isFull)
          .toList();

      if (shelves.isNotEmpty) {
        targetShelf ??= shelves.first;
        final standPos = targetShelf!.position + Vector2(0, 38);
        final diff = standPos - position;
        if (diff.length < 16.0) {
          actionCooldown -= dt;
          if (actionCooldown <= 0) {
            actionCooldown = 0.14;
            if (carriedItems.isNotEmpty && !targetShelf!.isFull && targetShelf!.productType == carriedItems.last.type) {
              final item = carriedItems.removeLast();
              targetShelf!.storedItems.add(item);
              SoundService.playStockShelf();
            } else {
              targetShelf = null;
            }
          }
        } else {
          _moveTo(standPos, dt);
        }
      } else {
        targetShelf = null;
      }
    }
  }

  /// Cashier: Stands at POS and accelerates checkout
  void _handleCashierLoop(double dt) {
    final standPos = game.cashier.cashierStandPosition;
    final diff = standPos - position;
    if (diff.length > 4.0) {
      _moveTo(standPos, dt);
    }
  }

  /// Cleaner: Searches for dirt puddles and sweeps them
  void _handleCleanerLoop(double dt) {
    final puddles = game.world.children.whereType<DirtPuddleComponent>().toList();
    if (puddles.isNotEmpty) {
      targetPuddle ??= puddles.first;
      if (!targetPuddle!.isMounted) {
        targetPuddle = null;
        return;
      }
      final diff = targetPuddle!.position - position;
      if (diff.length < 16.0) {
        targetPuddle!.progressClean(dt * 2.0);
      } else {
        _moveTo(targetPuddle!.position, dt);
      }
    } else {
      // Idle patrol around store center
      final patrolPos = Vector2(game.worldWidth * 0.7, game.worldHeight * 0.5);
      if ((patrolPos - position).length > 20.0) {
        _moveTo(patrolPos, dt);
      }
    }
  }

  void _moveTo(Vector2 target, double dt) {
    final diff = target - position;
    if (diff.length > 2.0) {
      final vel = diff.normalized() * moveSpeed;
      position.setFrom(
        game.physicsWorld.resolveMovement(
          currentPos: position,
          velocity: vel,
          dt: dt,
          radius: 14.0,
          worldMinX: 40.0,
          worldMaxX: game.worldWidth - 40.0,
          worldMinY: 140.0,
          worldMaxY: game.worldHeight - 60.0,
        ),
      );
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
    final bodyColor = role.color;
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

    // 4. Carried Items Stack
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
