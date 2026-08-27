import 'package:flutter/material.dart';

/// Neo-Brutalist Design Tokens & Color Palette
class NeoTheme {
  // Vibrant 16-Bit / Neo-Brutalist Palette
  static const Color bgCanvas = Color(0xFFF4EFE6); // Warm retro background
  static const Color gridDot = Color(0xFFDED6C7); // Floor grid
  static const Color inkBlack = Color(0xFF141419); // Bold border stroke
  static const Color hardShadow = Color(0xFF141419); // 45-degree hard drop shadow
  static const Color shadowBlack = Color(0x33000000); // Translucent ground shadow

  // Product & Object Colors
  static const Color tomatoRed = Color(0xFFFF2E55);
  static const Color tomatoLeaf = Color(0xFF00E676);
  static const Color cornYellow = Color(0xFFFFD000);
  static const Color breadGold = Color(0xFFFF9E1B);
  static const Color milkWhite = Color(0xFFFFFFFF);
  static const Color coffeeBrown = Color(0xFF6D4C41);

  // Economy & Dopamine Accents
  static const Color cashGreen = Color(0xFF00E676);
  static const Color cashDarkGreen = Color(0xFF00A352);
  static const Color goldCoin = Color(0xFFFFD000);
  static const Color boostCyan = Color(0xFF00F0FF);
  static const Color purpleAccent = Color(0xFF8B5CF6);
  static const Color coralOrange = Color(0xFFFF6B00);

  // Architectural Colors
  static const Color woodShelf = Color(0xFFE0A96D);
  static const Color woodDark = Color(0xFFB8783C);
  static const Color counterGray = Color(0xFFECEFF1);
  static const Color soilBrown = Color(0xFF6D4C41);
  static const Color grassGreen = Color(0xFF7CB342);

  // Border & Shadow Dimensions
  static const double strokeWidth = 3.0;
  static const double shadowOffset = 4.0;
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
      boxShadow: neoBoxShadow(offset: shadow),
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
      final shadowPaint = Paint()..color = inkBlack;
      canvas.drawRect(shadowRect, shadowPaint);
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
      final shadowPaint = Paint()..color = inkBlack;
      canvas.drawRRect(shadowRRect, shadowPaint);
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
      ..strokeJoin = StrokeJoin.miter;
  }

  static Paint fill(Color color) {
    return Paint()
      ..color = color
      ..style = PaintingStyle.fill;
  }
}
