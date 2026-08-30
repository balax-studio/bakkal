import 'dart:async';
import 'package:flame/game.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/theme/station_theme.dart';
import 'domain/station_state.dart';
import 'game/components/customer_vehicle_component.dart';
import 'game/petrol_station_game.dart';
import 'services/save_service.dart';
import 'ui/hud/station_hud.dart';
import 'ui/modals/construction_modal.dart';
import 'ui/modals/fuel_order_modal.dart';
import 'ui/modals/office_modal.dart';
import 'ui/panels/pump_service_panel.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Enforce Portrait Orientation on mobile platforms (skip on web/desktop)
  if (!kIsWeb) {
    try {
      await SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
        DeviceOrientation.portraitDown,
      ]);
      SystemChrome.setSystemUIOverlayStyle(
        const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
        ),
      );
    } catch (_) {}
  }

  // Load Saved Game Data
  final initialStation = await SaveService.loadStation();

  runApp(
    PetrolStationApp(
      initialStation: initialStation,
    ),
  );
}

class PetrolStationApp extends StatefulWidget {
  final StationState initialStation;

  const PetrolStationApp({
    super.key,
    required this.initialStation,
  });

  @override
  State<PetrolStationApp> createState() => _PetrolStationAppState();
}

class _PetrolStationAppState extends State<PetrolStationApp>
    with WidgetsBindingObserver {
  late StationState _stationState;
  late PetrolStationGame _game;
  CustomerVehicleComponent? _selectedVehicle;
  Timer? _autoSaveTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _stationState = widget.initialStation;

    _game = PetrolStationGame(
      stationState: _stationState,
      onOpenPumpPanel: (vehicle) {
        setState(() {
          _selectedVehicle = vehicle;
        });
        _game.overlays.add('pumpPanel');
      },
    );

    // Auto-save every 30 seconds
    _autoSaveTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      SaveService.saveStation(_stationState);
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _autoSaveTimer?.cancel();
    SaveService.saveStation(_stationState);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      SaveService.saveStation(_stationState);
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'İstasyon: Mola Yeri Tycoon',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: StationTheme.skyBlue,
        fontFamily: 'Baloo 2',
        useMaterial3: true,
      ),
      home: Scaffold(
        backgroundColor: StationTheme.skyBlue,
        body: GameWidget<PetrolStationGame>(
          game: _game,
          initialActiveOverlays: const ['hud'],
          overlayBuilderMap: {
            // 1. Station HUD (Top status bar & Bottom radial FAB)
            'hud': (context, game) => StationHud(
                  stationState: _stationState,
                  onOpenBuild: () {
                    game.overlays.add('construction');
                  },
                  onOpenOrder: () {
                    game.overlays.add('fuelOrder');
                  },
                  onOpenOffice: () {
                    game.overlays.add('office');
                  },
                ),

            // 2. Interactive Pump Service Panel
            'pumpPanel': (context, game) {
              final vehicle = _selectedVehicle ?? game.activeSelectedVehicle;
              if (vehicle == null) {
                return const SizedBox.shrink();
              }
              return PumpServicePanel(
                vehicle: vehicle,
                stationState: _stationState,
                onComplete: ({
                  required vehicle,
                  required filledUnits,
                  required earnedCash,
                  bool cleanedWindows = false,
                }) {
                  game.completeService(
                    vehicle: vehicle,
                    filledUnits: filledUnits,
                    earnedCash: earnedCash,
                    cleanedWindows: cleanedWindows,
                  );
                  game.overlays.remove('pumpPanel');
                  setState(() {
                    _selectedVehicle = null;
                  });
                },
                onDismiss: () {
                  game.overlays.remove('pumpPanel');
                  setState(() {
                    _selectedVehicle = null;
                  });
                },
              );
            },

            // 3. Construction & Upgrades Modal
            'construction': (context, game) => ConstructionModal(
                  stationState: _stationState,
                  onClose: () {
                    game.overlays.remove('construction');
                  },
                ),

            // 4. Fuel Order Modal
            'fuelOrder': (context, game) => FuelOrderModal(
                  stationState: _stationState,
                  onClose: () {
                    game.overlays.remove('fuelOrder');
                  },
                ),

            // 5. Office & Finance Modal
            'office': (context, game) => OfficeModal(
                  stationState: _stationState,
                  onClose: () {
                    game.overlays.remove('office');
                  },
                ),
          },
        ),
      ),
    );
  }
}
