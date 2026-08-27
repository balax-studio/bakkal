import 'package:flame/components.dart';

/// Provides 2.5D Dimetric / Isometric coordinate projection formulas and Y-sorting priority calculations.
class IsometricMath {
  // 30-degree isometric standard (cos(30) ≈ 0.866025, sin(30) = 0.5)
  static const double cosAngle = 0.86602540378;
  static const double sinAngle = 0.5;

  /// Projects a 3D world coordinate (x, y, z) into 2D screen coordinate.
  static Vector2 worldToScreen(double x, double y, [double z = 0.0]) {
    final screenX = (x - y) * cosAngle;
    final screenY = (x + y) * sinAngle - z;
    return Vector2(screenX, screenY);
  }

  /// Inverts a 2D screen coordinate back to world ground plane (z = 0).
  static Vector2 screenToWorld(double screenX, double screenY) {
    final x = (screenX / cosAngle + screenY / sinAngle) * 0.5;
    final y = (screenY / sinAngle - screenX / cosAngle) * 0.5;
    return Vector2(x, y);
  }

  /// Calculates the rendering priority (Z-index / Y-sorting) for 2.5D layering.
  /// Entities with higher Y are in front of entities with lower Y.
  static int calculatePriority(double x, double y, [double z = 0.0]) {
    // Offset priority so it's always positive and finely granular
    return ((y * 100) + (x * 0.1) + (z * 0.01) + 10000).toInt();
  }

  /// Returns 4 polygon vertices for an isometric ground tile at (x, y) with given width and height.
  static List<Vector2> getIsoTileVertices(Vector2 center, double width, double height) {
    final halfW = width * 0.5;
    final halfH = height * 0.5;
    return [
      Vector2(center.x, center.y - halfH), // Top
      Vector2(center.x + halfW, center.y), // Right
      Vector2(center.x, center.y + halfH), // Bottom
      Vector2(center.x - halfW, center.y), // Left
    ];
  }
}
