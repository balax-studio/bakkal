import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
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
  final double moveSpeed = 110.0;

  CustomerComponent({
    required Vector2 spawnPosition,
    required this.desiredItemCount,
    required this.shirtColor,
  }) : super(
          position: spawnPosition,
          size: Vector2(36, 36),
          anchor: Anchor.center,
          priority: 80,
        );

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

    final shelfStandPos = targetShelf!.position + Vector2(0, 45);
    final diff = shelfStandPos - position;
    if (diff.length < 10.0) {
      position = shelfStandPos;
      state = CustomerState.shoppingAtShelf;
      actionTimer = 0.0;
    } else {
      position.add(diff.normalized() * moveSpeed * dt);
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
    if (diff.length < 10.0) {
      position = queuePos;
      state = CustomerState.waitingInQueue;
    } else {
      position.add(diff.normalized() * moveSpeed * dt);
    }
  }

  void _handleWaitingInQueue(double dt) {
    final queuePos = _calculateQueuePosition();
    final diff = queuePos - position;
    if (diff.length > 5.0) {
      position.add(diff.normalized() * moveSpeed * dt);
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
    final exitDoor = game.entrancePosition + Vector2(-60, 0);
    final diff = exitDoor - position;
    if (diff.length < 15.0) {
      game.removeCustomer(this);
      removeFromParent();
    } else {
      position.add(diff.normalized() * moveSpeed * dt);
    }
  }

  Vector2 _calculateQueuePosition() {
    if (targetCashier == null) return position;
    final queueStart = targetCashier!.position + Vector2(-55, 0);
    return queueStart + Vector2(-36.0 * queueIndex, 0);
  }

  @override
  void render(Canvas canvas) {
    // 1. Shadow
    canvas.drawOval(
      Rect.fromCenter(center: const Offset(18, 34), width: 28, height: 12),
      Paint()..color = NeoTheme.shadowBlack,
    );

    // 2. Body / Shirt
    final bodyRect = Rect.fromCenter(center: const Offset(18, 22), width: 22, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(bodyRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(shirtColor),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 2.0,
    );

    // 3. Head
    final headRect = Rect.fromCenter(center: const Offset(18, 10), width: 18, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFFFFE0B2)),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 1.5,
    );

    // 4. Shopping Basket / Bag
    if (shoppingBasket.isNotEmpty) {
      final basketRect = Rect.fromCenter(center: const Offset(28, 24), width: 14, height: 12);
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(basketRect, const Radius.circular(2)),
        fillPaint: NeoTheme.fill(NeoTheme.goldCoin),
        strokePaint: NeoTheme.stroke(width: 1.5),
        shadowOffset: 1.0,
      );

      // Draw mini colored product cube inside basket
      final miniCube = Rect.fromCenter(
        center: const Offset(18, -8),
        width: 8,
        height: 8,
      );
      NeoTheme.drawNeoRRect(
        canvas,
        RRect.fromRectAndRadius(miniCube, const Radius.circular(2)),
        fillPaint: NeoTheme.fill(shoppingBasket.first.type.color),
        strokePaint: NeoTheme.stroke(width: 1.0),
        shadowOffset: 0,
      );
    }
  }
}
