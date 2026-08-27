import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_theme.dart';
import '../../domain/models/game_models.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import '../physics/collision_system.dart';
import 'effects_component.dart';

class CashierComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String id;
  int accumulatedCash = 0;
  bool isCashierPresent = false;
  double checkoutTimer = 0.0;

  late final SolidBox solidCollider;

  CashierComponent({
    required this.id,
    required Vector2 position,
  }) : super(
          position: position,
          size: Vector2(130, 95),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y);

    // Solid obstacle bounds for physics collision
    solidCollider = SolidBox(
      id: id,
      bounds: Rect.fromCenter(
        center: Offset(position.x, position.y + 4),
        width: 100,
        height: 60,
      ),
      label: 'Cashier Counter',
    );
  }

  Vector2 get customerQueueStart => position + Vector2(-65, 15);
  Vector2 get cashierStandPosition => position + Vector2(25, -28);
  Vector2 get cashTrayPosition => position + Vector2(28, 24);

  void addCash(int amount) {
    accumulatedCash += amount;
  }

  @override
  Future<void> onLoad() async {
    await super.onLoad();
    game.physicsWorld.addObstacle(solidCollider);
  }

  @override
  void onRemove() {
    game.physicsWorld.removeObstacle(id);
    super.onRemove();
  }

  @override
  void update(double dt) {
    super.update(dt);

    // 1. Check if player or worker is standing behind register
    final player = game.player;
    final distToRegister = (player.position - cashierStandPosition).length;
    final hasWorkerCashier = game.playerData.unlockedAreas.contains('worker_cashier_1') ||
        game.playerData.getWorkerStats(WorkerRole.cashier).hiredCount > 0;

    isCashierPresent = (distToRegister < 50.0) || hasWorkerCashier;

    // 2. Check if player is near cash tray to collect accumulated cash
    final distToCash = (player.position - cashTrayPosition).length;
    if (distToCash < 55.0 && accumulatedCash > 0) {
      final cashToGive = accumulatedCash;
      accumulatedCash = 0;

      final totalCash = (cashToGive * game.playerData.profitMultiplier).round();
      game.playerData.cash += totalCash;
      game.notifyStateChanged();

      SoundService.playCashCollect();
      HapticService.medium();

      game.world.add(
        ParticleBurstComponent(
          position: cashTrayPosition,
          colors: [NeoTheme.cashGreen, NeoTheme.goldCoin, Colors.white],
        ),
      );
      game.world.add(
        FloatingTextComponent(
          text: '+$totalCash',
          position: cashTrayPosition - Vector2(0, 25),
          color: NeoTheme.cashGreen,
        ),
      );
    }
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 108.0;
    const h = 54.0;
    const depth = 20.0; // 2.5D counter height

    // 1. Drop Shadow
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 4)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 4)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // 2. Front-Left Face (Counter Side)
    final leftSidePath = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftSidePath, Paint()..color = const Color(0xFF64748B));
    canvas.drawPath(leftSidePath, NeoTheme.stroke(width: 3.0));

    // 3. Front-Right Face (Counter Front)
    final rightSidePath = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightSidePath, Paint()..color = const Color(0xFF475569));
    canvas.drawPath(rightSidePath, NeoTheme.stroke(width: 3.0));

    // 4. Top Isometric Counter Surface
    final topCounterPath = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topCounterPath, Paint()..color = const Color(0xFF94A3B8));
    canvas.drawPath(topCounterPath, NeoTheme.stroke(width: 3.0));

    // 5. Conveyor Belt Area (Dark textured rubber)
    final beltPath = Path()
      ..moveTo(cx - 28, cy - 14)
      ..lineTo(cx + 8, cy + 4)
      ..lineTo(cx - 10, cy + 18)
      ..lineTo(cx - 44, cy)
      ..close();
    canvas.drawPath(beltPath, Paint()..color = const Color(0xFF1E293B));
    canvas.drawPath(beltPath, NeoTheme.stroke(width: 1.5));

    // 6. POS Terminal Unit
    final posCenter = Offset(cx + 26, cy - 8);
    final posRect = Rect.fromCenter(center: posCenter, width: 22, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(posRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFF0F172A)),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );

    // POS Screen (Green if staffed, Red if waiting)
    final screenColor = isCashierPresent ? NeoTheme.cashGreen : NeoTheme.tomatoRed;
    canvas.drawRect(
      Rect.fromCenter(center: Offset(posCenter.dx, posCenter.dy - 2), width: 14, height: 8),
      Paint()..color = screenColor,
    );

    // 7. Cash Stacks
    if (accumulatedCash > 0) {
      final billCount = math.min((accumulatedCash / 10).ceil(), 6);
      final cashCenter = Offset(cx + 26, cy + 12);
      for (int i = 0; i < billCount; i++) {
        final billRect = Rect.fromCenter(
          center: Offset(cashCenter.dx, cashCenter.dy - (i * 2.5)),
          width: 20,
          height: 10,
        );
        NeoTheme.drawNeoRRect(
          canvas,
          RRect.fromRectAndRadius(billRect, const Radius.circular(2)),
          fillPaint: NeoTheme.fill(NeoTheme.cashGreen),
          strokePaint: NeoTheme.stroke(width: 1.2),
          shadowOffset: 1.0,
        );
      }

      final cashSpan = TextSpan(
        text: '\$$accumulatedCash',
        style: const TextStyle(
          color: NeoTheme.inkBlack,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          fontFamily: 'sans-serif',
        ),
      );
      final tp = TextPainter(text: cashSpan, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(cashCenter.dx - tp.width / 2, cy + depth + 4));
    }

    // 8. Status Header Pill
    final statusText = isCashierPresent ? 'KASA AÇIK' : 'KASİYER BEKLİYOR';
    final span = TextSpan(
      text: statusText,
      style: TextStyle(
        color: isCashierPresent ? NeoTheme.cashDarkGreen : NeoTheme.tomatoRed,
        fontSize: 9,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final tp = TextPainter(text: span, textDirection: TextDirection.ltr);
    tp.layout();

    final pillRect = Rect.fromCenter(center: Offset(cx, cy - h * 0.5 - 12), width: tp.width + 12, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(pillRect, const Radius.circular(6)),
      fillPaint: NeoTheme.fill(Colors.white),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    tp.paint(canvas, Offset(cx - tp.width / 2, cy - h * 0.5 - 12 - tp.height / 2));
  }
}
