import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'iso_math.dart';

/// İzometrik 3D Kutu Çizer (Flat Shaded, Outline YOK).
void drawIsoBox(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double w,
  required double d,
  required double h,
  required Color color,
  double baseZ = 0.0,
}) {
  final pTop = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeTop(color);

  final pLeft = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeLeft(color);

  final pRight = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeRight(color);

  // 1. Sağ yüz (+gx yönüne bakan, ekranda sağda)
  final pathRight = Path()
    ..moveTo(iso(gx + w, gy, baseZ + h).dx, iso(gx + w, gy, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy + d, baseZ + h).dx, iso(gx + w, gy + d, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy + d, baseZ).dx, iso(gx + w, gy + d, baseZ).dy)
    ..lineTo(iso(gx + w, gy, baseZ).dx, iso(gx + w, gy, baseZ).dy)
    ..close();
  canvas.drawPath(pathRight, pRight);

  // 2. Sol yüz (+gy yönüne bakan, ekranda solda)
  final pathLeft = Path()
    ..moveTo(iso(gx, gy + d, baseZ + h).dx, iso(gx, gy + d, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy + d, baseZ + h).dx, iso(gx + w, gy + d, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy + d, baseZ).dx, iso(gx + w, gy + d, baseZ).dy)
    ..lineTo(iso(gx, gy + d, baseZ).dx, iso(gx, gy + d, baseZ).dy)
    ..close();
  canvas.drawPath(pathLeft, pLeft);

  // 3. Üst yüz (en açık, taban rengin kendisi)
  final pathTop = Path()
    ..moveTo(iso(gx, gy, baseZ + h).dx, iso(gx, gy, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy, baseZ + h).dx, iso(gx + w, gy, baseZ + h).dy)
    ..lineTo(iso(gx + w, gy + d, baseZ + h).dx, iso(gx + w, gy + d, baseZ + h).dy)
    ..lineTo(iso(gx, gy + d, baseZ + h).dx, iso(gx, gy + d, baseZ + h).dy)
    ..close();
  canvas.drawPath(pathTop, pTop);
}

/// İzometrik Üçgen Prizma (Çatı, Tente vb.)
void drawIsoPrism(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double w,
  required double d,
  required double h,
  required Color color,
  double baseZ = 0.0,
  Axis ridgeAlong = Axis.horizontal,
}) {
  final pSlope1 = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeTop(color);

  final pSlope2 = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeLeft(color);

  final pGable = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeRight(color);

  if (ridgeAlong == Axis.horizontal) {
    // Sırt X ekseninde (ortadan geçen hat)
    final midY = gy + d / 2;
    final r1 = iso(gx, midY, baseZ + h);
    final r2 = iso(gx + w, midY, baseZ + h);

    final b1 = iso(gx, gy, baseZ);
    final b2 = iso(gx + w, gy, baseZ);
    final b3 = iso(gx + w, gy + d, baseZ);
    final b4 = iso(gx, gy + d, baseZ);

    // Arka eğim
    final pathBack = Path()
      ..moveTo(b1.dx, b1.dy)
      ..lineTo(b2.dx, b2.dy)
      ..lineTo(r2.dx, r2.dy)
      ..lineTo(r1.dx, r1.dy)
      ..close();
    canvas.drawPath(pathBack, pSlope1);

    // Ön eğim
    final pathFront = Path()
      ..moveTo(r1.dx, r1.dy)
      ..lineTo(r2.dx, r2.dy)
      ..lineTo(b3.dx, b3.dy)
      ..lineTo(b4.dx, b4.dy)
      ..close();
    canvas.drawPath(pathFront, pSlope2);

    // Yan üçgen (sağ)
    final pathRight = Path()
      ..moveTo(b2.dx, b2.dy)
      ..lineTo(b3.dx, b3.dy)
      ..lineTo(r2.dx, r2.dy)
      ..close();
    canvas.drawPath(pathRight, pGable);
  } else {
    // Sırt Y ekseninde
    final midX = gx + w / 2;
    final r1 = iso(midX, gy, baseZ + h);
    final r2 = iso(midX, gy + d, baseZ + h);

    final b1 = iso(gx, gy, baseZ);
    final b2 = iso(gx + w, gy, baseZ);
    final b3 = iso(gx + w, gy + d, baseZ);
    final b4 = iso(gx, gy + d, baseZ);

    final pathSlopeL = Path()
      ..moveTo(b1.dx, b1.dy)
      ..lineTo(r1.dx, r1.dy)
      ..lineTo(r2.dx, r2.dy)
      ..lineTo(b4.dx, b4.dy)
      ..close();
    canvas.drawPath(pathSlopeL, pSlope1);

    final pathSlopeR = Path()
      ..moveTo(r1.dx, r1.dy)
      ..lineTo(b2.dx, b2.dy)
      ..lineTo(b3.dx, b3.dy)
      ..lineTo(r2.dx, r2.dy)
      ..close();
    canvas.drawPath(pathSlopeR, pSlope2);

    final pathFront = Path()
      ..moveTo(b4.dx, b4.dy)
      ..lineTo(r2.dx, r2.dy)
      ..lineTo(b3.dx, b3.dy)
      ..close();
    canvas.drawPath(pathFront, pGable);
  }
}

/// İzometrik Silindir (Tanklar, Ağaç Gövdeleri, Direkler)
void drawIsoCylinder(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double radius, // grid cinsinden yarıçap
  required double h,
  required Color color,
  double baseZ = 0.0,
}) {
  final rPixels = radius * (kTileW / 2);
  final rYPixels = radius * (kTileH / 2);

  final baseCenter = iso(gx, gy, baseZ);
  final topCenter = iso(gx, gy, baseZ + h);

  final pBody = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeLeft(color);

  final pTop = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeTop(color);

  // Gövde yolu: alt elipsin sol-sağ kenarlarından üst elipsin sol-sağ kenarlarına
  final bodyPath = Path()
    ..moveTo(baseCenter.dx - rPixels, baseCenter.dy)
    ..lineTo(topCenter.dx - rPixels, topCenter.dy)
    ..arcToPoint(
      Offset(topCenter.dx + rPixels, topCenter.dy),
      radius: Radius.elliptical(rPixels, rYPixels),
      clockwise: false,
    )
    ..lineTo(baseCenter.dx + rPixels, baseCenter.dy)
    ..arcToPoint(
      Offset(baseCenter.dx - rPixels, baseCenter.dy),
      radius: Radius.elliptical(rPixels, rYPixels),
      clockwise: true,
    )
    ..close();

  canvas.drawPath(bodyPath, pBody);

  // Üst kapak elipsi
  final topRect = Rect.fromCenter(
    center: topCenter,
    width: rPixels * 2,
    height: rYPixels * 2,
  );
  canvas.drawOval(topRect, pTop);
}

/// İzometrik Koni (Low-Poly Çam/Ağaç Tepeleri)
void drawIsoCone(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double radius,
  required double h,
  required Color color,
  double baseZ = 0.0,
}) {
  final rPixels = radius * (kTileW / 2);
  final rYPixels = radius * (kTileH / 2);

  final baseCenter = iso(gx, gy, baseZ);
  final apex = iso(gx, gy, baseZ + h);

  final pCone = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeLeft(color);

  final pHighlight = Paint()
    ..style = PaintingStyle.fill
    ..color = shadeTop(color);

  // Koni gövdesi
  final conePath = Path()
    ..moveTo(baseCenter.dx - rPixels, baseCenter.dy)
    ..lineTo(apex.dx, apex.dy)
    ..lineTo(baseCenter.dx + rPixels, baseCenter.dy)
    ..arcToPoint(
      Offset(baseCenter.dx - rPixels, baseCenter.dy),
      radius: Radius.elliptical(rPixels, rYPixels),
      clockwise: true,
    )
    ..close();

  canvas.drawPath(conePath, pCone);

  // Koni sol-üst aydınlatma vurgusu
  final lightPath = Path()
    ..moveTo(baseCenter.dx - rPixels, baseCenter.dy)
    ..lineTo(apex.dx, apex.dy)
    ..lineTo(baseCenter.dx, baseCenter.dy + rYPixels)
    ..arcToPoint(
      Offset(baseCenter.dx - rPixels, baseCenter.dy),
      radius: Radius.elliptical(rPixels, rYPixels),
      clockwise: false,
    )
    ..close();

  canvas.drawPath(lightPath, pHighlight);
}

/// Zemin Poligonu Doldurucu (Çim, Asfalt, Şerit Çizgileri)
void drawIsoQuad(
  Canvas canvas, {
  required Offset p1,
  required Offset p2,
  required Offset p3,
  required Offset p4,
  required Color color,
}) {
  final paint = Paint()
    ..style = PaintingStyle.fill
    ..color = color;

  final path = Path()
    ..moveTo(p1.dx, p1.dy)
    ..lineTo(p2.dx, p2.dy)
    ..lineTo(p3.dx, p3.dy)
    ..lineTo(p4.dx, p4.dy)
    ..close();

  canvas.drawPath(path, paint);
}

/// Grid tabanlı Düz Zemin Karesi
void drawIsoTile(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double w,
  required double d,
  required Color color,
}) {
  drawIsoQuad(
    canvas,
    p1: iso(gx, gy, 0),
    p2: iso(gx + w, gy, 0),
    p3: iso(gx + w, gy + d, 0),
    p4: iso(gx, gy + d, 0),
    color: color,
  );
}

/// Temas Gölgesi (Her prop altında yumuşak elips)
void drawContactShadow(
  Canvas canvas, {
  required double gx,
  required double gy,
  required double w,
  required double d,
  double opacity = 0.16,
}) {
  final center = iso(gx + w / 2, gy + d / 2, 0);
  final widthPixels = (w + d) * (kTileW / 4) * 1.1;
  final heightPixels = (w + d) * (kTileH / 4) * 1.1;

  final paint = Paint()
    ..style = PaintingStyle.fill
    ..color = Colors.black.withValues(alpha: opacity)
    ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3.0);

  final shadowRect = Rect.fromCenter(
    center: center,
    width: math.max(12.0, widthPixels),
    height: math.max(6.0, heightPixels),
  );

  canvas.drawOval(shadowRect, paint);
}
