import 'package:flutter/material.dart';
import '../../core/theme/neo_theme.dart';

/// Types of goods that can be harvested, processed and sold
enum ProductType {
  tomato,
  corn,
  bread,
  coffee,
}

extension ProductTypeExt on ProductType {
  String get displayName {
    switch (this) {
      case ProductType.tomato:
        return 'Domates';
      case ProductType.corn:
        return 'Mısır';
      case ProductType.bread:
        return 'Taze Ekmek';
      case ProductType.coffee:
        return 'Espresso';
    }
  }

  String get emoji {
    switch (this) {
      case ProductType.tomato:
        return '🍅';
      case ProductType.corn:
        return '🌽';
      case ProductType.bread:
        return '🍞';
      case ProductType.coffee:
        return '☕';
    }
  }

  Color get color {
    switch (this) {
      case ProductType.tomato:
        return NeoTheme.tomatoRed;
      case ProductType.corn:
        return NeoTheme.cornYellow;
      case ProductType.bread:
        return NeoTheme.breadGold;
      case ProductType.coffee:
        return NeoTheme.coffeeBrown;
    }
  }

  int get basePrice {
    switch (this) {
      case ProductType.tomato:
        return 5;
      case ProductType.corn:
        return 10;
      case ProductType.bread:
        return 20;
      case ProductType.coffee:
        return 35;
    }
  }

  double get growthSeconds {
    switch (this) {
      case ProductType.tomato:
        return 2.5;
      case ProductType.corn:
        return 4.0;
      case ProductType.bread:
        return 5.0;
      case ProductType.coffee:
        return 6.5;
    }
  }
}

/// Represents a single physical product instance carried or placed on shelf
class ProductItem {
  final ProductType type;
  final String id;

  ProductItem({
    required this.type,
    String? id,
  }) : id = id ?? DateTime.now().microsecondsSinceEpoch.toString();
}

/// Player persistent save data model
class PlayerData {
  int cash;
  int speedLevel;
  int capacityLevel;
  int profitLevel;
  int activeMarketIndex;
  Set<String> unlockedAreas;
  int dailyStreak;
  int lastDailyClaimEpochDay;
  int lastSavedEpochSeconds;

  PlayerData({
    this.cash = 20, // Starting capital to build first shelf
    this.speedLevel = 1,
    this.capacityLevel = 1,
    this.profitLevel = 1,
    this.activeMarketIndex = 0,
    Set<String>? unlockedAreas,
    this.dailyStreak = 1,
    this.lastDailyClaimEpochDay = 0,
    int? lastSavedEpochSeconds,
  })  : unlockedAreas = unlockedAreas ?? {'field_tomato_1', 'shelf_tomato_1', 'cashier_1'},
        lastSavedEpochSeconds = lastSavedEpochSeconds ?? (DateTime.now().millisecondsSinceEpoch ~/ 1000);

  // Derived Properties
  int get maxCapacity => 4 + (capacityLevel - 1) * 3; // 4, 7, 10, 13, 16...
  double get moveSpeed => 180.0 + (speedLevel - 1) * 25.0; // 180, 205, 230...
  double get profitMultiplier => 1.0 + (profitLevel - 1) * 0.25; // 1.0x, 1.25x, 1.5x...

  // Upgrade Costs
  int get speedUpgradeCost => 25 * speedLevel * speedLevel;
  int get capacityUpgradeCost => 30 * capacityLevel * capacityLevel;
  int get profitUpgradeCost => 50 * profitLevel * profitLevel;

  Map<String, dynamic> toJson() {
    return {
      'cash': cash,
      'speedLevel': speedLevel,
      'capacityLevel': capacityLevel,
      'profitLevel': profitLevel,
      'activeMarketIndex': activeMarketIndex,
      'unlockedAreas': unlockedAreas.toList(),
      'dailyStreak': dailyStreak,
      'lastDailyClaimEpochDay': lastDailyClaimEpochDay,
      'lastSavedEpochSeconds': DateTime.now().millisecondsSinceEpoch ~/ 1000,
    };
  }

  factory PlayerData.fromJson(Map<String, dynamic> json) {
    return PlayerData(
      cash: json['cash'] as int? ?? 20,
      speedLevel: json['speedLevel'] as int? ?? 1,
      capacityLevel: json['capacityLevel'] as int? ?? 1,
      profitLevel: json['profitLevel'] as int? ?? 1,
      activeMarketIndex: json['activeMarketIndex'] as int? ?? 0,
      unlockedAreas: (json['unlockedAreas'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toSet() ??
          {'field_tomato_1', 'shelf_tomato_1', 'cashier_1'},
      dailyStreak: json['dailyStreak'] as int? ?? 1,
      lastDailyClaimEpochDay: json['lastDailyClaimEpochDay'] as int? ?? 0,
      lastSavedEpochSeconds: json['lastSavedEpochSeconds'] as int? ??
          (DateTime.now().millisecondsSinceEpoch ~/ 1000),
    );
  }
}
