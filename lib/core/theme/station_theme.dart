import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class StationTheme {
  // Neo-Brutalist & BenelOil Palette
  static const Color paper = Color(0xFFFAF6EC);
  static const Color paperDark = Color(0xFFF1EBDB);
  static const Color paperLight = Color(0xFFFFFDF8);
  static const Color ink = Color(0xFF22303C);
  static const Color muted = Color(0xFF7A8290);
  static const Color line = Color(0x2822303C);
  static const Color edge = Color(0xFF22303C); // 100% solid dark ink for neo-brutalist crisp edges

  // Accent & Fuel Colors
  static const Color red = Color(0xFFD64545);
  static const Color redDark = Color(0xFFB23434);

  static const Color green = Color(0xFF27A05A);
  static const Color greenDark = Color(0xFF1D7C45);

  static const Color orange = Color(0xFFE8862E);
  static const Color orangeDark = Color(0xFFBD6A1E);

  static const Color blue = Color(0xFF2F6FED);
  static const Color blueDark = Color(0xFF1E4BB0);

  static const Color evCyan = Color(0xFF1FA8BC);
  static const Color evCyanDark = Color(0xFF167B8A);

  static const Color amber = Color(0xFFFFBE4D);
  static const Color amberDark = Color(0xFFD69A33);

  static const Color skyBlue = Color(0xFFBFE0EE);
  static const Color grassGreen = Color(0xFF75B96B);
  static const Color asphalt = Color(0xFF2B343D);
  static const Color asphaltLight = Color(0xFF3B4652);

  // 2.5D Isometric Diorama Palette (beneloil.com flat-shaded)
  static const Color isoGrass = Color(0xFF6FA84F);
  static const Color isoAsphalt = Color(0xFF3A3F44);
  static const Color isoConcrete = Color(0xFFC9CCC8);
  static const Color isoConcreteEdge = Color(0xFFA5A8A4);
  static const Color isoBuilding = Color(0xFFF2EDE1);
  static const Color isoRoof = Color(0xFF4A5057);
  static const Color isoTree = Color(0xFF3E8E4F);
  static const Color isoTrunk = Color(0xFF6B4C35);
  static const Color isoWindow = Color(0xFF6B8B9B);
  static const Color isoWindowNight = Color(0xFFFFD54F);
  static const Color isoRoadLineYellow = Color(0xFFFFD13B);
  static const Color isoRoadLineWhite = Color(0xFFEBEBEB);

  // Digital LED LCD Display Colors
  static const Color lcdBg = Color(0xFF0C1712);
  static const Color lcdBorder = Color(0xFF24322A);
  static const Color ledGreen = Color(0xFF57F19A);
  static const Color ledAmber = Color(0xFFFFBE4D);
  static const Color ledDim = Color(0xFF1A3326);

  // Radii
  static const double rSm = 10.0;
  static const double rMd = 16.0;
  static const double rLg = 20.0;

  // Soft Diorama Shadows (Faz 7 uyumu)
  static List<BoxShadow> get softShadow => [
        BoxShadow(
          color: ink.withValues(alpha: 0.12),
          offset: const Offset(0, 4),
          blurRadius: 12,
        ),
      ];

  static List<BoxShadow> get softShadowSmall => [
        BoxShadow(
          color: ink.withValues(alpha: 0.08),
          offset: const Offset(0, 2),
          blurRadius: 6,
        ),
      ];

  static List<BoxShadow> get softShadowLarge => [
        BoxShadow(
          color: ink.withValues(alpha: 0.16),
          offset: const Offset(0, 8),
          blurRadius: 20,
        ),
      ];

  // Soft shadows aliased for full diorama consistency
  static List<BoxShadow> get neoShadow => softShadow;
  static List<BoxShadow> get neoShadowSmall => softShadowSmall;
  static List<BoxShadow> get neoShadowLarge => softShadowLarge;

  // Typography - Baloo 2
  static TextStyle font({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.w700,
    Color color = ink,
    double? height,
    double? letterSpacing,
  }) {
    return GoogleFonts.baloo2(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
      letterSpacing: letterSpacing,
    );
  }

  // 8-Bit / Monospace LCD Font
  static TextStyle lcdFont({
    double fontSize = 26,
    required Color color,
  }) {
    return TextStyle(
      fontFamily: 'Courier',
      fontSize: fontSize,
      fontWeight: FontWeight.w900,
      color: color,
      letterSpacing: 2.0,
      shadows: [
        Shadow(
          color: color.withValues(alpha: 0.5),
          blurRadius: 6,
        ),
      ],
    );
  }

  // Diorama Soft Card Decoration (Faz 7 Uyumu)
  static BoxDecoration softCard({
    Color background = paper,
    Color? borderColor,
    double radius = rMd,
    double borderWidth = 1.0,
    bool hasShadow = true,
  }) {
    return BoxDecoration(
      color: background,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: borderColor ?? ink.withValues(alpha: 0.10),
        width: borderWidth,
      ),
      boxShadow: hasShadow ? softShadow : null,
    );
  }

  // Backward-compatible neoCard delegating to softCard
  static BoxDecoration neoCard({
    Color background = paper,
    Color? borderColor,
    double radius = rMd,
    double borderWidth = 1.0,
    bool hasShadow = true,
  }) =>
      softCard(
        background: background,
        borderColor: borderColor,
        radius: radius,
        borderWidth: borderWidth,
        hasShadow: hasShadow,
      );
}
