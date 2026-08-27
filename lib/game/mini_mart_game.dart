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
import 'components/ambient_outdoor_component.dart';
import 'components/cashier_component.dart';
import 'components/customer_component.dart';
import 'components/field_component.dart';
import 'components/player_component.dart';
import 'components/shelf_component.dart';
import 'components/truck_component.dart';
import 'components/unlock_pad_component.dart';
import 'components/worker_component.dart';
import 'physics/collision_system.dart';

class MiniMartGame extends FlameGame with KeyboardEvents {
  final PlayerData playerData;
  final AdService adService = AdService.instance;
  final PhysicsWorld physicsWorld = PhysicsWorld();

  // Reactive State Notifiers for Flutter UI Overlays
  final ValueNotifier<int> cashNotifier = ValueNotifier<int>(0);
  final ValueNotifier<int> marketLevelNotifier = ValueNotifier<int>(0);
  final ValueNotifier<bool> showLevelCompleteModal = ValueNotifier<bool>(false);
  final ValueNotifier<bool> showUpgradesModal = ValueNotifier<bool>(false);

  // World dimensions
  final double worldWidth = 650.0;
  final double worldHeight = 900.0;

  // Joystick direction
  Vector2 joystickDirection = Vector2.zero();
  Vector2 virtualJoystickDirection = Vector2.zero();
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
  final Vector2 entrancePosition = Vector2(325, 830);
  double customerSpawnTimer = 0.0;
  final double customerSpawnInterval = 3.5;
  final int maxCustomers = 5;

  MiniMartGame({required this.playerData});

  @override
  Color backgroundColor() => const Color(0xFF5AB9EA); // Neo-Brutalist Sky Blue Canvas (like reference image)

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
    final componentsToRemove = world.children.whereType<Component>().toList();
    for (final c in componentsToRemove) {
      c.removeFromParent();
    }
    physicsWorld.clear();
    fields.clear();
    shelves.clear();
    customers.clear();
    workers.clear();
    unlockPads.clear();

    // Register 2.5D Solid Perimeter Walls in Physics Engine (prevents walking out of map)
    _registerPerimeterWalls();

    // 0. Ambient Living Outdoors (Trees, Grass, Flowers, Fauna, Clouds)
    world.add(AmbientOutdoorComponent());

    // 1. 2.5D Isometric Store Floor & Cutaway Walls
    world.add(
      StoreFloorComponent(
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        entrancePosition: entrancePosition,
      ),
    );

    // 1. Player Spawning
    player = PlayerComponent(position: Vector2(325, 580));
    world.add(player);

    // 2. Cashier Counter
    cashier = CashierComponent(id: 'cashier_1', position: Vector2(325, 710));
    world.add(cashier);

    // 3. Delivery Truck
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

  void _registerPerimeterWalls() {
    // Top boundary wall behind truck and garden
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_top_left',
        bounds: const Rect.fromLTWH(40, 60, 200, 40),
        label: 'Top Left Wall',
      ),
    );
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_top_right',
        bounds: const Rect.fromLTWH(410, 60, 200, 40),
        label: 'Top Right Wall',
      ),
    );

    // Left outer cutaway wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_left',
        bounds: Rect.fromLTWH(30, 80, 24, worldHeight - 160),
        label: 'Left Wall',
      ),
    );

    // Right outer cutaway wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_right',
        bounds: Rect.fromLTWH(worldWidth - 54, 80, 24, worldHeight - 160),
        label: 'Right Wall',
      ),
    );

    // Bottom left wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_bottom_left',
        bounds: Rect.fromLTWH(40, worldHeight - 60, 200, 30),
        label: 'Bottom Left Wall',
      ),
    );

    // Bottom right wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_bottom_right',
        bounds: Rect.fromLTWH(410, worldHeight - 60, 200, 30),
        label: 'Bottom Right Wall',
      ),
    );
  }

  void _setupMarket1OrganikManav() {
    // Tomato Field 1
    final fieldTomato1 = ProduceFieldComponent(
      id: 'field_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(170, 300),
    );
    fields.add(fieldTomato1);
    world.add(fieldTomato1);

    // Tomato Shelf 1
    final shelfTomato1 = ShelfComponent(
      id: 'shelf_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(170, 490),
    );
    shelves.add(shelfTomato1);
    world.add(shelfTomato1);

    // Unlock Pad for Corn Field ($40)
    _addUnlockPad(
      unlockId: 'field_corn_1',
      title: 'Mısır Tarlası',
      totalCost: 40,
      position: Vector2(480, 300),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_corn_1',
          productType: ProductType.corn,
          position: Vector2(480, 300),
        );
        fields.add(f);
        world.add(f);
      },
    );

    // Unlock Pad for Corn Shelf ($60)
    _addUnlockPad(
      unlockId: 'shelf_corn_1',
      title: 'Mısır Reyonu',
      totalCost: 60,
      position: Vector2(480, 490),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_corn_1',
          productType: ProductType.corn,
          position: Vector2(480, 490),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // Unlock Pad for Auto-Restocker ($100)
    _addUnlockPad(
      unlockId: 'worker_restocker_1',
      title: 'Reyon Görevlisi',
      totalCost: 100,
      position: Vector2(170, 680),
      onUnlock: () {
        final w = WorkerComponent(
          role: WorkerRole.restocker,
          spawnPosition: Vector2(170, 680),
        );
        workers.add(w);
        world.add(w);
      },
    );

    // Unlock Pad for Auto-Cashier ($150)
    _addUnlockPad(
      unlockId: 'worker_cashier_1',
      title: 'Otomatik Kasiyer',
      totalCost: 150,
      position: Vector2(480, 680),
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
    final fieldBread1 = ProduceFieldComponent(
      id: 'field_bread_1',
      productType: ProductType.bread,
      position: Vector2(170, 300),
    );
    fields.add(fieldBread1);
    world.add(fieldBread1);

    final shelfBread1 = ShelfComponent(
      id: 'shelf_bread_1',
      productType: ProductType.bread,
      position: Vector2(170, 490),
    );
    shelves.add(shelfBread1);
    world.add(shelfBread1);

    _addUnlockPad(
      unlockId: 'field_coffee_1',
      title: 'Espresso Barı',
      totalCost: 120,
      position: Vector2(480, 300),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_coffee_1',
          productType: ProductType.coffee,
          position: Vector2(480, 300),
        );
        fields.add(f);
        world.add(f);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_coffee_1',
      title: 'Kahve Reyonu',
      totalCost: 160,
      position: Vector2(480, 490),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_coffee_1',
          productType: ProductType.coffee,
          position: Vector2(480, 490),
        );
        shelves.add(s);
        world.add(s);
      },
    );
  }

  void _setupMarket3MegaMart() {
    final fieldMega1 = ProduceFieldComponent(
      id: 'field_mega_1',
      productType: ProductType.tomato,
      position: Vector2(170, 300),
    );
    fields.add(fieldMega1);
    world.add(fieldMega1);

    final shelfMega1 = ShelfComponent(
      id: 'shelf_mega_1',
      productType: ProductType.tomato,
      position: Vector2(170, 490),
    );
    shelves.add(shelfMega1);
    world.add(shelfMega1);

    _addUnlockPad(
      unlockId: 'field_mega_2',
      title: 'Gurme Kahve Barı',
      totalCost: 200,
      position: Vector2(480, 300),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_mega_2',
          productType: ProductType.coffee,
          position: Vector2(480, 300),
        );
        fields.add(f);
        world.add(f);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_mega_2',
      title: 'Kahve Reyonu',
      totalCost: 250,
      position: Vector2(480, 490),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_mega_2',
          productType: ProductType.coffee,
          position: Vector2(480, 490),
        );
        shelves.add(s);
        world.add(s);
      },
    );
  }

  void _addUnlockPad({
    required String unlockId,
    required String title,
    required int totalCost,
    required Vector2 position,
    required VoidCallback onUnlock,
  }) {
    if (playerData.unlockedAreas.contains(unlockId)) {
      onUnlock();
      return;
    }

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

  void _spawnExistingWorkers() {
    if (playerData.unlockedAreas.contains('worker_restocker_1')) {
      final w = WorkerComponent(role: WorkerRole.restocker, spawnPosition: Vector2(170, 680));
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

    // 1. Movement Input Handling
    _updateMovementDirection();

    // 2. Customer Spawner
    customerSpawnTimer += dt;
    if (customerSpawnTimer >= customerSpawnInterval && customers.length < maxCustomers) {
      customerSpawnTimer = 0.0;
      _spawnCustomer();
    }

    _updateCustomerQueueIndices();
  }

  void _spawnCustomer() {
    final shirtColors = [
      NeoTheme.tomatoRed,
      NeoTheme.cornYellow,
      NeoTheme.purpleAccent,
      NeoTheme.boostCyan,
      const Color(0xFFEC4899),
      const Color(0xFF10B981),
    ];
    final randomColor = shirtColors[math.Random().nextInt(shirtColors.length)];
    final itemCount = 1 + math.Random().nextInt(3);

    final customer = CustomerComponent(
      spawnPosition: entrancePosition + Vector2(0, 30),
      desiredItemCount: itemCount,
      shirtColor: randomColor,
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
    // Served
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
    virtualJoystickDirection = vec;
    _updateMovementDirection();
  }

  @override
  KeyEventResult onKeyEvent(KeyEvent event, Set<LogicalKeyboardKey> keysPressed) {
    _pressedKeys.clear();
    _pressedKeys.addAll(keysPressed);
    _updateMovementDirection();
    return KeyEventResult.handled;
  }

  void _updateMovementDirection() {
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

    if (virtualJoystickDirection.length > 0.05) {
      joystickDirection = virtualJoystickDirection;
    } else if (dir.length > 0) {
      joystickDirection = dir.normalized();
    } else {
      joystickDirection = Vector2.zero();
    }
  }
}

/// Renders the 2.5D Neo-Brutalist Cutaway Room Floor, Raised 2.5D Walls, and Isometric Details
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

    final storeRect = Rect.fromLTWH(50, 70, worldWidth - 100, worldHeight - 130);

    // 1. Isometric Cutaway Floor Shadow
    final shadowPath = Path()
      ..addRRect(RRect.fromRectAndRadius(storeRect.shift(const Offset(8, 10)), const Radius.circular(20)));
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. 2.5D Raised Cutaway Back & Left Wall Extrusion
    // Left Wall (Vertical 2.5D thickness)
    final leftWallPath = Path()
      ..moveTo(50, 70)
      ..lineTo(50, worldHeight - 60)
      ..lineTo(32, worldHeight - 75)
      ..lineTo(32, 55)
      ..close();
    canvas.drawPath(leftWallPath, Paint()..color = const Color(0xFF1E293B));
    canvas.drawPath(leftWallPath, NeoTheme.stroke(width: 3.0));

    // Left Wall Top Rim (Lime Green Accent like in reference image)
    final leftWallTopPath = Path()
      ..moveTo(32, 55)
      ..lineTo(50, 70)
      ..lineTo(50, 78)
      ..lineTo(32, 63)
      ..close();
    canvas.drawPath(leftWallTopPath, Paint()..color = const Color(0xFF84CC16));
    canvas.drawPath(leftWallTopPath, NeoTheme.stroke(width: 2.0));

    // Back Wall Extrusion
    final backWallPath = Path()
      ..moveTo(50, 70)
      ..lineTo(worldWidth - 50, 70)
      ..lineTo(worldWidth - 50, 45)
      ..lineTo(32, 45)
      ..close();
    canvas.drawPath(backWallPath, Paint()..color = const Color(0xFF0F172A));
    canvas.drawPath(backWallPath, NeoTheme.stroke(width: 3.0));

    // Back Wall Top Rim
    final backWallTopPath = Path()
      ..moveTo(32, 45)
      ..lineTo(worldWidth - 50, 45)
      ..lineTo(worldWidth - 50, 52)
      ..lineTo(32, 52)
      ..close();
    canvas.drawPath(backWallTopPath, Paint()..color = const Color(0xFF84CC16));
    canvas.drawPath(backWallTopPath, NeoTheme.stroke(width: 2.0));

    // 3. Store Interior Floor (Warm Crisp Cream Neo-Brutalist Surface)
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(storeRect, const Radius.circular(16)),
      fillPaint: NeoTheme.fill(const Color(0xFFFBF8F3)),
      strokePaint: NeoTheme.stroke(width: 4.0, color: NeoTheme.inkBlack),
      shadowOffset: 0,
    );

    // 4. Subtle Isometric 16-bit Tile Diamonds on Floor
    final tilePaint = Paint()
      ..color = const Color(0xFFE2D9CC)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    for (double y = 110; y < worldHeight - 90; y += 45) {
      for (double x = 85; x < worldWidth - 85; x += 45) {
        // Draw tiny isometric floor cross/diamond
        canvas.drawLine(Offset(x - 4, y), Offset(x + 4, y), tilePaint);
        canvas.drawLine(Offset(x, y - 4), Offset(x, y + 4), tilePaint);
      }
    }

    // 5. Entrance Gate Mat & Neo-Brutalist Border (Bottom)
    final doorRect = Rect.fromCenter(
      center: Offset(entrancePosition.x, worldHeight - 58),
      width: 130,
      height: 22,
    );
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(doorRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(NeoTheme.boostCyan),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 2.0,
    );

    const doorText = 'GIRIS / CIKIS (BAKKAL)';
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
    tp.paint(canvas, Offset(entrancePosition.x - tp.width / 2, worldHeight - 64));
  }
}
