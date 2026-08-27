import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'neo_theme.dart';

enum NeoIconType {
  cash,
  gem,
  gift,
  lightning,
  teaCup,
  worker,
  farmer,
  stocker,
  cashier,
  cleaner,
  upgrade,
  tomato,
  corn,
  wheat,
  bread,
  milk,
  ayran,
  paste,
  chips,
  seeds,
  egg,
  motorcycle,
  thief,
  crown,
  close,
  check,
}

class NeoIcon extends StatelessWidget {
  final NeoIconType type;
  final double size;
  final Color? color;

  const NeoIcon(
    this.type, {
    super.key,
    this.size = 20.0,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _NeoIconPainter(type: type, customColor: color),
    );
  }
}

class _NeoIconPainter extends CustomPainter {
  final NeoIconType type;
  final Color? customColor;

  _NeoIconPainter({required this.type, this.customColor});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final cx = w * 0.5;
    final cy = h * 0.5;

    final stroke = Paint()
      ..color = NeoTheme.inkBlack
      ..style = PaintingStyle.stroke
      ..strokeWidth = math.max(1.5, w * 0.08)
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final fill = Paint()..style = PaintingStyle.fill;

    switch (type) {
      case NeoIconType.cash:
        // Banknote with border and $ mark
        final rect = RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(cx, cy), width: w * 0.9, height: h * 0.65),
          const Radius.circular(3),
        );
        fill.color = customColor ?? NeoTheme.cashGreen;
        canvas.drawRRect(rect, fill);
        canvas.drawRRect(rect, stroke);

        // Center circle
        canvas.drawCircle(Offset(cx, cy), w * 0.16, Paint()..color = Colors.white);
        canvas.drawCircle(Offset(cx, cy), w * 0.16, stroke);
        break;

      case NeoIconType.gem:
        // Diamond Polygon
        final path = Path()
          ..moveTo(cx, h * 0.12)
          ..lineTo(w * 0.88, cy * 0.7)
          ..lineTo(cx, h * 0.92)
          ..lineTo(w * 0.12, cy * 0.7)
          ..close();
        fill.color = customColor ?? NeoTheme.boostCyan;
        canvas.drawPath(path, fill);
        canvas.drawPath(path, stroke);

        // Top facet facet line
        canvas.drawLine(Offset(w * 0.3, cy * 0.7), Offset(w * 0.7, cy * 0.7), stroke);
        break;

      case NeoIconType.gift:
        // Gift box with ribbon
        final boxRect = RRect.fromRectAndRadius(
          Rect.fromLTWH(w * 0.15, h * 0.35, w * 0.7, h * 0.55),
          const Radius.circular(3),
        );
        fill.color = customColor ?? NeoTheme.cornYellow;
        canvas.drawRRect(boxRect, fill);
        canvas.drawRRect(boxRect, stroke);

        // Lid
        final lidRect = RRect.fromRectAndRadius(
          Rect.fromLTWH(w * 0.1, h * 0.22, w * 0.8, h * 0.18),
          const Radius.circular(2),
        );
        canvas.drawRRect(lidRect, Paint()..color = NeoTheme.tomatoRed);
        canvas.drawRRect(lidRect, stroke);

        // Vertical Ribbon
        canvas.drawLine(Offset(cx, h * 0.22), Offset(cx, h * 0.9), stroke);
        break;

      case NeoIconType.lightning:
        // Thunder bolt
        final path = Path()
          ..moveTo(cx + w * 0.1, h * 0.08)
          ..lineTo(w * 0.18, h * 0.52)
          ..lineTo(cx, h * 0.52)
          ..lineTo(cx - w * 0.1, h * 0.92)
          ..lineTo(w * 0.82, h * 0.44)
          ..lineTo(cx + w * 0.05, h * 0.44)
          ..close();
        fill.color = customColor ?? NeoTheme.goldCoin;
        canvas.drawPath(path, fill);
        canvas.drawPath(path, stroke);
        break;

      case NeoIconType.teaCup:
        // Turkish Tea Glass
        final cupPath = Path()
          ..moveTo(cx - w * 0.25, h * 0.22)
          ..cubicTo(cx - w * 0.32, h * 0.45, cx - w * 0.12, h * 0.6, cx - w * 0.2, h * 0.78)
          ..lineTo(cx + w * 0.2, h * 0.78)
          ..cubicTo(cx + w * 0.12, h * 0.6, cx + w * 0.32, h * 0.45, cx + w * 0.25, h * 0.22)
          ..close();
        fill.color = customColor ?? NeoTheme.tomatoRed;
        canvas.drawPath(cupPath, fill);
        canvas.drawPath(cupPath, stroke);

        // Saucer
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, h * 0.84), width: w * 0.75, height: h * 0.16), Paint()..color = Colors.white);
        canvas.drawOval(Rect.fromCenter(center: Offset(cx, h * 0.84), width: w * 0.75, height: h * 0.16), stroke);
        break;

      case NeoIconType.worker:
        // Builder Hard Hat
        final hatPath = Path()
          ..moveTo(w * 0.15, h * 0.65)
          ..lineTo(w * 0.85, h * 0.65)
          ..lineTo(w * 0.9, h * 0.72)
          ..lineTo(w * 0.1, h * 0.72)
          ..close();
        fill.color = customColor ?? NeoTheme.cornYellow;

        final domePath = Path()
          ..addArc(Rect.fromCenter(center: Offset(cx, h * 0.62), width: w * 0.65, height: h * 0.65), math.pi, math.pi);
        canvas.drawPath(domePath, fill);
        canvas.drawPath(domePath, stroke);
        canvas.drawPath(hatPath, fill);
        canvas.drawPath(hatPath, stroke);
        break;

      case NeoIconType.farmer:
        // Wheat Sprout
        final path = Path()
          ..moveTo(cx, h * 0.88)
          ..lineTo(cx, h * 0.2)
          ..moveTo(cx, h * 0.4)
          ..lineTo(w * 0.75, h * 0.25)
          ..moveTo(cx, h * 0.55)
          ..lineTo(w * 0.25, h * 0.4);
        stroke.color = customColor ?? NeoTheme.grassGreen;
        canvas.drawPath(path, stroke);
        stroke.color = NeoTheme.inkBlack;
        canvas.drawCircle(Offset(cx, h * 0.2), w * 0.1, Paint()..color = NeoTheme.grassGreen);
        canvas.drawCircle(Offset(cx, h * 0.2), w * 0.1, stroke);
        break;

      case NeoIconType.stocker:
        // Cardboard Box
        final box = RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(cx, cy), width: w * 0.75, height: h * 0.7),
          const Radius.circular(3),
        );
        fill.color = customColor ?? const Color(0xFFD97706);
        canvas.drawRRect(box, fill);
        canvas.drawRRect(box, stroke);
        // Tape line
        canvas.drawLine(Offset(cx, h * 0.15), Offset(cx, h * 0.85), Paint()..color = Colors.white..strokeWidth = 2);
        break;

      case NeoIconType.cashier:
        // Credit Card / Terminal
        final card = RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset(cx, cy), width: w * 0.85, height: h * 0.6),
          const Radius.circular(4),
        );
        fill.color = customColor ?? NeoTheme.purpleAccent;
        canvas.drawRRect(card, fill);
        canvas.drawRRect(card, stroke);
        canvas.drawRect(Rect.fromLTWH(w * 0.15, h * 0.35, w * 0.7, h * 0.15), Paint()..color = const Color(0xFF1E293B));
        break;

      case NeoIconType.cleaner:
        // Broom
        final handle = Path()
          ..moveTo(w * 0.2, h * 0.2)
          ..lineTo(cx + w * 0.1, cy + h * 0.1);
        canvas.drawPath(handle, stroke..strokeWidth = 3.0);
        stroke.strokeWidth = math.max(1.5, w * 0.08);

        final bristles = Path()
          ..moveTo(cx, cy)
          ..lineTo(w * 0.85, cy + h * 0.1)
          ..lineTo(w * 0.75, h * 0.85)
          ..lineTo(cx + w * 0.05, h * 0.75)
          ..close();
        canvas.drawPath(bristles, Paint()..color = NeoTheme.boostCyan);
        canvas.drawPath(bristles, stroke);
        break;

      case NeoIconType.upgrade:
        // Chevron Arrow Up
        final arrow = Path()
          ..moveTo(w * 0.2, h * 0.65)
          ..lineTo(cx, h * 0.25)
          ..lineTo(w * 0.8, h * 0.65)
          ..lineTo(cx + w * 0.15, h * 0.65)
          ..lineTo(cx + w * 0.15, h * 0.85)
          ..lineTo(cx - w * 0.15, h * 0.85)
          ..lineTo(cx - w * 0.15, h * 0.65)
          ..close();
        fill.color = customColor ?? Colors.white;
        canvas.drawPath(arrow, fill);
        canvas.drawPath(arrow, stroke);
        break;

      case NeoIconType.tomato:
        final tRect = Rect.fromCenter(center: Offset(cx, cy + 2), width: w * 0.75, height: h * 0.68);
        canvas.drawOval(tRect, Paint()..color = NeoTheme.tomatoRed);
        canvas.drawOval(tRect, stroke);
        // Leaf
        canvas.drawCircle(Offset(cx, cy - h * 0.28), w * 0.12, Paint()..color = NeoTheme.grassGreen);
        canvas.drawCircle(Offset(cx, cy - h * 0.28), w * 0.12, stroke);
        break;

      case NeoIconType.corn:
        final cRect = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: w * 0.55, height: h * 0.75), Radius.circular(w * 0.25));
        canvas.drawRRect(cRect, Paint()..color = NeoTheme.cornYellow);
        canvas.drawRRect(cRect, stroke);
        break;

      case NeoIconType.wheat:
        canvas.drawLine(Offset(cx, h * 0.85), Offset(cx, h * 0.15), stroke);
        for (int i = 0; i < 3; i++) {
          final gy = h * (0.3 + i * 0.18);
          canvas.drawOval(Rect.fromCenter(center: Offset(cx - w * 0.18, gy), width: w * 0.25, height: h * 0.12), Paint()..color = NeoTheme.goldCoin);
          canvas.drawOval(Rect.fromCenter(center: Offset(cx - w * 0.18, gy), width: w * 0.25, height: h * 0.12), stroke);
          canvas.drawOval(Rect.fromCenter(center: Offset(cx + w * 0.18, gy), width: w * 0.25, height: h * 0.12), Paint()..color = NeoTheme.goldCoin);
          canvas.drawOval(Rect.fromCenter(center: Offset(cx + w * 0.18, gy), width: w * 0.25, height: h * 0.12), stroke);
        }
        break;

      case NeoIconType.bread:
        final bRect = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: w * 0.8, height: h * 0.5), const Radius.circular(6));
        canvas.drawRRect(bRect, Paint()..color = NeoTheme.breadGold);
        canvas.drawRRect(bRect, stroke);
        canvas.drawLine(Offset(cx - w * 0.18, cy - h * 0.15), Offset(cx - w * 0.1, cy + h * 0.15), stroke);
        canvas.drawLine(Offset(cx + w * 0.1, cy - h * 0.15), Offset(cx + w * 0.18, cy + h * 0.15), stroke);
        break;

      case NeoIconType.milk:
        final bottle = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy + 2), width: w * 0.5, height: h * 0.65), const Radius.circular(4));
        canvas.drawRRect(bottle, Paint()..color = Colors.white);
        canvas.drawRRect(bottle, stroke);
        canvas.drawRect(Rect.fromCenter(center: Offset(cx, cy - h * 0.32), width: w * 0.3, height: h * 0.12), Paint()..color = NeoTheme.boostCyan);
        canvas.drawRect(Rect.fromCenter(center: Offset(cx, cy - h * 0.32), width: w * 0.3, height: h * 0.12), stroke);
        break;

      case NeoIconType.ayran:
        final cup = Path()
          ..moveTo(cx - w * 0.25, h * 0.25)
          ..lineTo(cx - w * 0.2, h * 0.8)
          ..lineTo(cx + w * 0.2, h * 0.8)
          ..lineTo(cx + w * 0.25, h * 0.25)
          ..close();
        canvas.drawPath(cup, Paint()..color = const Color(0xFFE0F2FE));
        canvas.drawPath(cup, stroke);
        // Straw
        canvas.drawLine(Offset(cx, h * 0.3), Offset(cx + w * 0.15, h * 0.1), stroke..strokeWidth = 2.5);
        stroke.strokeWidth = math.max(1.5, w * 0.08);
        break;

      case NeoIconType.paste:
        final can = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: w * 0.65, height: h * 0.7), const Radius.circular(4));
        canvas.drawRRect(can, Paint()..color = const Color(0xFFB91C1C));
        canvas.drawRRect(can, stroke);
        break;

      case NeoIconType.chips:
        final bag = Path()
          ..moveTo(cx - w * 0.25, h * 0.3)
          ..lineTo(cx - w * 0.15, h * 0.85)
          ..lineTo(cx + w * 0.15, h * 0.85)
          ..lineTo(cx + w * 0.25, h * 0.3)
          ..close();
        canvas.drawPath(bag, Paint()..color = const Color(0xFFFBBF24));
        canvas.drawPath(bag, stroke);
        // Fries sticks
        canvas.drawLine(Offset(cx - 3, h * 0.3), Offset(cx - 3, h * 0.15), Paint()..color = NeoTheme.goldCoin..strokeWidth = 3);
        canvas.drawLine(Offset(cx + 3, h * 0.3), Offset(cx + 3, h * 0.12), Paint()..color = NeoTheme.goldCoin..strokeWidth = 3);
        break;

      case NeoIconType.seeds:
        final sPath = Path()
          ..moveTo(cx, h * 0.15)
          ..cubicTo(w * 0.8, cy, w * 0.7, h * 0.85, cx, h * 0.85)
          ..cubicTo(w * 0.3, h * 0.85, w * 0.2, cy, cx, h * 0.15);
        canvas.drawPath(sPath, Paint()..color = const Color(0xFF451A03));
        canvas.drawPath(sPath, stroke);
        break;

      case NeoIconType.egg:
        final eggOval = Rect.fromCenter(center: Offset(cx, cy), width: w * 0.6, height: h * 0.75);
        canvas.drawOval(eggOval, Paint()..color = Colors.white);
        canvas.drawOval(eggOval, stroke);
        break;

      case NeoIconType.motorcycle:
        // Scooter Icon
        canvas.drawCircle(Offset(cx - w * 0.25, cy + h * 0.15), w * 0.15, Paint()..color = const Color(0xFF1E293B));
        canvas.drawCircle(Offset(cx - w * 0.25, cy + h * 0.15), w * 0.15, stroke);
        canvas.drawCircle(Offset(cx + w * 0.25, cy + h * 0.15), w * 0.15, Paint()..color = const Color(0xFF1E293B));
        canvas.drawCircle(Offset(cx + w * 0.25, cy + h * 0.15), w * 0.15, stroke);
        canvas.drawLine(Offset(cx - w * 0.2, cy + h * 0.15), Offset(cx + w * 0.1, cy - h * 0.15), stroke);
        canvas.drawRect(Rect.fromLTWH(cx - w * 0.35, cy - h * 0.2, w * 0.25, h * 0.25), Paint()..color = NeoTheme.cornYellow);
        canvas.drawRect(Rect.fromLTWH(cx - w * 0.35, cy - h * 0.2, w * 0.25, h * 0.25), stroke);
        break;

      case NeoIconType.thief:
        // Mask
        final mask = RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(cx, cy), width: w * 0.8, height: h * 0.35), const Radius.circular(4));
        canvas.drawRRect(mask, Paint()..color = const Color(0xFF1E293B));
        canvas.drawRRect(mask, stroke);
        canvas.drawCircle(Offset(cx - w * 0.18, cy), 2.5, Paint()..color = Colors.white);
        canvas.drawCircle(Offset(cx + w * 0.18, cy), 2.5, Paint()..color = Colors.white);
        break;

      case NeoIconType.crown:
        // 3-point Crown
        final crownPath = Path()
          ..moveTo(w * 0.15, h * 0.75)
          ..lineTo(w * 0.15, h * 0.35)
          ..lineTo(w * 0.35, h * 0.55)
          ..lineTo(cx, h * 0.2)
          ..lineTo(w * 0.65, h * 0.55)
          ..lineTo(w * 0.85, h * 0.35)
          ..lineTo(w * 0.85, h * 0.75)
          ..close();
        fill.color = customColor ?? NeoTheme.goldCoin;
        canvas.drawPath(crownPath, fill);
        canvas.drawPath(crownPath, stroke);
        break;

      case NeoIconType.close:
        canvas.drawLine(Offset(w * 0.25, h * 0.25), Offset(w * 0.75, h * 0.75), stroke);
        canvas.drawLine(Offset(w * 0.75, h * 0.25), Offset(w * 0.25, h * 0.75), stroke);
        break;

      case NeoIconType.check:
        final check = Path()
          ..moveTo(w * 0.2, cy)
          ..lineTo(cx - w * 0.05, h * 0.75)
          ..lineTo(w * 0.8, h * 0.25);
        canvas.drawPath(check, stroke);
        break;
    }
  }

  @override
  bool shouldRepaint(covariant _NeoIconPainter oldDelegate) =>
      oldDelegate.type != type || oldDelegate.customColor != customColor;
}
