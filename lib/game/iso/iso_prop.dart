import 'package:flutter/material.dart';
import 'iso_math.dart';
import 'iso_shapes.dart';

/// Sahnedeki tek bir çizilebilir izometrik nesne.
abstract class IsoProp {
  double get gx;
  double get gy;

  /// Ayak izi — derinlik sıralamasında merkez hesabı için.
  double get w;
  double get d;

  /// Painter's algorithm sıralama anahtarı (Ayak izinin MERKEZİ kullanılır).
  double get depth => (gx + w / 2) + (gy + d / 2);

  void render(Canvas canvas);
}

/// Özel çizim fonksiyonu alan esnek IsoProp
class CustomIsoProp extends IsoProp {
  @override
  final double gx;
  @override
  final double gy;
  @override
  final double w;
  @override
  final double d;

  final void Function(Canvas canvas) onRender;

  CustomIsoProp({
    required this.gx,
    required this.gy,
    required this.w,
    required this.d,
    required this.onRender,
  });

  @override
  void render(Canvas canvas) {
    onRender(canvas);
  }
}

/// Basit Kutu Prop
class BoxIsoProp extends IsoProp {
  @override
  final double gx;
  @override
  final double gy;
  @override
  final double w;
  @override
  final double d;
  final double h;
  final double baseZ;
  final Color color;
  final bool hasShadow;

  BoxIsoProp({
    required this.gx,
    required this.gy,
    required this.w,
    required this.d,
    required this.h,
    required this.color,
    this.baseZ = 0.0,
    this.hasShadow = true,
  });

  @override
  void render(Canvas canvas) {
    if (hasShadow && baseZ == 0.0) {
      drawContactShadow(canvas, gx: gx, gy: gy, w: w, d: d);
    }
    drawIsoBox(
      canvas,
      gx: gx,
      gy: gy,
      w: w,
      d: d,
      h: h,
      color: color,
      baseZ: baseZ,
    );
  }
}

/// Low-Poly İzometrik Çam/Ağaç Prop
class TreeIsoProp extends IsoProp {
  @override
  final double gx;
  @override
  final double gy;
  @override
  double get w => 1.0;
  @override
  double get d => 1.0;

  final Color foliageColor;
  final double scale;

  TreeIsoProp({
    required this.gx,
    required this.gy,
    required this.foliageColor,
    this.scale = 1.0,
  });

  @override
  void render(Canvas canvas) {
    // 1. Gölge
    drawContactShadow(canvas, gx: gx, gy: gy, w: 0.8 * scale, d: 0.8 * scale);

    // 2. Gövde
    drawIsoCylinder(
      canvas,
      gx: gx + 0.4 * scale,
      gy: gy + 0.4 * scale,
      radius: 0.14 * scale,
      h: 0.6 * scale,
      color: const Color(0xFF6B4C35),
    );

    // 3. Koni Yaprak Katmanları
    drawIsoCone(
      canvas,
      gx: gx + 0.4 * scale,
      gy: gy + 0.4 * scale,
      radius: 0.6 * scale,
      h: 1.1 * scale,
      color: foliageColor,
      baseZ: 0.4 * scale,
    );

    drawIsoCone(
      canvas,
      gx: gx + 0.4 * scale,
      gy: gy + 0.4 * scale,
      radius: 0.45 * scale,
      h: 0.9 * scale,
      color: shadeTop(foliageColor),
      baseZ: 0.9 * scale,
    );
  }
}

/// Sokak Lambası Direği Prop
class LampIsoProp extends IsoProp {
  @override
  final double gx;
  @override
  final double gy;
  @override
  double get w => 0.5;
  @override
  double get d => 0.5;

  final bool isNight;

  LampIsoProp({
    required this.gx,
    required this.gy,
    this.isNight = false,
  });

  @override
  void render(Canvas canvas) {
    // Gece parlaması
    if (isNight) {
      final groundPos = iso(gx + 0.25, gy + 0.25, 0);
      final glowPaint = Paint()
        ..style = PaintingStyle.fill
        ..color = const Color(0xFFFFE082).withValues(alpha: 0.28)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);
      canvas.drawCircle(groundPos, 36.0, glowPaint);
    }

    drawContactShadow(canvas, gx: gx, gy: gy, w: 0.4, d: 0.4);

    // Direk
    drawIsoCylinder(
      canvas,
      gx: gx + 0.2,
      gy: gy + 0.2,
      radius: 0.06,
      h: 2.2,
      color: const Color(0xFF5A626A),
    );

    // Üst lamba başlığı
    drawIsoBox(
      canvas,
      gx: gx + 0.1,
      gy: gy + 0.1,
      w: 0.4,
      d: 0.4,
      h: 0.2,
      color: isNight ? const Color(0xFFFFD54F) : const Color(0xFFE0E0E0),
      baseZ: 2.2,
    );
  }
}
