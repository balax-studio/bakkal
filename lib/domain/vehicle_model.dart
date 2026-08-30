import 'package:flutter/material.dart';
import 'fuel_type.dart';

enum VehicleType {
  sedan('Sedan Otomobil', Color(0xFF4A90E2), 35.0, 55.0, 1.0),
  taksi('Sarı Taksi', Color(0xFFF5A623), 25.0, 45.0, 1.2),
  hatchback('Şehir Arabası', Color(0xFFE94E77), 20.0, 40.0, 0.9),
  minibus('Yolcu Minibüsü', Color(0xFF50E3C2), 45.0, 70.0, 1.3),
  kamyon('Yük Kamyonu', Color(0xFF795548), 80.0, 150.0, 1.5),
  otobus('Şehirlerarası Otobüs', Color(0xFF3F51B5), 100.0, 200.0, 2.0),
  elektrikliSuv('Elektrikli SUV', Color(0xFF00BCD4), 30.0, 60.0, 1.4);

  final String name;
  final Color bodyColor;
  final double minFuel;
  final double maxFuel;
  final double tipMultiplier;

  const VehicleType(
    this.name,
    this.bodyColor,
    this.minFuel,
    this.maxFuel,
    this.tipMultiplier,
  );
}

class CustomerOrder {
  final String id;
  final VehicleType vehicleType;
  final FuelType fuelType;
  final double demandedUnits;
  final double maxBudget;
  final bool wantsWash;
  final bool wantsMarket;

  CustomerOrder({
    required this.id,
    required this.vehicleType,
    required this.fuelType,
    required this.demandedUnits,
    required this.maxBudget,
    this.wantsWash = false,
    this.wantsMarket = false,
  });
}
