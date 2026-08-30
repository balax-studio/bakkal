import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flutter/material.dart';
import '../../core/theme/station_theme.dart';
import '../../domain/vehicle_model.dart';
import '../iso/iso_math.dart';
import '../iso/iso_shapes.dart';
import '../petrol_station_game.dart';

enum VehicleState {
  approachingHighway,
  enteringStation,
  movingToPump,
  waitingAtPump,
  refueling,
  serviced,
  movingToExit,
  exitingHighway,
}

class CustomerVehicleComponent extends PositionComponent
    with TapCallbacks, HasGameReference<PetrolStationGame> {
  final CustomerOrder order;
  final int pumpSlot;

  // Grid Koordinatları
  double gx;
  double gy;

  // Hedef Waypointler
  final List<Vector2> waypoints = [];
  int currentWaypointIndex = 0;

  VehicleState state = VehicleState.approachingHighway;
  double fuelProgress = 0.0;
  double _waitTime = 0.0;

  CustomerVehicleComponent({
    required this.order,
    required this.pumpSlot,
    required Vector2 parkPos,
  })  : gx = -3.0,
        gy = 15.6,
        super(
          size: Vector2(76, 44),
          anchor: Anchor.center,
          priority: 15,
        ) {
    // Waypoint rotasını hazırla
    waypoints.addAll([
      Vector2(6.0, 15.6), // 1. Giriş hizasına kadar otoyolda ilerle
      Vector2(6.0, 12.2), // 2. İstasyon giriş kapısına sap
      parkPos, // 3. Pompaya yanaş
      Vector2(19.0, 12.2), // 4. Çıkış kapısına ilerle
      Vector2(19.0, 18.8), // 5. Otoyol çıkış şeridine dön
      Vector2(28.0, 18.8), // 6. Otoyolda uzaklaş
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

    // Derinlik önceliğini grid derinliğine göre güncelle (Painter's algorithm)
    priority = (100 + (gx + gy) * 10).toInt();
  }

  @override
  void onTapDown(TapDownEvent event) {
    if (state == VehicleState.waitingAtPump) {
      game.onCustomerTapped(this);
    }
  }

  @override
  void update(double dt) {
    super.update(dt);

    switch (state) {
      case VehicleState.approachingHighway:
      case VehicleState.enteringStation:
      case VehicleState.movingToPump:
        _moveAlongWaypoints(dt, targetIndexLimit: 2, onFinished: () {
          state = VehicleState.waitingAtPump;
          game.onVehicleArrivedAtPump(this);
        });
        break;

      case VehicleState.waitingAtPump:
        _waitTime += dt;
        if (game.stationState.hasManager && _waitTime >= 1.5) {
          game.autoServiceCustomer(this);
        }
        break;

      case VehicleState.refueling:
        break;

      case VehicleState.serviced:
        state = VehicleState.movingToExit;
        currentWaypointIndex = 3; // Çıkış rotasına başla
        break;

      case VehicleState.movingToExit:
      case VehicleState.exitingHighway:
        _moveAlongWaypoints(dt, targetIndexLimit: waypoints.length - 1, onFinished: () {
          game.onCustomerExited(this);
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

    const speed = 4.2; // grid birimi / saniye
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

    final isNight = game.stationState.timeOfDay < 6.0 || game.stationState.timeOfDay >= 21.0;

    canvas.save();
    // Koordinatı yerel merkeze sıfırla
    canvas.translate(size.x / 2, size.y / 2);

    // 1. Temas Gölgesi
    drawContactShadow(canvas, gx: -0.9, gy: -0.5, w: 1.8, d: 1.0, opacity: 0.20);

    // 2. Far Işıkları (Gece)
    if (isNight) {
      final headlightPaint = Paint()
        ..style = PaintingStyle.fill
        ..color = const Color(0xFFFFF9C4).withValues(alpha: 0.35)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawCircle(const Offset(22, 12), 16.0, headlightPaint);
    }

    // 3. 3D İzometrik Araç Gövdesi
    final carColor = order.vehicleType.bodyColor;
    drawIsoBox(
      canvas,
      gx: -0.9,
      gy: -0.5,
      w: 1.8,
      d: 1.0,
      h: 0.45,
      color: carColor,
    );

    // 4. Kabin & Camlar
    drawIsoBox(
      canvas,
      gx: -0.5,
      gy: -0.35,
      w: 1.0,
      d: 0.7,
      h: 0.35,
      color: const Color(0xFF263238),
      baseZ: 0.45,
    );

    // 5. Tekerlekler (4 Koyu Blok)
    drawIsoBox(canvas, gx: -0.8, gy: -0.52, w: 0.35, d: 0.08, h: 0.22, color: Colors.black);
    drawIsoBox(canvas, gx: 0.45, gy: -0.52, w: 0.35, d: 0.08, h: 0.22, color: Colors.black);
    drawIsoBox(canvas, gx: -0.8, gy: 0.44, w: 0.35, d: 0.08, h: 0.22, color: Colors.black);
    drawIsoBox(canvas, gx: 0.45, gy: 0.44, w: 0.35, d: 0.08, h: 0.22, color: Colors.black);

    // 6. Talep Baloncuğu (Pompada beklerken)
    if (state == VehicleState.waitingAtPump) {
      _renderDemandBubble(canvas);
    }

    canvas.restore();
  }

  void _renderDemandBubble(Canvas canvas) {
    const bubbleW = 54.0;
    const bubbleH = 24.0;
    const bubbleOffset = Offset(-bubbleW / 2, -42.0);

    // Balon Zemin
    final bgPaint = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.white;

    final borderPaint = Paint()
      ..style = PaintingStyle.stroke
      ..color = StationTheme.ink.withValues(alpha: 0.25)
      ..strokeWidth = 1.0;

    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(bubbleOffset.dx, bubbleOffset.dy, bubbleW, bubbleH),
      const Radius.circular(8),
    );

    // Gölge
    canvas.drawRRect(
      rrect.shift(const Offset(0, 2)),
      Paint()..color = Colors.black.withValues(alpha: 0.12),
    );

    canvas.drawRRect(rrect, bgPaint);
    canvas.drawRRect(rrect, borderPaint);

    // Yakıt İkonu & Miktar
    final textPainter = TextPainter(
      text: TextSpan(
        children: [
          TextSpan(
            text: '${order.fuelType.shortName} ',
            style: TextStyle(
              fontSize: 9.5,
              fontWeight: FontWeight.bold,
              color: order.fuelType.color,
            ),
          ),
          TextSpan(
            text: '${order.demandedUnits.toInt()}L',
            style: const TextStyle(
              fontSize: 9.0,
              fontWeight: FontWeight.w900,
              color: StationTheme.ink,
            ),
          ),
        ],
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
