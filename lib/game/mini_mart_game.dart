import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../core/audio/sound_service.dart';
import '../core/theme/neo_theme.dart';
import '../domain/models/game_models.dart';
import '../services/ad_service.dart';
import '../services/save_service.dart';
import 'components/ambient_outdoor_component.dart';
import 'components/animal_pen_component.dart';
import 'components/cashier_component.dart';
import 'components/courier_component.dart';
import 'components/customer_component.dart';
import 'components/dirt_puddle_component.dart';
import 'components/field_component.dart';
import 'components/player_component.dart';
import 'components/processing_station_component.dart';
import 'components/shelf_component.dart';
import 'components/thief_component.dart';
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

  // Dual-Zone World dimensions (1150 x 950)
  final double worldWidth = 1150.0;
  final double worldHeight = 950.0;

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
  CourierComponent? courier;

  // Spawners & Timers
  final Vector2 entrancePosition = Vector2(850, 870);
  double customerSpawnTimer = 0.0;
  final double customerSpawnInterval = 3.2;
  final int maxCustomers = 6;

  double thiefSpawnTimer = 0.0;
  final double thiefSpawnInterval = 45.0;

  double puddleSpawnTimer = 0.0;
  final double puddleSpawnInterval = 18.0;

  MiniMartGame({required this.playerData});

  @override
  Color backgroundColor() => const Color(0xFF5AB9EA); // Neo-Brutalist Sky Blue Canvas

  @override
  Future<void> onLoad() async {
    await super.onLoad();

    cashNotifier.value = playerData.cash;
    marketLevelNotifier.value = playerData.activeMarketIndex;

    // 1. Build Market World Elements
    _buildMarketLevel();

    // 2. Setup Camera
    camera.viewfinder.anchor = Anchor.center;
    camera.viewfinder.zoom = 0.95;
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

    // Register 2.5D Solid Perimeter & Dividing Walls in Physics Engine
    _registerPerimeterWalls();

    // 0. Ambient Living Outdoors (Trees, Grass, Flowers, Butterflies, Clouds)
    world.add(AmbientOutdoorComponent());

    // 1. 2.5D Dual-Zone Store Floor & Walls
    world.add(
      StoreFloorComponent(
        worldWidth: worldWidth,
        worldHeight: worldHeight,
        entrancePosition: entrancePosition,
      ),
    );

    // 2. Player Spawning (Center of market)
    player = PlayerComponent(position: Vector2(750, 580));
    world.add(player);

    // 3. Cashier Counter (Right Zone)
    cashier = CashierComponent(id: 'cashier_1', position: Vector2(850, 750));
    world.add(cashier);

    // 4. Motorized Delivery Courier (Middle Top Dock)
    courier = CourierComponent(position: Vector2(550, 130));
    world.add(courier!);

    // Level-specific setups
    _setupLevel1MahalleBakkali();
    _spawnExistingWorkers();
  }

  void _registerPerimeterWalls() {
    // Outer Top Left Wall (Farm Roof)
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_top_left',
        bounds: const Rect.fromLTWH(40, 60, 480, 40),
        label: 'Top Left Farm Wall',
      ),
    );

    // Outer Top Right Wall (Store Roof)
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_top_right',
        bounds: Rect.fromLTWH(580, 60, worldWidth - 620, 40),
        label: 'Top Right Store Wall',
      ),
    );

    // Left Outer Wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_left',
        bounds: Rect.fromLTWH(30, 80, 24, worldHeight - 160),
        label: 'Left Wall',
      ),
    );

    // Right Outer Wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_right',
        bounds: Rect.fromLTWH(worldWidth - 54, 80, 24, worldHeight - 160),
        label: 'Right Wall',
      ),
    );

    // Dividing Middle Wall Top Segment
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_mid_top',
        bounds: const Rect.fromLTWH(535, 170, 20, 240),
        label: 'Middle Dividing Wall Top',
      ),
    );

    // Dividing Middle Wall Bottom Segment (Leaves open archway in middle at y: 410-600)
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_mid_bottom',
        bounds: Rect.fromLTWH(535, 600, 20, worldHeight - 680),
        label: 'Middle Dividing Wall Bottom',
      ),
    );

    // Bottom Farm Wall
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_bottom_farm',
        bounds: Rect.fromLTWH(40, worldHeight - 60, 490, 30),
        label: 'Bottom Farm Wall',
      ),
    );

    // Bottom Store Wall (with entrance opening at 850)
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_bottom_store_left',
        bounds: const Rect.fromLTWH(540, 890, 240, 30),
        label: 'Bottom Store Left Wall',
      ),
    );
    physicsWorld.addObstacle(
      SolidBox(
        id: 'wall_bottom_store_right',
        bounds: Rect.fromLTWH(920, 890, worldWidth - 950, 30),
        label: 'Bottom Store Right Wall',
      ),
    );
  }

  void _setupLevel1MahalleBakkali() {
    // ==========================================
    // SOL BÖLGE: TARIM, HAYVANCILIK & İMALATHANELER
    // ==========================================

    // 1. Domates Serası & Reyonu
    final fieldTomato1 = ProduceFieldComponent(
      id: 'field_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(160, 240),
    );
    fields.add(fieldTomato1);
    world.add(fieldTomato1);

    final shelfTomato1 = ShelfComponent(
      id: 'shelf_tomato_1',
      productType: ProductType.tomato,
      position: Vector2(680, 240),
    );
    shelves.add(shelfTomato1);
    world.add(shelfTomato1);

    // 2. Mısır Tarlası ($30) & Mısır Reyonu ($40)
    _addUnlockPad(
      unlockId: 'field_corn_1',
      title: '🌽 Mısır Tarlası',
      totalCost: 30,
      position: Vector2(380, 240),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_corn_1',
          productType: ProductType.corn,
          position: Vector2(380, 240),
        );
        fields.add(f);
        world.add(f);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_corn_1',
      title: '🌽 Mısır Reyonu',
      totalCost: 40,
      position: Vector2(860, 240),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_corn_1',
          productType: ProductType.corn,
          position: Vector2(860, 240),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // 3. Buğday Tarlası ($50) -> Değirmen/Fırın ($70) -> Ekmek Reyonu ($80)
    _addUnlockPad(
      unlockId: 'field_wheat_1',
      title: '🌾 Buğday Tarlası',
      totalCost: 50,
      position: Vector2(160, 420),
      onUnlock: () {
        final f = ProduceFieldComponent(
          id: 'field_wheat_1',
          productType: ProductType.wheat,
          position: Vector2(160, 420),
        );
        fields.add(f);
        world.add(f);
      },
    );

    _addUnlockPad(
      unlockId: 'station_mill_1',
      title: '🍞 Değirmen & Fırın',
      totalCost: 70,
      position: Vector2(380, 420),
      onUnlock: () {
        final station = ProcessingStationComponent(
          id: 'station_mill_1',
          title: '🍞 Fırın',
          inputType: ProductType.wheat,
          outputType: ProductType.bread,
          position: Vector2(380, 420),
          machineColor: const Color(0xFFD97706),
        );
        world.add(station);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_bread_1',
      title: '🍞 Somun Ekmek Reyonu',
      totalCost: 80,
      position: Vector2(1040, 240),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_bread_1',
          productType: ProductType.bread,
          position: Vector2(1040, 240),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // 4. İnek Ahırı ($90) -> Ayran Şelalesi ($110) -> Ayran Reyonu ($120)
    _addUnlockPad(
      unlockId: 'pen_cow_1',
      title: '🐄 İnek Ahırı',
      totalCost: 90,
      position: Vector2(160, 600),
      onUnlock: () {
        final pen = AnimalPenComponent(
          id: 'pen_cow_1',
          title: '🐄 Ahır (Süt)',
          productType: ProductType.milk,
          position: Vector2(160, 600),
        );
        world.add(pen);
      },
    );

    _addUnlockPad(
      unlockId: 'station_ayran_1',
      title: '🥤 Ayran Şelalesi',
      totalCost: 110,
      position: Vector2(380, 600),
      onUnlock: () {
        final station = ProcessingStationComponent(
          id: 'station_ayran_1',
          title: '🥤 Ayran Şelalesi',
          inputType: ProductType.milk,
          outputType: ProductType.ayran,
          position: Vector2(380, 600),
          machineColor: const Color(0xFF38BDF8),
        );
        world.add(station);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_ayran_1',
      title: '🥤 Ayran Reyonu',
      totalCost: 120,
      position: Vector2(680, 420),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_ayran_1',
          productType: ProductType.ayran,
          position: Vector2(680, 420),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // 5. Salça Fabrikası ($130) -> Salça Reyonu ($140)
    _addUnlockPad(
      unlockId: 'station_paste_1',
      title: '🥫 Salça Kazanı',
      totalCost: 130,
      position: Vector2(160, 780),
      onUnlock: () {
        final station = ProcessingStationComponent(
          id: 'station_paste_1',
          title: '🥫 Salça Kazanı',
          inputType: ProductType.tomato,
          outputType: ProductType.tomatoPaste,
          position: Vector2(160, 780),
          machineColor: NeoTheme.tomatoRed,
        );
        world.add(station);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_paste_1',
      title: '🥫 Salça Reyonu',
      totalCost: 140,
      position: Vector2(860, 420),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_paste_1',
          productType: ProductType.tomatoPaste,
          position: Vector2(860, 420),
        );
        shelves.add(s);
        world.add(s);
      },
    );

    // 6. Patates Tarlası ($150) -> Cips Fritözü ($160) -> Cips Reyonu ($170)
    _addUnlockPad(
      unlockId: 'station_chips_1',
      title: '🍟 Cips Fritözü',
      totalCost: 160,
      position: Vector2(380, 780),
      onUnlock: () {
        final station = ProcessingStationComponent(
          id: 'station_chips_1',
          title: '🍟 Cips Fritözü',
          inputType: ProductType.potato,
          outputType: ProductType.chips,
          position: Vector2(380, 780),
          machineColor: NeoTheme.cornYellow,
        );
        world.add(station);
      },
    );

    _addUnlockPad(
      unlockId: 'shelf_chips_1',
      title: '🍟 Külah Cips Reyonu',
      totalCost: 170,
      position: Vector2(1040, 420),
      onUnlock: () {
        final s = ShelfComponent(
          id: 'shelf_chips_1',
          productType: ProductType.chips,
          position: Vector2(1040, 420),
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
    for (final entry in playerData.workerStats.entries) {
      final role = entry.key;
      final count = entry.value.hiredCount;
      for (int i = 0; i < count; i++) {
        spawnWorker(role);
      }
    }
  }

  void spawnWorker(WorkerRole role) {
    Vector2 spawnPos;
    switch (role) {
      case WorkerRole.farmer:
        spawnPos = Vector2(250, 400 + (workers.length * 15) % 200);
        break;
      case WorkerRole.stocker:
        spawnPos = Vector2(550, 500);
        break;
      case WorkerRole.cashier:
        spawnPos = cashier.cashierStandPosition;
        break;
      case WorkerRole.cleaner:
        spawnPos = Vector2(750, 600);
        break;
    }

    final w = WorkerComponent(role: role, spawnPosition: spawnPos);
    workers.add(w);
    world.add(w);
  }

  @override
  void update(double dt) {
    super.update(dt);

    // 1. Movement Input
    _updateMovementDirection();

    // 2. Customer Spawner
    customerSpawnTimer += dt;
    if (customerSpawnTimer >= customerSpawnInterval && customers.length < maxCustomers) {
      customerSpawnTimer = 0.0;
      _spawnCustomer();
    }

    // 3. Thief Spawner
    thiefSpawnTimer += dt;
    if (thiefSpawnTimer >= thiefSpawnInterval) {
      thiefSpawnTimer = 0.0;
      _spawnThief();
    }

    // 4. Dirt Puddle Spawner (from active customer traffic)
    puddleSpawnTimer += dt;
    if (puddleSpawnTimer >= puddleSpawnInterval && customers.isNotEmpty) {
      puddleSpawnTimer = 0.0;
      final c = customers[math.Random().nextInt(customers.length)];
      final puddle = DirtPuddleComponent(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        position: c.position.clone(),
      );
      world.add(puddle);
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

    // 1 in 6 chance for VIP customer!
    final isVip = math.Random().nextInt(6) == 0;
    final vipTitles = ['Muhtar', 'Fenomen', 'Mahalle Teyzesi', 'Gurme'];
    final vipTitle = vipTitles[math.Random().nextInt(vipTitles.length)];

    final customer = CustomerComponent(
      spawnPosition: entrancePosition + Vector2(0, 20),
      desiredItemCount: itemCount,
      shirtColor: randomColor,
      isVip: isVip,
      vipTitle: vipTitle,
    );

    customers.add(customer);
    world.add(customer);
  }

  void _spawnThief() {
    final thief = ThiefComponent(
      startPos: entrancePosition + Vector2(0, 20),
      targetPos: Vector2(750, 300),
      exitPos: entrancePosition + Vector2(0, 40),
    );
    world.add(thief);
    SoundService.playSpecialEvent();
  }

  void _updateCustomerQueueIndices() {
    final queuedCustomers = customers.where((c) => c.state == CustomerState.waitingInQueue || c.state == CustomerState.payingAtRegister).toList();
    for (int i = 0; i < queuedCustomers.length; i++) {
      queuedCustomers[i].queueIndex = i;
    }
  }

  void onCustomerServed(CustomerComponent customer) {
    // Handled
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

/// Renders the 2.5D Dual-Zone Floor: Left Farm/Workshop & Right Supermarket
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

    // ==========================================
    // 1. SOL BÖLGE: ÇİFTLİK & İMALATHANE ZEMİNİ
    // ==========================================
    final farmRect = Rect.fromLTWH(50, 70, 480, worldHeight - 130);

    // Shadow
    canvas.drawRRect(
      RRect.fromRectAndRadius(farmRect.shift(const Offset(8, 10)), const Radius.circular(20)),
      NeoTheme.shadowPaint,
    );

    // Grass & Garden Path Texture
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(farmRect, const Radius.circular(16)),
      fillPaint: NeoTheme.fill(const Color(0xFFECFDF5)), // Crisp Mint Grass Tone
      strokePaint: NeoTheme.stroke(width: 4.0, color: const Color(0xFF0F172A)),
      shadowOffset: 0,
    );

    // Farm Title Decal
    _drawZoneHeader(canvas, 290, 88, '🌾 ORGANİK ÇİFTLİK & İMALATHANELER', NeoTheme.grassGreen);

    // ==========================================
    // 2. SAĞ BÖLGE: BAKKAL SATIŞ ALANI ZEMİNİ
    // ==========================================
    final storeRect = Rect.fromLTWH(570, 70, worldWidth - 620, worldHeight - 130);

    // Shadow
    canvas.drawRRect(
      RRect.fromRectAndRadius(storeRect.shift(const Offset(8, 10)), const Radius.circular(20)),
      NeoTheme.shadowPaint,
    );

    // Crisp Tile Floor
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(storeRect, const Radius.circular(16)),
      fillPaint: NeoTheme.fill(const Color(0xFFFBF8F3)),
      strokePaint: NeoTheme.stroke(width: 4.0, color: const Color(0xFF0F172A)),
      shadowOffset: 0,
    );

    // Supermarket Title Decal
    _drawZoneHeader(canvas, 860, 88, '🏪 BAKKAL SATIŞ REYONLARI', NeoTheme.purpleAccent);

    // Floor Diamonds
    final tilePaint = Paint()
      ..color = const Color(0xFFE2D9CC)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    for (double y = 130; y < worldHeight - 90; y += 45) {
      for (double x = 600; x < worldWidth - 85; x += 45) {
        canvas.drawLine(Offset(x - 4, y), Offset(x + 4, y), tilePaint);
        canvas.drawLine(Offset(x, y - 4), Offset(x, y + 4), tilePaint);
      }
    }

    // ==========================================
    // 3. ORTA SERVİS GEÇİŞİ (ARCHWAY / PASSAGE)
    // ==========================================
    final passageRect = Rect.fromCenter(center: Offset(550, 500), width: 50, height: 140);
    canvas.drawRect(passageRect, Paint()..color = const Color(0xFFCBD5E1));
    canvas.drawRect(passageRect, NeoTheme.stroke(width: 2.0));

    // ==========================================
    // 4. GİRİŞ KAPISI PASPASI (ENTRANCE GATE)
    // ==========================================
    final doorRect = Rect.fromCenter(
      center: Offset(entrancePosition.x, worldHeight - 58),
      width: 140,
      height: 22,
    );
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(doorRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(NeoTheme.boostCyan),
      strokePaint: NeoTheme.stroke(width: 3.0),
      shadowOffset: 2.0,
    );

    const doorText = 'MÜŞTERİ GİRİŞİ (BAKKAL)';
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

  void _drawZoneHeader(Canvas canvas, double x, double y, String text, Color accentColor) {
    final span = TextSpan(
      text: text,
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 10,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();

    final headerRect = Rect.fromCenter(center: Offset(x, y), width: tp.width + 16, height: 22);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(headerRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    tp.paint(canvas, Offset(x - tp.width / 2, y - tp.height / 2));
  }
}
