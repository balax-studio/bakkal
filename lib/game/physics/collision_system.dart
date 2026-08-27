import 'package:flame/components.dart';
import 'package:flutter/material.dart';

/// Represents an axis-aligned 2.5D solid bounding box obstacle in the game world.
class SolidBox {
  final String id;
  final Rect bounds;
  final String label;

  SolidBox({
    required this.id,
    required this.bounds,
    this.label = 'Obstacle',
  });

  double get left => bounds.left;
  double get right => bounds.right;
  double get top => bounds.top;
  double get bottom => bounds.bottom;
  Vector2 get center => Vector2(bounds.center.dx, bounds.center.dy);

  /// Checks whether a circle at [center] with [radius] intersects this solid box.
  bool intersectsCircle(Vector2 circleCenter, double radius) {
    // Find closest point on rectangle to circle center
    final closestX = circleCenter.x.clamp(bounds.left, bounds.right);
    final closestY = circleCenter.y.clamp(bounds.top, bounds.bottom);

    final distanceX = circleCenter.x - closestX;
    final distanceY = circleCenter.y - closestY;

    final distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (radius * radius);
  }
}

/// Physics world that manages all solid collision obstacles and provides axis-separated wall-sliding resolution.
class PhysicsWorld {
  final List<SolidBox> obstacles = [];

  void clear() {
    obstacles.clear();
  }

  void addObstacle(SolidBox box) {
    obstacles.add(box);
  }

  void removeObstacle(String id) {
    obstacles.removeWhere((o) => o.id == id);
  }

  /// Resolves entity movement using axis-separated collision resolution.
  /// If the entity hits an obstacle on the X-axis, X movement is blocked, but Y movement continues (sliding along the obstacle).
  /// If it hits on the Y-axis, Y movement is blocked, but X movement continues.
  Vector2 resolveMovement({
    required Vector2 currentPos,
    required Vector2 velocity,
    required double dt,
    double radius = 18.0,
    double worldMinX = 60.0,
    double worldMaxX = 590.0,
    double worldMinY = 160.0,
    double worldMaxY = 820.0,
  }) {
    if (velocity.length == 0 || dt <= 0) return currentPos;

    Vector2 nextPos = currentPos.clone();

    // 1. Try X-Axis movement
    final targetX = (currentPos.x + velocity.x * dt).clamp(worldMinX + radius, worldMaxX - radius);
    final testPosX = Vector2(targetX, nextPos.y);

    bool collideX = false;
    for (final obstacle in obstacles) {
      if (obstacle.intersectsCircle(testPosX, radius)) {
        collideX = true;
        break;
      }
    }

    if (!collideX) {
      nextPos.x = targetX;
    }

    // 2. Try Y-Axis movement (independent axis test provides automatic silky-smooth wall sliding)
    final targetY = (currentPos.y + velocity.y * dt).clamp(worldMinY + radius, worldMaxY - radius);
    final testPosY = Vector2(nextPos.x, targetY);

    bool collideY = false;
    for (final obstacle in obstacles) {
      if (obstacle.intersectsCircle(testPosY, radius)) {
        collideY = true;
        break;
      }
    }

    if (!collideY) {
      nextPos.y = targetY;
    }

    return nextPos;
  }
}
