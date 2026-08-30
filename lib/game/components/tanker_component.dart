import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/station_theme.dart';
import '../../domain/fuel_type.dart';
import '../iso/iso_math.dart';
import '../iso/iso_shapes.dart';
import '../petrol_station_game.dart';

enum TankerState {
  approaching,
  offloading,
  departing,
}

class TankerComponent extends PositionComponent
    with HasGameReference<PetrolStationGame> {
  final FuelType fuelType;
  final double amount;
  final VoidCallback onDelivered;

  double gx = -4.0;
  double gy = 15.6;

  final List<Vector2> waypoints = [];
  int currentWaypointIndex = 0;

  TankerState state = TankerState.approaching;
  double _offloadTimer = 0.0;

  TankerComponent({
    required this.fuelType,
    required this.amount,
    required this.onDelivered,
  }) : super(
          size: Vector2(90, 50),
          anchor: Anchor.center,
          priority: 20,
        ) {
    // Tanker rotası: Otoyoldan istasyon içi depolama tanklarına yanaşma
    waypoints.addAll([
      Vector2(6.0, 15.6), // 1. Giriş hizası
      Vector2(6.0, 12.0), // 2. İstasyon içi
      Vector2(19.0, 6.5), // 3. Tank boşaltma alanı (Tankların önü)
      Vector2(19.0, 12.0), // 4. Çıkış kapısı
      Vector2(19.0, 18.8), // 5. Otoyol çıkış şeridi
      Vector2(28.0, 18.8), // 6. Uzaklaşma
    ]);
  }

  @override
  void onLoad() {
    super.onLoad();
    _syncScreenPosition();
  }

  void _syncScreenPosition() {
    final centerOffset = Offset(game.size.x / 2, game.size.y * 0.32);
    final screenOffset = iso(gx, gy, 0.0) + centerOffset;
    position.setValues(screenOffset.dx, screenOffset.dy);
    priority = (100 + (gx + gy) * 10).toInt();
  }

  @override
  void update(double dt) {
    super.update(dt);

    switch (state) {
      case TankerState.approaching:
        _moveAlongWaypoints(dt, targetIndexLimit: 2, onFinished: () {
          state = TankerState.offloading;
          _offloadTimer = 0.0;
        });
        break;

      case TankerState.offloading:
        _offloadTimer += dt;
        if (_offloadTimer >= 3.0) {
          onDelivered();
          state = TankerState.departing;
          currentWaypointIndex = 3;
        }
        break;

      case TankerState.departing:
        _moveAlongWaypoints(dt, targetIndexLimit: waypoints.length - 1, onFinished: () {
          removeFromParent();
        });
        break;
    }

    _syncScreenPosition();
  }

  void _moveAlongWaypoints(
    double dt, {
    required int targetIndexLimit,
    required VoidCallback onFinished,
  }) {
    if (currentWaypointIndex > targetIndexLimit || currentWaypointIndex >= waypoints.length) {
      onFinished();
      return;
    }

    final target = waypoints[currentWaypointIndex];
    final dx = target.x - gx;
    final dy = target.y - gy;
    final dist = math.sqrt(dx * dx + dy * dy);

    const speed = 3.6; // grid / sn
    final step = speed * dt;

    if (dist <= step) {
      gx = target.x;
      gy = target.y;
      currentWaypointIndex++;
      if (currentWaypointIndex > targetIndexLimit) {
        onFinished();
      }
    } else {
      gx += (dx / dist) * step;
      gy += (dy / dist) * step;
    }
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    canvas.save();
    canvas.translate(size.x / 2, size.y / 2);

    // 1. Temas Gölgesi
    drawContactShadow(canvas, gx: -1.2, gy: -0.6, w: 2.6, d: 1.2, opacity: 0.22);

    // 2. Tanker Cistern Gövdesi (Açık Gri / Beyaz)
    drawIsoBox(
      canvas,
      gx: -1.2,
      gy: -0.6,
      w: 1.8,
      d: 1.1,
      h: 0.7,
      color: const Color(0xFFE2E8F0),
    );

    // 3. Yakıt Tipi Renk Şeridi
    drawIsoBox(
      canvas,
      gx: -1.1,
      gy: 0.45,
      w: 1.6,
      d: 0.08,
      h: 0.25,
      color: fuelType.color,
      baseZ: 0.25,
    );

    // 4. Kamyon Çekici Kabini (Kırmızı)
    drawIsoBox(
      canvas,
      gx: 0.6,
      gy: -0.55,
      w: 0.8,
      d: 1.0,
      h: 0.6,
      color: StationTheme.red,
    );

    // 5. Kabin Camı
    drawIsoBox(
      canvas,
      gx: 0.7,
      gy: -0.45,
      w: 0.6,
      d: 0.8,
      h: 0.3,
      color: const Color(0xFF1E293B),
      baseZ: 0.6,
    );

    // 6. Boşaltım Süresince İlerleme Göstergesi
    if (state == TankerState.offloading) {
      _renderOffloadIndicator(canvas);
    }

    canvas.restore();
  }

  void _renderOffloadIndicator(Canvas canvas) {
    const bubbleW = 60.0;
    const bubbleH = 22.0;
    const bubbleOffset = Offset(-bubbleW / 2, -40.0);

    final bgPaint = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.white;

    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(bubbleOffset.dx, bubbleOffset.dy, bubbleW, bubbleH),
      const Radius.circular(6),
    );

    canvas.drawRRect(rrect.shift(const Offset(0, 2)), Paint()..color = Colors.black.withValues(alpha: 0.12));
    canvas.drawRRect(rrect, bgPaint);

    final textPainter = TextPainter(
      text: TextSpan(
        text: '⛽ +${amount.toInt()}L',
        style: TextStyle(
          fontSize: 9.5,
          fontWeight: FontWeight.w900,
          color: fuelType.color,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();

    textPainter.paint(
      canvas,
      Offset(
        bubbleOffset.dx + (bubbleW - textPainter.width) / 2,
        bubbleOffset.dy + (bubbleH - textPainter.height) / 2,
      ),
    );
  }
}
