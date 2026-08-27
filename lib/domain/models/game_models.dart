import 'package:flutter/material.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';

/// 17 Types of Goods in the Tycoon Ecosystem
enum ProductType {
  // Raw Harvest & Animal Produce
  tomato,
  corn,
  wheat,
  teaLeaf,
  sunflower,
  potato,
  egg,
  milk,

  // Intermediate & Processed Products
  flour,
  bread,
  teaCup,
  seeds,
  chips,
  yogurt,
  ayran,
  tomatoPaste,
  toast,
  coffee,
}

extension ProductTypeExt on ProductType {
  String get displayName {
    switch (this) {
      case ProductType.tomato:
        return 'Domates';
      case ProductType.corn:
        return 'Mısır';
      case ProductType.wheat:
        return 'Buğday';
      case ProductType.teaLeaf:
        return 'Çay Yaprağı';
      case ProductType.sunflower:
        return 'Ayçiçeği';
      case ProductType.potato:
        return 'Patates';
      case ProductType.egg:
        return 'Taze Yumurta';
      case ProductType.milk:
        return 'Çiğ Süt';
      case ProductType.flour:
        return 'Değirmen Unu';
      case ProductType.bread:
        return 'Somun Ekmek';
      case ProductType.teaCup:
        return 'Demlik Çay';
      case ProductType.seeds:
        return 'Kavruk Çekirdek';
      case ProductType.chips:
        return 'Külah Cips';
      case ProductType.yogurt:
        return 'Kase Yoğurt';
      case ProductType.ayran:
        return 'Bardak Ayran';
      case ProductType.tomatoPaste:
        return 'Kavanoz Salça';
      case ProductType.toast:
        return 'Yumurtalı Tost';
      case ProductType.coffee:
        return 'Espresso';
    }
  }

  NeoIconType get iconType {
    switch (this) {
      case ProductType.tomato:
        return NeoIconType.tomato;
      case ProductType.corn:
        return NeoIconType.corn;
      case ProductType.wheat:
      case ProductType.flour:
        return NeoIconType.wheat;
      case ProductType.bread:
      case ProductType.toast:
        return NeoIconType.bread;
      case ProductType.teaLeaf:
      case ProductType.teaCup:
      case ProductType.coffee:
        return NeoIconType.teaCup;
      case ProductType.sunflower:
      case ProductType.seeds:
        return NeoIconType.seeds;
      case ProductType.potato:
      case ProductType.chips:
        return NeoIconType.chips;
      case ProductType.egg:
        return NeoIconType.egg;
      case ProductType.milk:
      case ProductType.yogurt:
        return NeoIconType.milk;
      case ProductType.ayran:
        return NeoIconType.ayran;
      case ProductType.tomatoPaste:
        return NeoIconType.paste;
    }
  }

  Color get color {
    switch (this) {
      case ProductType.tomato:
        return NeoTheme.tomatoRed;
      case ProductType.corn:
        return NeoTheme.cornYellow;
      case ProductType.wheat:
        return const Color(0xFFFDE047);
      case ProductType.teaLeaf:
        return const Color(0xFF22C55E);
      case ProductType.sunflower:
        return const Color(0xFFF59E0B);
      case ProductType.potato:
        return const Color(0xFFB45309);
      case ProductType.egg:
        return const Color(0xFFFFFBEB);
      case ProductType.milk:
        return const Color(0xFFF8FAFC);
      case ProductType.flour:
        return const Color(0xFFE2E8F0);
      case ProductType.bread:
        return NeoTheme.breadGold;
      case ProductType.teaCup:
        return const Color(0xFFDC2626);
      case ProductType.seeds:
        return const Color(0xFF451A03);
      case ProductType.chips:
        return const Color(0xFFFBBF24);
      case ProductType.yogurt:
        return const Color(0xFFF1F5F9);
      case ProductType.ayran:
        return const Color(0xFFE0F2FE);
      case ProductType.tomatoPaste:
        return const Color(0xFFB91C1C);
      case ProductType.toast:
        return const Color(0xFFD97706);
      case ProductType.coffee:
        return NeoTheme.coffeeBrown;
    }
  }

  int get basePrice {
    switch (this) {
      case ProductType.tomato:
        return 5;
      case ProductType.corn:
        return 8;
      case ProductType.wheat:
        return 6;
      case ProductType.teaLeaf:
        return 7;
      case ProductType.sunflower:
        return 9;
      case ProductType.potato:
        return 8;
      case ProductType.egg:
        return 12;
      case ProductType.milk:
        return 14;
      case ProductType.flour:
        return 15;
      case ProductType.bread:
        return 28;
      case ProductType.teaCup:
        return 20;
      case ProductType.seeds:
        return 32;
      case ProductType.chips:
        return 35;
      case ProductType.yogurt:
        return 40;
      case ProductType.ayran:
        return 48;
      case ProductType.tomatoPaste:
        return 55;
      case ProductType.toast:
        return 65;
      case ProductType.coffee:
        return 35;
    }
  }

  double get growthSeconds {
    switch (this) {
      case ProductType.tomato:
        return 2.0;
      case ProductType.corn:
        return 2.5;
      case ProductType.wheat:
        return 2.2;
      case ProductType.teaLeaf:
        return 2.4;
      case ProductType.sunflower:
        return 2.8;
      case ProductType.potato:
        return 2.6;
      case ProductType.egg:
        return 3.0;
      case ProductType.milk:
        return 3.5;
      default:
        return 2.0;
    }
  }
}

/// 4 Specialized Worker Classes
enum WorkerRole {
  farmer,
  stocker,
  cashier,
  cleaner,
}

extension WorkerRoleExt on WorkerRole {
  String get title {
    switch (this) {
      case WorkerRole.farmer:
        return 'Tarım Hasatçısı';
      case WorkerRole.stocker:
        return 'Lojistik Rafçısı';
      case WorkerRole.cashier:
        return 'Kasiyer';
      case WorkerRole.cleaner:
        return 'Temizlik Görevlisi';
    }
  }

  String get description {
    switch (this) {
      case WorkerRole.farmer:
        return 'Tarladan ve hayvanlardan ürünleri toplayıp işleme makinelerine taşır.';
      case WorkerRole.stocker:
        return 'İmalathanedeki taze ürünleri alıp bakkal reyonlarına doldurur.';
      case WorkerRole.cashier:
        return 'Müşteri kuyruğunu hızla eritir, marketin tıkanmasını engeller.';
      case WorkerRole.cleaner:
        return 'Yere dökülen çamur ve kirleri temizler, müşteri akışını %40 hızlandırır.';
    }
  }

  NeoIconType get iconType {
    switch (this) {
      case WorkerRole.farmer:
        return NeoIconType.farmer;
      case WorkerRole.stocker:
        return NeoIconType.stocker;
      case WorkerRole.cashier:
        return NeoIconType.cashier;
      case WorkerRole.cleaner:
        return NeoIconType.cleaner;
    }
  }

  Color get color {
    switch (this) {
      case WorkerRole.farmer:
        return NeoTheme.grassGreen;
      case WorkerRole.stocker:
        return NeoTheme.cornYellow;
      case WorkerRole.cashier:
        return NeoTheme.purpleAccent;
      case WorkerRole.cleaner:
        return NeoTheme.boostCyan;
    }
  }
}

/// Worker upgrade data per class
class WorkerStats {
  int level;
  int hiredCount;

  WorkerStats({
    this.level = 1,
    this.hiredCount = 0,
  });

  int get capacity => 2 + (level - 1) * 2;
  double get speedMultiplier => 1.0 + (level - 1) * 0.20;
  double get processingSpeedMultiplier => 1.0 + (level - 1) * 0.25;

  int get hireCost => 80 + (hiredCount * 120);
  int get upgradeCost => 60 * level * level;

  Map<String, dynamic> toJson() => {
        'level': level,
        'hiredCount': hiredCount,
      };

  factory WorkerStats.fromJson(Map<String, dynamic> json) => WorkerStats(
        level: json['level'] as int? ?? 1,
        hiredCount: json['hiredCount'] as int? ?? 0,
      );
}

/// Delivery Courier Combo Order
class CourierOrder {
  final String id;
  final Map<ProductType, int> requiredItems;
  final int rewardCash;
  final int rewardGems;
  double remainingSeconds;

  CourierOrder({
    required this.id,
    required this.requiredItems,
    required this.rewardCash,
    required this.rewardGems,
    this.remainingSeconds = 60.0,
  });
}

/// Product instance carried or on shelf
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
  int gems;
  int speedLevel;
  int capacityLevel;
  int profitLevel;
  int activeMarketIndex;
  Set<String> unlockedAreas;
  int dailyStreak;
  int lastDailyClaimEpochDay;
  int lastSavedEpochSeconds;

  final Map<WorkerRole, WorkerStats> workerStats;

  PlayerData({
    this.cash = 20,
    this.gems = 0,
    this.speedLevel = 1,
    this.capacityLevel = 1,
    this.profitLevel = 1,
    this.activeMarketIndex = 0,
    Set<String>? unlockedAreas,
    this.dailyStreak = 1,
    this.lastDailyClaimEpochDay = 0,
    int? lastSavedEpochSeconds,
    Map<WorkerRole, WorkerStats>? workerStats,
  })  : unlockedAreas = unlockedAreas ?? {'field_tomato_1', 'shelf_tomato_1', 'cashier_1'},
        lastSavedEpochSeconds = lastSavedEpochSeconds ?? (DateTime.now().millisecondsSinceEpoch ~/ 1000),
        workerStats = workerStats ??
            {
              WorkerRole.farmer: WorkerStats(level: 1, hiredCount: 0),
              WorkerRole.stocker: WorkerStats(level: 1, hiredCount: 0),
              WorkerRole.cashier: WorkerStats(level: 1, hiredCount: 0),
              WorkerRole.cleaner: WorkerStats(level: 1, hiredCount: 0),
            };

  int get maxCapacity => 4 + (capacityLevel - 1) * 3;
  double get moveSpeed => 180.0 + (speedLevel - 1) * 25.0;
  double get profitMultiplier => 1.0 + (profitLevel - 1) * 0.25;

  int get speedUpgradeCost => 25 * speedLevel * speedLevel;
  int get capacityUpgradeCost => 30 * capacityLevel * capacityLevel;
  int get profitUpgradeCost => 50 * profitLevel * profitLevel;

  WorkerStats getWorkerStats(WorkerRole role) {
    return workerStats.putIfAbsent(role, () => WorkerStats());
  }

  Map<String, dynamic> toJson() {
    return {
      'cash': cash,
      'gems': gems,
      'speedLevel': speedLevel,
      'capacityLevel': capacityLevel,
      'profitLevel': profitLevel,
      'activeMarketIndex': activeMarketIndex,
      'unlockedAreas': unlockedAreas.toList(),
      'dailyStreak': dailyStreak,
      'lastDailyClaimEpochDay': lastDailyClaimEpochDay,
      'lastSavedEpochSeconds': DateTime.now().millisecondsSinceEpoch ~/ 1000,
      'workerStats': workerStats.map((k, v) => MapEntry(k.name, v.toJson())),
    };
  }

  factory PlayerData.fromJson(Map<String, dynamic> json) {
    final wStats = <WorkerRole, WorkerStats>{};
    final rawWorkers = json['workerStats'] as Map<String, dynamic>?;
    if (rawWorkers != null) {
      for (final role in WorkerRole.values) {
        if (rawWorkers.containsKey(role.name)) {
          wStats[role] = WorkerStats.fromJson(rawWorkers[role.name] as Map<String, dynamic>);
        } else {
          wStats[role] = WorkerStats();
        }
      }
    } else {
      for (final role in WorkerRole.values) {
        wStats[role] = WorkerStats();
      }
    }

    return PlayerData(
      cash: json['cash'] as int? ?? 20,
      gems: json['gems'] as int? ?? 0,
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
      workerStats: wStats,
    );
  }
}
