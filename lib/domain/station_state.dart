import 'dart:math';
import 'package:flutter/foundation.dart';
import 'fuel_type.dart';

class TankerShipment {
  final String id;
  final FuelType fuelType;
  final double amount;
  final double cost;
  double remainingSeconds;
  final double totalSeconds;

  TankerShipment({
    required this.id,
    required this.fuelType,
    required this.amount,
    required this.cost,
    required this.remainingSeconds,
    required this.totalSeconds,
  });

  bool get isDelivered => remainingSeconds <= 0;
}

class StationState extends ChangeNotifier {
  // Financial
  double _money = 7500.0;
  double get money => _money;

  // Station Info
  String stationName = 'Mola Yeri İstasyonu';
  int _day = 1;
  int get day => _day;

  double _timeOfDay = 6.0; // 06:00
  double get timeOfDay => _timeOfDay;

  String get timeString {
    final int hours = _timeOfDay.floor() % 24;
    final int minutes = ((_timeOfDay - _timeOfDay.floor()) * 60).floor();
    final String hStr = hours.toString().padLeft(2, '0');
    final String mStr = minutes.toString().padLeft(2, '0');
    return '$hStr:$mStr';
  }

  double _reputation = 3.5;
  double get reputation => _reputation;

  // Fuel Tanks (Current Liters)
  final Map<FuelType, double> tanks = {
    FuelType.benzin: 2500.0,
    FuelType.dizel: 3500.0,
    FuelType.lpg: 1800.0,
    FuelType.elektrik: 120.0,
  };

  // Fuel Tank Capacities
  final Map<FuelType, double> tankCapacities = {
    FuelType.benzin: 5000.0,
    FuelType.dizel: 6000.0,
    FuelType.lpg: 3000.0,
    FuelType.elektrik: 200.0,
  };

  // Prices Set by Player
  final Map<FuelType, double> prices = {
    FuelType.benzin: FuelType.benzin.defaultPricePerUnit,
    FuelType.dizel: FuelType.dizel.defaultPricePerUnit,
    FuelType.lpg: FuelType.lpg.defaultPricePerUnit,
    FuelType.elektrik: FuelType.elektrik.defaultPricePerUnit,
  };

  // Wholesale Costs
  final Map<FuelType, double> costs = {
    FuelType.benzin: FuelType.benzin.defaultCostPerUnit,
    FuelType.dizel: FuelType.dizel.defaultCostPerUnit,
    FuelType.lpg: FuelType.lpg.defaultCostPerUnit,
    FuelType.elektrik: FuelType.elektrik.defaultCostPerUnit,
  };

  // Station Facilities & Upgrades
  int pumpsCount = 2; // Maximum 4
  bool hasMarket = true;
  bool hasTeaHouse = true;
  bool hasCarWash = false;
  bool hasSolarPanels = false;
  bool hasEvCharger = false;
  bool hasManager = false;

  // In-flight Tanker Deliveries
  final List<TankerShipment> activeShipments = [];

  // Lifetime Statistics
  int totalCustomersServed = 0;
  int totalCustomersLost = 0;
  double totalRevenue = 0.0;

  // Constructor with optional initial values
  StationState({double? initialMoney}) {
    if (initialMoney != null) {
      _money = initialMoney;
    }
  }

  // Add / Deduct Money
  bool addMoney(double amount) {
    _money += amount;
    totalRevenue += amount;
    notifyListeners();
    return true;
  }

  bool spendMoney(double amount) {
    if (_money >= amount) {
      _money -= amount;
      notifyListeners();
      return true;
    }
    return false;
  }

  // Adjust Prices (+/- 0.5 ₺)
  void adjustPrice(FuelType type, double delta) {
    final current = prices[type] ?? type.defaultPricePerUnit;
    final updated = (current + delta).clamp(10.0, 100.0);
    prices[type] = double.parse(updated.toStringAsFixed(1));
    notifyListeners();
  }

  // Order Tanker
  bool orderTanker(FuelType type, double amount) {
    final costPerUnit = costs[type] ?? type.defaultCostPerUnit;
    final totalCost = amount * costPerUnit;

    if (spendMoney(totalCost)) {
      final shipment = TankerShipment(
        id: 'tanker_${DateTime.now().millisecondsSinceEpoch}',
        fuelType: type,
        amount: amount,
        cost: totalCost,
        remainingSeconds: 15.0, // 15 seconds ETA
        totalSeconds: 15.0,
      );
      activeShipments.add(shipment);
      notifyListeners();
      return true;
    }
    return false;
  }

  // Refuel Action from Pump
  // Returns actual filled units and earned money
  Map<String, double> performRefuel({
    required FuelType fuelType,
    required double requestedUnits,
    required double maxBudget,
  }) {
    final availableInTank = tanks[fuelType] ?? 0.0;
    final unitPrice = prices[fuelType] ?? fuelType.defaultPricePerUnit;

    if (availableInTank <= 0.5) {
      totalCustomersLost++;
      _reputation = max(1.0, _reputation - 0.05);
      notifyListeners();
      return {'units': 0.0, 'earned': 0.0};
    }

    // Calculate max units that can be bought with budget
    final maxUnitsByBudget = maxBudget / unitPrice;
    final actualUnitsToFill = min(
      min(requestedUnits, maxUnitsByBudget),
      availableInTank,
    );

    final totalCost = actualUnitsToFill * unitPrice;

    // Deduct from tank
    tanks[fuelType] = max(0.0, availableInTank - actualUnitsToFill);

    // Add to cash
    addMoney(totalCost);
    totalCustomersServed++;

    // Small reputation boost on satisfied customer
    if (actualUnitsToFill >= requestedUnits * 0.9) {
      _reputation = min(5.0, _reputation + 0.02);
    }

    notifyListeners();
    return {
      'units': actualUnitsToFill,
      'earned': totalCost,
    };
  }

  // Game Loop Tick (Called by Game component)
  void updateTick(double dt) {
    // Advance Game Clock: 1 real second = 1 game minute
    _timeOfDay += (dt / 60.0);
    if (_timeOfDay >= 24.0) {
      _timeOfDay -= 24.0;
      _day += 1;
      _dailyMaintenanceAndSolarYield();
    }

    // Update In-flight Tankers
    bool shipmentArrived = false;
    for (int i = activeShipments.length - 1; i >= 0; i--) {
      final shipment = activeShipments[i];
      shipment.remainingSeconds -= dt;
      if (shipment.isDelivered) {
        // Unload fuel into tank
        final current = tanks[shipment.fuelType] ?? 0.0;
        final cap = tankCapacities[shipment.fuelType] ?? 5000.0;
        tanks[shipment.fuelType] = min(cap, current + shipment.amount);
        activeShipments.removeAt(i);
        shipmentArrived = true;
      }
    }

    // Solar panels generate small steady electricity during daylight
    if (hasSolarPanels && _timeOfDay >= 7.0 && _timeOfDay <= 18.0) {
      final curEv = tanks[FuelType.elektrik] ?? 0.0;
      final capEv = tankCapacities[FuelType.elektrik] ?? 200.0;
      tanks[FuelType.elektrik] = min(capEv, curEv + (0.5 * dt));
    }

    if (shipmentArrived) {
      notifyListeners();
    }
  }

  void _dailyMaintenanceAndSolarYield() {
    // Station manager handles daily auto-reorder if fuel drops below 20%
    if (hasManager) {
      for (final fuel in FuelType.values) {
        final cur = tanks[fuel] ?? 0.0;
        final cap = tankCapacities[fuel] ?? 5000.0;
        if (cur < cap * 0.25) {
          final needed = cap * 0.5;
          final cost = needed * (costs[fuel] ?? 30.0);
          if (_money >= cost) {
            orderTanker(fuel, needed);
          }
        }
      }
    }
    notifyListeners();
  }

  // Facility Upgrades
  bool upgradePumps() {
    if (pumpsCount >= 4) return false;
    final cost = 5000.0 * pumpsCount;
    if (spendMoney(cost)) {
      pumpsCount++;
      notifyListeners();
      return true;
    }
    return false;
  }

  bool buildCarWash() {
    if (hasCarWash) return false;
    if (spendMoney(12000.0)) {
      hasCarWash = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  bool buildSolarPanels() {
    if (hasSolarPanels) return false;
    if (spendMoney(8000.0)) {
      hasSolarPanels = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  bool buildEvCharger() {
    if (hasEvCharger) return false;
    if (spendMoney(10000.0)) {
      hasEvCharger = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  bool hireManager() {
    if (hasManager) return false;
    if (spendMoney(15000.0)) {
      hasManager = true;
      notifyListeners();
      return true;
    }
    return false;
  }

  // Serialization for Storage
  Map<String, dynamic> toJson() => {
        'money': _money,
        'day': _day,
        'timeOfDay': _timeOfDay,
        'reputation': _reputation,
        'pumpsCount': pumpsCount,
        'hasMarket': hasMarket,
        'hasTeaHouse': hasTeaHouse,
        'hasCarWash': hasCarWash,
        'hasSolarPanels': hasSolarPanels,
        'hasEvCharger': hasEvCharger,
        'hasManager': hasManager,
        'tanks': tanks.map((k, v) => MapEntry(k.name, v)),
        'prices': prices.map((k, v) => MapEntry(k.name, v)),
        'totalCustomersServed': totalCustomersServed,
        'totalCustomersLost': totalCustomersLost,
        'totalRevenue': totalRevenue,
        'lastSaveTimestamp': DateTime.now().millisecondsSinceEpoch,
      };

  void loadFromJson(Map<String, dynamic> json) {
    _money = (json['money'] as num?)?.toDouble() ?? _money;
    _day = (json['day'] as num?)?.toInt() ?? _day;
    _timeOfDay = (json['timeOfDay'] as num?)?.toDouble() ?? _timeOfDay;
    _reputation = (json['reputation'] as num?)?.toDouble() ?? _reputation;
    pumpsCount = (json['pumpsCount'] as num?)?.toInt() ?? pumpsCount;
    hasMarket = json['hasMarket'] as bool? ?? hasMarket;
    hasTeaHouse = json['hasTeaHouse'] as bool? ?? hasTeaHouse;
    hasCarWash = json['hasCarWash'] as bool? ?? hasCarWash;
    hasSolarPanels = json['hasSolarPanels'] as bool? ?? hasSolarPanels;
    hasEvCharger = json['hasEvCharger'] as bool? ?? hasEvCharger;
    hasManager = json['hasManager'] as bool? ?? hasManager;

    if (json['tanks'] != null && json['tanks'] is Map) {
      final m = json['tanks'] as Map;
      for (final fuel in FuelType.values) {
        if (m.containsKey(fuel.name)) {
          tanks[fuel] = (m[fuel.name] as num).toDouble();
        }
      }
    }

    if (json['prices'] != null && json['prices'] is Map) {
      final m = json['prices'] as Map;
      for (final fuel in FuelType.values) {
        if (m.containsKey(fuel.name)) {
          prices[fuel] = (m[fuel.name] as num).toDouble();
        }
      }
    }

    totalCustomersServed = (json['totalCustomersServed'] as num?)?.toInt() ?? 0;
    totalCustomersLost = (json['totalCustomersLost'] as num?)?.toInt() ?? 0;
    totalRevenue = (json['totalRevenue'] as num?)?.toDouble() ?? 0.0;
    notifyListeners();
  }
}
