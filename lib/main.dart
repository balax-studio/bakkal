import 'package:flame/game.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

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
        scaffoldBackgroundColor: NeoTheme.bgCanvas,
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      home: GameScreen(
        playerData: initialPlayerData,
        offlineReport: offlineReport,
      ),
    );
  }
}

class GameScreen extends StatefulWidget {
  final PlayerData playerData;
  final OfflineEarningsReport offlineReport;

  const GameScreen({
    super.key,
    required this.playerData,
    required this.offlineReport,
  });

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  late final MiniMartGame _game;

  bool _showOfflineModal = false;
  bool _showDailyModal = false;
  bool _showUpgradesModal = false;

  @override
  void initState() {
    super.initState();
    _game = MiniMartGame(playerData: widget.playerData);

    // If returning player has offline earnings, show welcome back modal
    if (widget.offlineReport.hasEarnings) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        setState(() => _showOfflineModal = true);
      });
    }
  }

  @override
  void dispose() {
    _game.saveGame();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 1. Flame Game Engine Canvas
          Positioned.fill(
            child: GameWidget(game: _game),
          ),

          // 2. Neo-Brutalist HUD Overlay
          Positioned.fill(
            child: HUDOverlay(
              game: _game,
              onOpenUpgrades: () => setState(() => _showUpgradesModal = true),
              onOpenDailyStreak: () => setState(() => _showDailyModal = true),
            ),
          ),

          // 3. Offline / AFK Earnings Modal
          if (_showOfflineModal)
            Positioned.fill(
              child: Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: OfflineEarningsModal(
                  game: _game,
                  report: widget.offlineReport,
                  onClose: () => setState(() => _showOfflineModal = false),
                ),
              ),
            ),

          // 4. Daily Streak Reward Modal
          if (_showDailyModal)
            Positioned.fill(
              child: Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: DailyRewardModal(
                  game: _game,
                  onClose: () => setState(() => _showDailyModal = false),
                ),
              ),
            ),

          // 5. Upgrades Modal
          if (_showUpgradesModal)
            Positioned.fill(
              child: Container(
                color: Colors.black.withValues(alpha: 0.55),
                child: UpgradesModal(
                  game: _game,
                  onClose: () => setState(() => _showUpgradesModal = false),
                ),
              ),
            ),

          // 6. Level Complete / Truck Delivery Modal
          ValueListenableBuilder<bool>(
            valueListenable: _game.showLevelCompleteModal,
            builder: (context, showModal, _) {
              if (!showModal) return const SizedBox.shrink();
              return Positioned.fill(
                child: Container(
                  color: Colors.black.withValues(alpha: 0.6),
                  child: LevelCompleteModal(game: _game),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
