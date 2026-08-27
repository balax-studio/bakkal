import 'package:flutter_test/flutter_test.dart';
import 'package:myminimarket/domain/models/game_models.dart';
import 'package:myminimarket/main.dart';
import 'package:myminimarket/services/retention_service.dart';

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

    expect(find.byType(MiniMartApp), findsOneWidget);
  });
}
