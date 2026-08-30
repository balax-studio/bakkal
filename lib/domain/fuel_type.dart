import 'package:flutter/material.dart';
import '../core/theme/station_theme.dart';

enum FuelType {
  benzin,
  dizel,
  lpg,
  elektrik;

  String get displayName {
    switch (this) {
      case FuelType.benzin:
        return 'Benzin (95)';
      case FuelType.dizel:
        return 'Motorin (Dizel)';
      case FuelType.lpg:
        return 'Otogaz (LPG)';
      case FuelType.elektrik:
        return 'Hızlı Şarj (kWh)';
    }
  }

  String get shortName {
    switch (this) {
      case FuelType.benzin:
        return 'Benzin';
      case FuelType.dizel:
        return 'Dizel';
      case FuelType.lpg:
        return 'LPG';
      case FuelType.elektrik:
        return 'EV';
    }
  }

  String get unit {
    return this == FuelType.elektrik ? 'kWh' : 'L';
  }

  Color get color {
    switch (this) {
      case FuelType.benzin:
        return StationTheme.green;
      case FuelType.dizel:
        return StationTheme.orange;
      case FuelType.lpg:
        return StationTheme.blue;
      case FuelType.elektrik:
        return StationTheme.evCyan;
    }
  }

  Color get darkColor {
    switch (this) {
      case FuelType.benzin:
        return StationTheme.greenDark;
      case FuelType.dizel:
        return StationTheme.orangeDark;
      case FuelType.lpg:
        return StationTheme.blueDark;
      case FuelType.elektrik:
        return StationTheme.evCyanDark;
    }
  }

  double get defaultPricePerUnit {
    switch (this) {
      case FuelType.benzin:
        return 43.5;
      case FuelType.dizel:
        return 44.0;
      case FuelType.lpg:
        return 22.5;
      case FuelType.elektrik:
        return 8.5;
    }
  }

  double get defaultCostPerUnit {
    switch (this) {
      case FuelType.benzin:
        return 37.0;
      case FuelType.dizel:
        return 38.0;
      case FuelType.lpg:
        return 17.5;
      case FuelType.elektrik:
        return 5.0;
    }
  }
}
