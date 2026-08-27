import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import 'cashier_component.dart';
import 'shelf_component.dart';

enum CustomerState {
  walkingToShelf,
  shoppingAtShelf,
  walkingToQueue,
  waitingInQueue,
  payingAtRegister,
  leavingStore,
}

class CustomerComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  CustomerState state = CustomerState.walkingToShelf;
  final List<ProductItem> shoppingBasket = [];
  final int desiredItemCount;
  final Color shirtColor;

  ShelfComponent? targetShelf;
  CashierComponent? targetCashier;
  int queueIndex = 0;

  double actionTimer = 0.0;
  double walkCycle = 0.0;
  final double moveSpeed = 105.0;

  CustomerComponent({
    required Vector2 spawnPosition,
    required this.desiredItemCount,
    required this.shirtColor,
  }) : super(
          position: spawnPosition,
          size: Vector2(40, 40),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  @override
  void update(double dt) {
    super.update(dt);
    walkCycle += dt * 10.0;

    switch (state) {
      case CustomerState.walkingToShelf:
        _handleWalkingToShelf(dt);
        break;
      case CustomerState.shoppingAtShelf:
        _handleShoppingAtShelf(dt);
        break;
      case CustomerState.walkingToQueue:
        _handleWalkingToQueue(dt);
        break;
      case CustomerState.waitingInQueue:
        _handleWaitingInQueue(dt);
        break;
      case CustomerState.payingAtRegister:
        _handlePayingAtRegister(dt);
        break;
      case CustomerState.leavingStore:
        _handleLeavingStore(dt);
        break;
    }

    priority = IsometricMath.calculatePriority(position.x, position.y);
  }

  void _handleWalkingToShelf(double dt) {
    if (targetShelf == null) {
      final shelves = game.shelves.where((s) => s.isMounted).toList();
      if (shelves.isNotEmpty) {
        targetShelf = shelves[math.Random().nextInt(shelves.length)];
      } else {
        state = CustomerState.leavingStore;
        return;
      }
    }

    final shelfStandPos = targetShelf!.position + Vector2(0, 42);
    final diff = shelfStandPos - position;
    if (diff.length < 12.0) {
      position.setFrom(shelfStandPos);
      state = CustomerState.shoppingAtShelf;
      actionTimer = 0.0;
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

  void _handleShoppingAtShelf(double dt) {
    actionTimer += dt;
    if (actionTimer >= 0.4) {
      actionTimer = 0.0;
      if (targetShelf != null && targetShelf!.hasStock) {
        final item = targetShelf!.takeProduct();
        if (item != null) {
          shoppingBasket.add(item);
          SoundService.playHarvest();
        }
      }

      if (shoppingBasket.length >= desiredItemCount || (targetShelf != null && !targetShelf!.hasStock)) {
        if (shoppingBasket.isNotEmpty) {
          state = CustomerState.walkingToQueue;
          targetCashier = game.cashier;
        } else {
          state = CustomerState.leavingStore;
        }
      }
    }
  }

  void _handleWalkingToQueue(double dt) {
    if (targetCashier == null) {
      state = CustomerState.leavingStore;
      return;
    }

    final queuePos = _calculateQueuePosition();
    final diff = queuePos - position;
    if (diff.length < 12.0) {
      position.setFrom(queuePos);
      state = CustomerState.waitingInQueue;
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

  void _handleWaitingInQueue(double dt) {
    final queuePos = _calculateQueuePosition();
    final diff = queuePos - position;
    if (diff.length > 5.0) {
      final vel = diff.normalized() * moveSpeed;
      position.add(vel * dt);
    }

    if (queueIndex == 0 && targetCashier != null && targetCashier!.isCashierPresent) {
      state = CustomerState.payingAtRegister;
      actionTimer = 0.0;
    }
  }

  void _handlePayingAtRegister(double dt) {
    if (targetCashier == null || !targetCashier!.isCashierPresent) {
      return;
    }

    actionTimer += dt;
    if (actionTimer >= 0.35) {
      actionTimer = 0.0;
      if (shoppingBasket.isNotEmpty) {
        final item = shoppingBasket.removeLast();
        final price = item.type.basePrice;
        targetCashier!.addCash(price);
        SoundService.playStockShelf();
      } else {
        state = CustomerState.leavingStore;
        game.onCustomerServed(this);
      }
    }
  }

  void _handleLeavingStore(double dt) {
    final exitDoor = game.entrancePosition + Vector2(0, 20);
    final diff = exitDoor - position;
    if (diff.length < 18.0) {
      game.removeCustomer(this);
      removeFromParent();
    } else {
      final vel = diff.normalized() * moveSpeed;
      position.add(vel * dt);
    }
  }

  Vector2 _calculateQueuePosition() {
    if (targetCashier == null) return position;
    final queueStart = targetCashier!.customerQueueStart;
    return queueStart + Vector2(-32.0 * queueIndex, 0);
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

    // 2. Torso / Shirt
    final bodyRect = Rect.fromCenter(center: Offset(cx, cy + 2), width: 22, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(shirtColor),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 2.0,
    );

    // 3. Head
    final headRect = Rect.fromCenter(center: Offset(cx, cy - 10), width: 18, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFE0B2)),
      strokePaint: NeoTheme.stroke(width: 2.2),
      shadowOffset: 1.5,
    );

    // 4. 2.5D Isometric Shopping Basket
    if (shoppingBasket.isNotEmpty) {
      final basketRect = Rect.fromCenter(center: Offset(cx + 14, cy + 6), width: 15, height: 12);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(basketRect, const Radius.circular(2)),
        fillPaint: NeoTheme.fill(const Color(0xFFFFB703)),
        strokePaint: NeoTheme.stroke(width: 1.8),
        shadowOffset: 1.5,
      );

      // 2.5D item in basket
      final topItem = shoppingBasket.last;
      final miniItemRect = Rect.fromCenter(center: Offset(cx + 14, cy + 2), width: 8, height: 8);
      canvas.drawRect(miniItemRect, Paint()..color = topItem.type.color);
      canvas.drawRect(miniItemRect, NeoTheme.stroke(width: 1.2));
    }
  }
}
