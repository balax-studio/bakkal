import 'package:flutter_test/flutter_test.dart';
import 'package:myminimarket/domain/models/game_models.dart';
import 'package:myminimarket/main.dart';
import 'package:myminimarket/services/retention_service.dart';
import 'package:myminimarket/ui/hud/hud_overlay.dart';

void main() {
  testWidgets('MiniMartApp boots with initial state', (WidgetTester tester) async {
    final playerData = PlayerData(cash: 50);
    final report = OfflineEarningsReport(elapsedSeconds: 0, earnedCash: 0, hasEarnings: false);

    await tester.pumpWidget(
      MiniMartApp(
        initialPlayerData: playerData,
        offlineReport: report,
      ),
    );

    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.byType(MiniMartApp), findsOneWidget);
    expect(find.byType(HUDOverlay), findsOneWidget);
  });
}
