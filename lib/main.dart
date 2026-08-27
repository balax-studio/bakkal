import 'package:flame/game.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'core/theme/neo_theme.dart';
import 'domain/models/game_models.dart';
import 'game/mini_mart_game.dart';
import 'services/retention_service.dart';
import 'services/save_service.dart';
import 'ui/hud/hud_overlay.dart';
import 'ui/overlays/daily_reward_modal.dart';
import 'ui/overlays/level_complete_modal.dart';
import 'ui/overlays/offline_earnings_modal.dart';
import 'ui/overlays/upgrades_modal.dart';

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
  final playerData = await SaveService.loadPlayerData();

  // Calculate Offline / AFK Earnings
  final offlineReport = RetentionService.calculateOfflineEarnings(playerData);

  runApp(
    MiniMartApp(
      initialPlayerData: playerData,
      offlineReport: offlineReport,
    ),
  );
}

class MiniMartApp extends StatelessWidget {
  final PlayerData initialPlayerData;
  final OfflineEarningsReport offlineReport;

  const MiniMartApp({
    super.key,
    required this.initialPlayerData,
    required this.offlineReport,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bakkal: Idle Tycoon',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: NeoTheme.bgCanvas,
        fontFamily: 'Roboto',
      ),
      home: GameScreen(
        playerData: initialPlayerData,
        offlineReport: offlineReport,
      ),
    );
  }
}

class GameScreen extends StatelessWidget {
  final PlayerData playerData;
  final OfflineEarningsReport offlineReport;

  const GameScreen({
    super.key,
    required this.playerData,
    required this.offlineReport,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NeoTheme.bgCanvas,
      body: GameWidget<MiniMartGame>.controlled(
        gameFactory: () => MiniMartGame(playerData: playerData),
        overlayBuilderMap: {
          'hud': (context, game) => HUDOverlay(
                game: game,
                onOpenUpgrades: () => game.overlays.add('upgrades'),
                onOpenDailyStreak: () => game.overlays.add('daily'),
              ),
          'offline': (context, game) => Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: OfflineEarningsModal(
                  game: game,
                  report: offlineReport,
                  onClose: () => game.overlays.remove('offline'),
                ),
              ),
          'daily': (context, game) => Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: DailyRewardModal(
                  game: game,
                  onClose: () => game.overlays.remove('daily'),
                ),
              ),
          'upgrades': (context, game) => Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: UpgradesModal(
                  game: game,
                  onClose: () => game.overlays.remove('upgrades'),
                ),
              ),
          'levelComplete': (context, game) => Container(
                color: Colors.black.withValues(alpha: 0.6),
                child: LevelCompleteModal(game: game),
              ),
        },
        initialActiveOverlays: [
          'hud',
          if (offlineReport.hasEarnings) 'offline',
        ],
      ),
    );
  }
}
