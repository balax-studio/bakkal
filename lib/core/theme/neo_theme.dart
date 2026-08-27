import 'package:flutter/material.dart';

/// Neo-Brutalist Design Tokens & Color Palette
class NeoTheme {
  // Vibrant 16-Bit / Neo-Brutalist Palette
  static const Color bgCanvas = Color(0xFF5AB9EA); // Sky blue canvas
  static const Color gridDot = Color(0xFFDED6C7); // Floor grid
  static const Color inkBlack = Color(0xFF0F172A); // Ultra-deep slate black border
  static const Color hardShadow = Color(0xFF0F172A); // 45-degree hard drop shadow
  static const Color shadowBlack = Color(0x33000000); // Translucent ground shadow

  // Pre-allocated static Paints (Zero GC Pressure in Flame render loop)
  static final Paint shadowPaint = Paint()..color = const Color(0x33000000);
  static final Paint solidShadow = Paint()..color = const Color(0xFF0F172A);
  static final Paint darkExtrusion = Paint()..color = const Color(0xFF1E293B);
  static final Paint stroke2_0 = stroke(width: 2.0);
  static final Paint stroke2_5 = stroke(width: 2.5);
  static final Paint stroke3_0 = stroke(width: 3.0);
  static final Paint glowPaint = Paint()..color = const Color(0x66FBBF24);

  // Product & Object Colors
  static const Color tomatoRed = Color(0xFFEF4444);
  static const Color tomatoLeaf = Color(0xFF22C55E);
  static const Color cornYellow = Color(0xFFFBBF24);
  static const Color breadGold = Color(0xFFF59E0B);
  static const Color milkWhite = Color(0xFFFFFFFF);
  static const Color coffeeBrown = Color(0xFF78350F);

  // Economy & Dopamine Accents
  static const Color cashGreen = Color(0xFF10B981);
  static const Color cashDarkGreen = Color(0xFF047857);
  static const Color goldCoin = Color(0xFFFACC15);
  static const Color boostCyan = Color(0xFF06B6D4);
  static const Color purpleAccent = Color(0xFF8B5CF6);
  static const Color coralOrange = Color(0xFFF97316);

  // Architectural Colors
  static const Color woodShelf = Color(0xFFD97706);
  static const Color woodDark = Color(0xFF92400E);
  static const Color counterGray = Color(0xFF334155);
  static const Color soilBrown = Color(0xFF451A03);
  static const Color grassGreen = Color(0xFF16A34A);
  static const Color mintFloor = Color(0xFFECFDF5);
  static const Color ivoryFloor = Color(0xFFFAF8F5);

  // Border & Shadow Dimensions
  static const double strokeWidth = 2.5;
  static const double shadowOffset = 3.5;
  static const double borderRadius = 12.0;

  // Neo-Brutalist Box Shadow
  static List<BoxShadow> neoBoxShadow({
    double offset = shadowOffset,
    Color color = inkBlack,
  }) {
    return [
      BoxShadow(
        color: color,
        offset: Offset(offset, offset),
        blurRadius: 0,
        spreadRadius: 0,
      ),
    ];
  }

  // Neo-Brutalist Box Decoration Helper
  static BoxDecoration neoCardDecoration({
    Color color = Colors.white,
    double radius = borderRadius,
    Color borderColor = inkBlack,
    double borderWidth = strokeWidth,
    double shadow = shadowOffset,
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: neoBoxShadow(offset: shadow, color: borderColor),
    );
  }

  // Canvas Drawing Helpers for Flame Custom Painters
  static void drawNeoRect(
    Canvas canvas,
    Rect rect, {
    required Paint fillPaint,
    Paint? strokePaint,
    double shadowOffset = 3.0,
  }) {
    if (shadowOffset > 0) {
      final shadowRect = rect.shift(Offset(shadowOffset, shadowOffset));
      canvas.drawRect(shadowRect, solidShadow);
    }
    canvas.drawRect(rect, fillPaint);
    if (strokePaint != null) {
      canvas.drawRect(rect, strokePaint);
    }
  }

  static void drawNeoRRect(
    Canvas canvas,
    RRect rrect, {
    required Paint fillPaint,
    Paint? strokePaint,
    double shadowOffset = 3.0,
  }) {
    if (shadowOffset > 0) {
      final shadowRRect = rrect.shift(Offset(shadowOffset, shadowOffset));
      canvas.drawRRect(shadowRRect, solidShadow);
    }
    canvas.drawRRect(rrect, fillPaint);
    if (strokePaint != null) {
      canvas.drawRRect(rrect, strokePaint);
    }
  }

  static Paint stroke({double width = strokeWidth, Color color = inkBlack}) {
    return Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
  }

  static Paint fill(Color color) {
    return Paint()
      ..color = color
      ..style = PaintingStyle.fill;
  }
}
