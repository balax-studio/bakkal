import 'dart:math';
import 'package:flame/events.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';
import '../core/theme/station_theme.dart';
import '../domain/fuel_type.dart';
import '../domain/station_state.dart';
import '../domain/vehicle_model.dart';
import 'components/customer_vehicle_component.dart';
import 'components/floating_coin_component.dart';
import 'components/tanker_component.dart';
import 'iso/iso_station_scene.dart';

class PetrolStationGame extends FlameGame with TapCallbacks {
  final StationState stationState;
  final Function(CustomerVehicleComponent vehicle) onOpenPumpPanel;

  double _spawnTimer = 0.0;
  CustomerVehicleComponent? activeSelectedVehicle;
  final Set<int> _occupiedPumpSlots = {};
  int _lastActiveShipmentCount = 0;

  late final IsoStationScene scene;

  PetrolStationGame({
    required this.stationState,
    required this.onOpenPumpPanel,
  });

  @override
  Color backgroundColor() {
    final hour = stationState.timeOfDay;
    if (hour < 5.0 || hour >= 22.0) {
      return const Color(0xFF0F172A); // Gece Gökyüzü
    } else if (hour >= 5.0 && hour < 7.0) {
      final t = (hour - 5.0) / 2.0;
      return Color.lerp(const Color(0xFF0F172A), StationTheme.skyBlue, t)!;
    } else if (hour >= 7.0 && hour < 18.0) {
      return StationTheme.skyBlue; // Gündüz Gökyüzü
    } else if (hour >= 18.0 && hour < 20.5) {
      final t = (hour - 18.0) / 2.5;
      return Color.lerp(StationTheme.skyBlue, const Color(0xFFEA580C), t)!; // Gün Batımı
    } else {
      final t = (hour - 20.5) / 1.5;
      return Color.lerp(const Color(0xFFEA580C), const Color(0xFF0F172A), t)!; // Akşam -> Gece
    }
  }

  @override
  Future<void> onLoad() async {
    super.onLoad();

    // 2.5D İzometrik Sahne Ekleniyor
    scene = IsoStationScene();
    add(scene);
  }

  @override
  void update(double dt) {
    super.update(dt);

    // Saat ve Süreç Güncellemesi
    stationState.updateTick(dt);

    // Yeni Yakıt Tankeri Siparişi Geldi mi?
    if (stationState.activeShipments.length > _lastActiveShipmentCount) {
      final latest = stationState.activeShipments.last;
      add(
        TankerComponent(
          fuelType: latest.fuelType,
          amount: latest.amount,
          onDelivered: () {
            add(
              FloatingCoinComponent(
                position: Vector2(size.x / 2 + 100, size.y * 0.32 - 40),
                text: '+${latest.amount.toInt()}${latest.fuelType.unit} DOLDU',
                color: latest.fuelType.color,
              ),
            );
          },
        ),
      );
    }
    _lastActiveShipmentCount = stationState.activeShipments.length;

    // Müşteri Aracı Spawn Mantığı
    _spawnTimer += dt;
    final spawnInterval = _calculateSpawnInterval();
    if (_spawnTimer >= spawnInterval) {
      _spawnTimer = 0.0;
      _trySpawnCustomer();
    }
  }

  double _calculateSpawnInterval() {
    final hour = stationState.timeOfDay;
    final isPeak = (hour >= 7.0 && hour <= 10.0) || (hour >= 17.0 && hour <= 20.0);
    return isPeak ? 3.0 : 5.0;
  }

  void _trySpawnCustomer() {
    // Boş pompa slotu bul
    int? freeSlot;
    for (int i = 0; i < stationState.pumpsCount; i++) {
      if (!_occupiedPumpSlots.contains(i)) {
        freeSlot = i;
        break;
      }
    }

    if (freeSlot == null) return; // Tüm pompalar dolu

    _occupiedPumpSlots.add(freeSlot);

    final rnd = Random();
    final vehicleType = VehicleType.values[rnd.nextInt(VehicleType.values.length)];
    final fuelTypes = [FuelType.benzin, FuelType.dizel, FuelType.lpg];
    if (stationState.hasEvCharger) {
      fuelTypes.add(FuelType.elektrik);
    }
    final chosenFuel = fuelTypes[rnd.nextInt(fuelTypes.length)];

    final demandedUnits = (rnd.nextInt(5) + 3) * 10.0; // 30, 40, 50, 60, 70
    final maxBudget = demandedUnits * (stationState.prices[chosenFuel] ?? 40.0) * 1.1;

    final order = CustomerOrder(
      id: 'cust_${DateTime.now().millisecondsSinceEpoch}',
      vehicleType: vehicleType,
      fuelType: chosenFuel,
      demandedUnits: demandedUnits,
      maxBudget: maxBudget,
      wantsWash: stationState.hasCarWash && rnd.nextBool(),
    );

    // Pompanın Grid Koordinatı
    final parkPos = IsoStationScene.vehicleParkPosForSlot(freeSlot, stationState.pumpsCount);

    final vehicle = CustomerVehicleComponent(
      order: order,
      pumpSlot: freeSlot,
      parkPos: parkPos,
    );

    add(vehicle);
  }

  void onVehicleArrivedAtPump(CustomerVehicleComponent vehicle) {
    // Araç pompaya ulaştı
  }

  void onCustomerTapped(CustomerVehicleComponent vehicle) {
    activeSelectedVehicle = vehicle;
    onOpenPumpPanel(vehicle);
  }

  void completeService({
    required CustomerVehicleComponent vehicle,
    required double filledUnits,
    required double earnedCash,
    bool cleanedWindows = false,
  }) {
    if (filledUnits > 0) {
      add(
        FloatingCoinComponent(
          position: vehicle.position + Vector2(10, -20),
          text: '+₺${earnedCash.toInt()}',
          color: StationTheme.amber,
        ),
      );
    }

    if (cleanedWindows) {
      stationState.addMoney(25.0); // 25₺ bahşiş
      add(
        FloatingCoinComponent(
          position: vehicle.position + Vector2(25, -45),
          text: '+₺25 Bahşiş ✨',
          color: StationTheme.green,
        ),
      );
    }

    _occupiedPumpSlots.remove(vehicle.pumpSlot);
    vehicle.state = VehicleState.serviced;
    activeSelectedVehicle = null;
  }

  void autoServiceCustomer(CustomerVehicleComponent vehicle) {
    final result = stationState.performRefuel(
      fuelType: vehicle.order.fuelType,
      requestedUnits: vehicle.order.demandedUnits,
      maxBudget: vehicle.order.maxBudget,
    );

    completeService(
      vehicle: vehicle,
      filledUnits: result['units'] ?? 0.0,
      earnedCash: result['earned'] ?? 0.0,
    );
  }

  void onCustomerExited(CustomerVehicleComponent vehicle) {
    _occupiedPumpSlots.remove(vehicle.pumpSlot);
  }
}
