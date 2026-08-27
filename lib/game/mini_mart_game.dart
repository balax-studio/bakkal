import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/theme/neo_theme.dart';
import '../domain/models/game_models.dart';
import '../services/ad_service.dart';
import '../services/save_service.dart';
import 'components/cashier_component.dart';
import 'components/customer_component.dart';
import 'components/field_component.dart';
import 'components/player_component.dart';
import 'components/shelf_component.dart';
import 'components/truck_component.dart';
import 'components/unlock_pad_component.dart';
import 'components/worker_component.dart';

class MiniMartGame extends FlameGame with KeyboardEvents {
  final PlayerData playerData;
  final AdService adService = AdService.instance;

  // Reactive State Notifiers for Flutter UI Overlays
  final ValueNotifier<int> cashNotifier = ValueNotifier<int>(0);
  final ValueNotifier<int> marketLevelNotifier = ValueNotifier<int>(0);
  final ValueNotifier<bool> showLevelCompleteModal = ValueNotifier<bool>(false);
  final ValueNotifier<bool> showUpgradesModal = ValueNotifier<bool>(false);

  // World dimensions
  final double worldWidth = 650.0;
  final double worldHeight = 900.0;

  // Joystick direction (updated via Virtual Joystick or Keyboard)
  Vector2 joystickDirection = Vector2.zero();
  final Set<LogicalKeyboardKey> _pressedKeys = {};

  // Core entities
  late PlayerComponent player;
  late CashierComponent cashier;
  final List<ProduceFieldComponent> fields = [];
  final List<ShelfComponent> shelves = [];
  final List<CustomerComponent> customers = [];
  final List<WorkerComponent> workers = [];
  final List<UnlockPadComponent> unlockPads = [];
  TruckComponent? truck;

  // Customer Spawning
  final Vector2 entrancePosition = Vector2(325, 840);
  double customerSpawnTimer = 0.0;
  final double customerSpawnInterval = 3.5;
  final int maxCustomers = 5;

  MiniMartGame({required this.playerData});

  @override
  Color backgroundColor() => NeoTheme.bgCanvas;

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    cashNotifier.value = playerData.cash;
    marketLevelNotifier.value = playerData.activeMarketIndex;

    // 1. Build Market World Elements
    _buildMarketLevel();

    // 2. Setup Camera
    camera.viewfinder.anchor = Anchor.center;
    camera.viewfinder.zoom = 1.0;
    camera.follow(player);
  }

  void _buildMarketLevel() {
    // Clear any existing entities
    final componentsToRemove = world.children.whereType<Component>().toList();
    for (final c in componentsToRemove) {
      c.removeFromParent();
    }
    fields.clear();
    shelves.clear();
    customers.clear();
    workers.clear();
    unlockPads.clear();

    // 0. Store Floor (World coordinates, lowest priority)
    world.add(
      StoreFloorComponent(
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        entrancePosition: entrancePosition,
      ),
    );

    // 1. Player Spawning
    player = PlayerComponent(position: Vector2(325, 600));
    world.add(player);

    // 2. Cashier Counter
    cashier = CashierComponent(id: 'cashier_1', position: Vector2(325, 720));
    world.add(cashier);

    // 3. Delivery Truck (Market milestone)
    truck = TruckComponent(position: Vector2(325, 120), requiredItems: 25);
    world.add(truck!);

    // Level-specific setups
    final marketIdx = playerData.activeMarketIndex;
    if (marketIdx == 0) {
      _setupMarket1OrganikManav();
    } else if (marketIdx == 1) {
      _setupMarket2FirinKafe();
    } else {
      _setupMarket3MegaMart();
    }

    _spawnExistingWorkers();
  }

  void _setupMarket1OrganikManav() {
    // Tomato Field 1 (Always unlocked at start)
    final fieldTomato1 = ProduceFieldComponent(
      id: 'field_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(160, 320),
    );
    fields.add(fieldTomato1);
    world.add(fieldTomato1);

    // Tomato Shelf 1 (Unlocked at start)
    final shelfTomato1 = ShelfComponent(
      id: 'shelf_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(160, 520),
    );
    shelves.add(shelfTomato1);
    world.add(shelfTomato1);

    // Unlock Pad for Corn Field (Cost: $40)
    _addUnlockPad(
      unlockId: 'field_corn_1',
      title: 'Mısır Tarlası',
      totalCost: 40,
      position: Vector2(490, 320),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_corn_1',
          productType: ProductType.corn,
          position: Vector2(490, 320),
        );
        fields.add(f);
        world.add(f);
      },
    );

    // Unlock Pad for Corn Shelf (Cost: $60)
    _addUnlockPad(
      unlockId: 'shelf_corn_1',
      title: 'Mısır Reyonu',
      totalCost: 60,
      position: Vector2(490, 520),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_corn_1',
          productType: ProductType.corn,
          position: Vector2(490, 520),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // Unlock Pad for Auto-Restocker Worker (Cost: $100)
    _addUnlockPad(
      unlockId: 'worker_restocker_1',
      title: 'Reyon Görevlisi',
      totalCost: 100,
      position: Vector2(160, 720),
      onUnlock: () {
        final w = WorkerComponent(
          role: WorkerRole.restocker,
          spawnPosition: Vector2(160, 720),
        );
        workers.add(w);
        world.add(w);
      },
    );

    // Unlock Pad for Auto-Cashier Worker (Cost: $150)
    _addUnlockPad(
      unlockId: 'worker_cashier_1',
      title: 'Otomatik Kasiyer',
      totalCost: 150,
      position: Vector2(490, 720),
      onUnlock: () {
        final w = WorkerComponent(
          role: WorkerRole.cashier,
          spawnPosition: cashier.cashierStandPosition,
        );
        workers.add(w);
        world.add(w);
      },
    );
  }

  void _setupMarket2FirinKafe() {
    // Bread Bakery Plot
    final fieldBread1 = ProduceFieldComponent(
      id: 'field_bread_1',
      productType: ProductType.bread,
      position: Vector2(160, 320),
    );
    fields.add(fieldBread1);
    world.add(fieldBread1);

    // Bread Shelf
    final shelfBread1 = ShelfComponent(
      id: 'shelf_bread_1',
      productType: ProductType.bread,
      position: Vector2(160, 520),
    );
    shelves.add(shelfBread1);
    world.add(shelfBread1);

    // Unlock Pad for Espresso Machine (Cost: $120)
    _addUnlockPad(
      unlockId: 'field_coffee_1',
      title: 'Espresso Barı',
      totalCost: 120,
      position: Vector2(490, 320),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_coffee_1',
          productType: ProductType.coffee,
          position: Vector2(490, 320),
        );
        fields.add(f);
        world.add(f);
      },
    );

    // Unlock Pad for Coffee Shelf (Cost: $160)
    _addUnlockPad(
      unlockId: 'shelf_coffee_1',
      title: 'Kahve Reyonu',
      totalCost: 160,
      position: Vector2(490, 520),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_coffee_1',
          productType: ProductType.coffee,
          position: Vector2(490, 520),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // Workers for Market 2
    _addUnlockPad(
      unlockId: 'worker_restocker_2',
      title: 'Fırın Çırağı',
      totalCost: 200,
      position: Vector2(160, 720),
      onUnlock: () {
        final w = WorkerComponent(
          role: WorkerRole.restocker,
          spawnPosition: Vector2(160, 720),
        );
        workers.add(w);
        world.add(w);
      },
    );
  }

  void _setupMarket3MegaMart() {
    // Multi-category mega market setup
    final f1 = ProduceFieldComponent(id: 'field_tomato_3', productType: ProductType.tomato, position: Vector2(160, 260));
    final f2 = ProduceFieldComponent(id: 'field_corn_3', productType: ProductType.corn, position: Vector2(490, 260));
    final f3 = ProduceFieldComponent(id: 'field_bread_3', productType: ProductType.bread, position: Vector2(160, 420));
    final f4 = ProduceFieldComponent(id: 'field_coffee_3', productType: ProductType.coffee, position: Vector2(490, 420));

    fields.addAll([f1, f2, f3, f4]);
    world.addAll([f1, f2, f3, f4]);

    final s1 = ShelfComponent(id: 'shelf_tomato_3', productType: ProductType.tomato, position: Vector2(160, 560));
    final s2 = ShelfComponent(id: 'shelf_bread_3', productType: ProductType.bread, position: Vector2(490, 560));
    shelves.addAll([s1, s2]);
    world.addAll([s1, s2]);
  }

  void _addUnlockPad({
    required String unlockId,
    required String title,
    required int totalCost,
    required Vector2 position,
    required VoidCallback onUnlock,
  }) {
    if (playerData.unlockedAreas.contains(unlockId)) {
      // Already unlocked in previous session, execute builder directly
      onUnlock();
    } else {
      final pad = UnlockPadComponent(
        unlockId: unlockId,
        title: title,
        totalCost: totalCost,
        position: position,
        onUnlocked: onUnlock,
      );
      unlockPads.add(pad);
      world.add(pad);
    }
  }

  void _spawnExistingWorkers() {
    if (playerData.unlockedAreas.contains('worker_restocker_1')) {
      final w = WorkerComponent(role: WorkerRole.restocker, spawnPosition: Vector2(160, 720));
      workers.add(w);
      world.add(w);
    }
    if (playerData.unlockedAreas.contains('worker_cashier_1')) {
      final w = WorkerComponent(role: WorkerRole.cashier, spawnPosition: cashier.cashierStandPosition);
      workers.add(w);
      world.add(w);
    }
  }

  @override
  void update(double dt) {
    super.update(dt);

    // 1. Keyboard Input Handling
    _updateKeyboardDirection();

    // 2. Customer Spawner
    customerSpawnTimer += dt;
    if (customerSpawnTimer >= customerSpawnInterval) {
      customerSpawnTimer = 0.0;
      if (customers.length < maxCustomers && shelves.isNotEmpty) {
        _spawnCustomer();
      }
    }

    // 3. Keep Customer Queue in Order
    _updateCustomerQueueIndices();
  }

  void _spawnCustomer() {
    final rand = math.Random();
    final desiredCount = 1 + rand.nextInt(2);
    final shirtColors = [
      NeoTheme.tomatoRed,
      NeoTheme.cornYellow,
      NeoTheme.purpleAccent,
      NeoTheme.coralOrange,
      const Color(0xFF06B6D4),
    ];
    final color = shirtColors[rand.nextInt(shirtColors.length)];

    final customer = CustomerComponent(
      spawnPosition: entrancePosition.clone(),
      desiredItemCount: desiredCount,
      shirtColor: color,
    );
    customers.add(customer);
    world.add(customer);
  }

  void _updateCustomerQueueIndices() {
    final queuedCustomers = customers.where((c) => c.state == CustomerState.waitingInQueue || c.state == CustomerState.payingAtRegister).toList();
    for (int i = 0; i < queuedCustomers.length; i++) {
      queuedCustomers[i].queueIndex = i;
    }
  }

  void onCustomerServed(CustomerComponent customer) {
    // Customer finished checkout and is exiting
  }

  void removeCustomer(CustomerComponent customer) {
    customers.remove(customer);
  }

  void onLevelGoalCompleted() {
    overlays.add('levelComplete');
  }

  void advanceToNextMarket() {
    overlays.remove('levelComplete');
    playerData.activeMarketIndex = (playerData.activeMarketIndex + 1) % 3;
    marketLevelNotifier.value = playerData.activeMarketIndex;
    saveGame();
    _buildMarketLevel();
  }

  void notifyStateChanged() {
    cashNotifier.value = playerData.cash;
  }

  void saveGame() {
    SaveService.savePlayerData(playerData);
  }

  void setJoystickVector(Vector2 vec) {
    joystickDirection = vec;
  }

  @override
  KeyEventResult onKeyEvent(KeyEvent event, Set<LogicalKeyboardKey> keysPressed) {
    _pressedKeys.clear();
    _pressedKeys.addAll(keysPressed);
    return KeyEventResult.handled;
  }

  void _updateKeyboardDirection() {
    if (_pressedKeys.isEmpty) return;

    Vector2 dir = Vector2.zero();
    if (_pressedKeys.contains(LogicalKeyboardKey.keyW) || _pressedKeys.contains(LogicalKeyboardKey.arrowUp)) {
      dir.y -= 1;
    }
    if (_pressedKeys.contains(LogicalKeyboardKey.keyS) || _pressedKeys.contains(LogicalKeyboardKey.arrowDown)) {
      dir.y += 1;
    }
    if (_pressedKeys.contains(LogicalKeyboardKey.keyA) || _pressedKeys.contains(LogicalKeyboardKey.arrowLeft)) {
      dir.x -= 1;
    }
    if (_pressedKeys.contains(LogicalKeyboardKey.keyD) || _pressedKeys.contains(LogicalKeyboardKey.arrowRight)) {
      dir.x += 1;
    }

    if (dir.length > 0) {
      joystickDirection = dir.normalized();
    } else {
      joystickDirection = Vector2.zero();
    }
  }
}

/// Renders the Neo-Brutalist Store Floor, Wall Border, and Grid inside the World coordinate space
class StoreFloorComponent extends PositionComponent {
  final double worldWidth;
  final double worldHeight;
  final Vector2 entrancePosition;

  StoreFloorComponent({
    required this.worldWidth,
    required this.worldHeight,
    required this.entrancePosition,
  }) : super(priority: -100);

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    // 1. Store Perimeter
    final floorRect = Rect.fromLTWH(40, 40, worldWidth - 80, worldHeight - 80);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(floorRect, const Radius.circular(16)),
      fillPaint: NeoTheme.fill(const Color(0xFFFAF7F2)),
      strokePaint: NeoTheme.stroke(width: 4.0, color: NeoTheme.inkBlack),
      shadowOffset: 6.0,
    );

    // 2. Decorative 16-Bit Grid Dots on floor
    final dotPaint = Paint()..color = NeoTheme.gridDot;
    for (double x = 70; x < worldWidth - 70; x += 40) {
      for (double y = 70; y < worldHeight - 70; y += 40) {
        canvas.drawCircle(Offset(x, y), 2.5, dotPaint);
      }
    }

    // 3. Entrance Doorway Marker (Bottom)
    final doorRect = Rect.fromCenter(
      center: Offset(entrancePosition.x, worldHeight - 40),
      width: 120,
      height: 16,
    );
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(doorRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(NeoTheme.boostCyan),
      strokePaint: NeoTheme.stroke(width: 2.5),
      shadowOffset: 0,
    );

    const doorText = 'GIRIS / CIKIS';
    final span = const TextSpan(
      text: doorText,
      style: TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();
    tp.paint(canvas, Offset(entrancePosition.x - tp.width / 2, worldHeight - 46));
  }
}

