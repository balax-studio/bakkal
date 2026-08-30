import 'package:flutter_test/flutter_test.dart';
import 'package:myminimarket/domain/fuel_type.dart';
import 'package:myminimarket/domain/station_state.dart';
import 'package:myminimarket/game/iso/iso_math.dart';
import 'package:myminimarket/main.dart';
import 'package:myminimarket/ui/hud/station_hud.dart';

void main() {
  testWidgets('PetrolStationApp boots with initial state and HUD',
      (WidgetTester tester) async {
    final stationState = StationState(initialMoney: 10000.0);

    await tester.pumpWidget(
      PetrolStationApp(
        initialStation: stationState,
      ),
    );

    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.byType(PetrolStationApp), findsOneWidget);
    expect(find.byType(StationHud), findsOneWidget);
  });

  test('StationState refuel deducts tank and adds cash correctly', () {
    final state = StationState(initialMoney: 1000.0);
    final initialBenzin = state.tanks[FuelType.benzin] ?? 0.0;

    final result = state.performRefuel(
      fuelType: FuelType.benzin,
      requestedUnits: 40.0,
      maxBudget: 2000.0,
    );

    expect(result['units'], 40.0);
    expect(state.tanks[FuelType.benzin], initialBenzin - 40.0);
    expect(state.money, 1000.0 + (result['earned'] ?? 0.0));
    expect(state.totalCustomersServed, 1);
  });

  test('Isometric Math transforms 2:1 dimetric grid correctly', () {
    // (0,0,0) should map to Offset(0,0)
    expect(iso(0, 0, 0), const Offset(0, 0));

    // (1, 1, 0) should have dx = 0, dy = kTileH (32)
    final p1 = iso(1, 1, 0);
    expect(p1.dx, 0.0);
    expect(p1.dy, 32.0);

    // Height gz lifts the point upwards
    final pZ = iso(0, 0, 2);
    expect(pZ.dy, -64.0);

    // Screen to Iso roundtrip
    const gridPos = Offset(4.0, 7.0);
    final screenPos = iso(gridPos.dx, gridPos.dy, 0.0);
    final roundtrip = screenToIso(screenPos);
    expect((roundtrip.dx - gridPos.dx).abs() < 0.001, true);
    expect((roundtrip.dy - gridPos.dy).abs() < 0.001, true);
  });
}
