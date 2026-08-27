import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/audio/sound_service.dart';
import '../../core/haptics/haptic_service.dart';
import '../../core/theme/neo_icons.dart';
import '../../core/theme/neo_theme.dart';
import '../math/isometric_math.dart';
import '../mini_mart_game.dart';
import 'effects_component.dart';

/// 2.5D Architectural Hologram & Construction Pad Component
/// Features:
/// - 2.5D Isometric Concrete Podium with Hazard Stripes
/// - Floating Neon Wireframe Blueprint Hologram & Vector Icon
/// - Radial Energy Siphon Progress Ring
/// - Neo-Brutalist Front Plaque Badge (Zero raw ground text)
class UnlockPadComponent extends PositionComponent with HasGameReference<MiniMartGame> {
  final String unlockId;
  final String title;
  final int totalCost;
  final NeoIconType iconType;
  final VoidCallback onUnlocked;
  int currentContributed = 0;

  double drainCooldown = 0.0;
  double animTimer = 0.0;

  UnlockPadComponent({
    required this.unlockId,
    required this.title,
    required this.totalCost,
    required Vector2 position,
    NeoIconType? iconType,
    required this.onUnlocked,
  })  : iconType = iconType ?? _inferIconType(unlockId, title),
        super(
          position: position,
          size: Vector2(120, 90),
          anchor: Anchor.center,
        ) {
    priority = IsometricMath.calculatePriority(position.x, position.y) - 5;
  }

  static NeoIconType _inferIconType(String id, String title) {
    final lower = (id + title).toLowerCase();
    if (lower.contains('tomato') || lower.contains('domates')) return NeoIconType.tomato;
    if (lower.contains('corn') || lower.contains('mısır')) return NeoIconType.corn;
    if (lower.contains('wheat') || lower.contains('buğday')) return NeoIconType.wheat;
    if (lower.contains('bread') || lower.contains('fırın') || lower.contains('değirmen') || lower.contains('somun')) return NeoIconType.bread;
    if (lower.contains('cow') || lower.contains('ahır') || lower.contains('süt') || lower.contains('inek')) return NeoIconType.milk;
    if (lower.contains('ayran') || lower.contains('yoğurt') || lower.contains('şelale')) return NeoIconType.ayran;
    if (lower.contains('tea') || lower.contains('çay') || lower.contains('demlik')) return NeoIconType.teaCup;
    if (lower.contains('sunflower') || lower.contains('çekirdek') || lower.contains('kavurma')) return NeoIconType.seeds;
    if (lower.contains('potato') || lower.contains('cips') || lower.contains('patates')) return NeoIconType.chips;
    if (lower.contains('egg') || lower.contains('kümes') || lower.contains('tavuk')) return NeoIconType.egg;
    if (lower.contains('paste') || lower.contains('salça')) return NeoIconType.paste;
    if (lower.contains('shelf') || lower.contains('reyon')) return NeoIconType.cash;
    return NeoIconType.upgrade;
  }

  int get remainingCost => totalCost - currentContributed;
  double get progress => (currentContributed / totalCost).clamp(0.0, 1.0);

  @override
  void update(double dt) {
    super.update(dt);
    animTimer += dt * 3.5;

    final player = game.player;
    final dist = (player.position - position).length;

    if (dist < 60.0 && game.playerData.cash > 0 && remainingCost > 0) {
      drainCooldown -= dt;
      if (drainCooldown <= 0) {
        drainCooldown = 0.07;

        final transferAmount = math.min(5, math.min(game.playerData.cash, remainingCost));
        if (transferAmount > 0) {
          game.playerData.cash -= transferAmount;
          currentContributed += transferAmount;
          game.notifyStateChanged();
          SoundService.playHarvest();
          HapticService.light();

          // Siphon Energy Particle
          game.world.add(
            FlyingCoinComponent(
              startPos: player.position - Vector2(0, 15),
              targetPos: position - Vector2(0, 20),
            ),
          );

          if (currentContributed >= totalCost) {
            _triggerUnlock();
          }
        }
      }
    }
  }

  void _triggerUnlock() {
    game.playerData.unlockedAreas.add(unlockId);
    game.saveGame();
    game.notifyStateChanged();

    SoundService.playUnlock();
    HapticService.heavy();

    game.world.add(
      ParticleBurstComponent(
        position: position,
        count: 45,
        colors: [
          NeoTheme.cashGreen,
          NeoTheme.goldCoin,
          NeoTheme.boostCyan,
          NeoTheme.purpleAccent,
          Colors.white,
        ],
      ),
    );

    game.world.add(
      FloatingTextComponent(
        text: 'İNŞA EDİLDİ: $title!',
        position: position - Vector2(0, 45),
        color: NeoTheme.cashGreen,
      ),
    );

    onUnlocked();
    removeFromParent();
  }

  @override
  void render(Canvas canvas) {
    final cx = size.x * 0.5;
    final cy = size.y * 0.5 + 4;
    const w = 96.0;
    const h = 48.0;
    const depth = 16.0;

    final hoverBob = math.sin(animTimer) * 3.5;
    final pulseAlpha = (0.65 + 0.35 * math.sin(animTimer * 1.5)).clamp(0.0, 1.0);

    // =========================================================================
    // 1. ISOMETRIC BASE DROP SHADOW
    // =========================================================================
    final shadowPath = Path()
      ..moveTo(cx, cy - h * 0.5 + 4)
      ..lineTo(cx + w * 0.5 + 6, cy + 4)
      ..lineTo(cx, cy + h * 0.5 + depth + 6)
      ..lineTo(cx - w * 0.5 - 6, cy + depth + 6)
      ..close();
    canvas.drawPath(shadowPath, NeoTheme.shadowPaint);

    // =========================================================================
    // 2. CONCRETE PODIUM 2.5D BEVELED SIDES (With Construction Hazard Stripes)
    // =========================================================================
    // Left Face
    final leftFace = Path()
      ..moveTo(cx - w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..lineTo(cx - w * 0.5, cy + depth)
      ..close();
    canvas.drawPath(leftFace, Paint()..color = const Color(0xFF334155));
    canvas.drawPath(leftFace, NeoTheme.stroke(width: 2.5));

    // Right Face
    final rightFace = Path()
      ..moveTo(cx, cy + h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx + w * 0.5, cy + depth)
      ..lineTo(cx, cy + h * 0.5 + depth)
      ..close();
    canvas.drawPath(rightFace, Paint()..color = const Color(0xFF1E293B));
    canvas.drawPath(rightFace, NeoTheme.stroke(width: 2.5));

    // Angled Hazard Stripes on Front Edge
    final stripePaint = Paint()
      ..color = const Color(0xFFFBBF24)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke;
    for (double i = -30; i <= 30; i += 12) {
      canvas.drawLine(
        Offset(cx + i, cy + h * 0.5 + 2),
        Offset(cx + i + 8, cy + h * 0.5 + depth - 2),
        stripePaint,
      );
    }

    // Top Isometric Diamond Pad
    final topDiamond = Path()
      ..moveTo(cx, cy - h * 0.5)
      ..lineTo(cx + w * 0.5, cy)
      ..lineTo(cx, cy + h * 0.5)
      ..lineTo(cx - w * 0.5, cy)
      ..close();
    canvas.drawPath(topDiamond, Paint()..color = const Color(0xFF475569));
    canvas.drawPath(topDiamond, NeoTheme.stroke(width: 2.5));

    // Inner Grid / Scaffolding lines
    final gridPaint = Paint()
      ..color = const Color(0xFF64748B)
      ..strokeWidth = 1.2
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(cx - w * 0.25, cy - h * 0.25), Offset(cx + w * 0.25, cy + h * 0.25), gridPaint);
    canvas.drawLine(Offset(cx + w * 0.25, cy - h * 0.25), Offset(cx - w * 0.25, cy + h * 0.25), gridPaint);

    // =========================================================================
    // 3. RADIAL PROGRESS ENERGY RING
    // =========================================================================
    if (progress > 0) {
      final progPath = Path()
        ..moveTo(cx, cy - h * 0.42)
        ..lineTo(cx + w * 0.42 * progress, cy)
        ..lineTo(cx, cy + h * 0.42 * progress)
        ..lineTo(cx - w * 0.42 * progress, cy)
        ..close();
      final fillProg = Paint()
        ..color = NeoTheme.cashGreen.withValues(alpha: 0.85)
        ..style = PaintingStyle.fill;
      canvas.drawPath(progPath, fillProg);
      canvas.drawPath(progPath, NeoTheme.stroke(width: 2.0, color: NeoTheme.inkBlack));
    }

    // =========================================================================
    // 4. FLOATING 2.5D WIREFRAME BLUEPRINT HOLOGRAM CAGE
    // =========================================================================
    final holoCy = cy - 28.0 + hoverBob;
    const holoW = 54.0;
    const holoH = 34.0;
    const holoDepth = 22.0;

    final holoColor = NeoTheme.boostCyan.withValues(alpha: pulseAlpha);
    final holoPaint = Paint()
      ..color = holoColor
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke;

    // Projected Blueprint Wireframe Box
    final holoTop = Path()
      ..moveTo(cx, holoCy - holoH * 0.5)
      ..lineTo(cx + holoW * 0.5, holoCy)
      ..lineTo(cx, holoCy + holoH * 0.5)
      ..lineTo(cx - holoW * 0.5, holoCy)
      ..close();
    canvas.drawPath(holoTop, holoPaint);

    final holoBottom = Path()
      ..moveTo(cx, holoCy - holoH * 0.5 + holoDepth)
      ..lineTo(cx + holoW * 0.5, holoCy + holoDepth)
      ..lineTo(cx, holoCy + holoH * 0.5 + holoDepth)
      ..lineTo(cx - holoW * 0.5, holoCy + holoDepth)
      ..close();
    canvas.drawPath(holoBottom, holoPaint);

    // Vertical Blueprint Struts
    canvas.drawLine(Offset(cx, holoCy - holoH * 0.5), Offset(cx, holoCy - holoH * 0.5 + holoDepth), holoPaint);
    canvas.drawLine(Offset(cx + holoW * 0.5, holoCy), Offset(cx + holoW * 0.5, holoCy + holoDepth), holoPaint);
    canvas.drawLine(Offset(cx, holoCy + holoH * 0.5), Offset(cx, holoCy + holoH * 0.5 + holoDepth), holoPaint);
    canvas.drawLine(Offset(cx - holoW * 0.5, holoCy), Offset(cx - holoW * 0.5, holoCy + holoDepth), holoPaint);

    // Glowing Hologram Light Beam down to Podium
    final beamPath = Path()
      ..moveTo(cx - holoW * 0.35, holoCy + holoDepth)
      ..lineTo(cx + holoW * 0.35, holoCy + holoDepth)
      ..lineTo(cx + w * 0.25, cy)
      ..lineTo(cx - w * 0.25, cy)
      ..close();
    final beamPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          NeoTheme.boostCyan.withValues(alpha: 0.25 * pulseAlpha),
          NeoTheme.boostCyan.withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromCenter(center: Offset(cx, (holoCy + cy) * 0.5), width: w, height: 40));
    canvas.drawPath(beamPath, beamPaint);

    // Vector Icon Inside Hologram Cage
    NeoIconPainter.drawIcon(
      canvas,
      iconType,
      Offset(cx, holoCy + holoDepth * 0.5),
      24.0,
      color: Colors.white,
    );

    // =========================================================================
    // 5. FRONT 3D SIGNBOARD BADGE (Zero Raw Ground Text)
    // =========================================================================
    // 5a. Title Pill Badge
    final titleSpan = TextSpan(
      text: title.toUpperCase(),
      style: const TextStyle(
        color: Colors.white,
        fontSize: 8.5,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
        letterSpacing: 0.3,
      ),
    );
    final titlePainter = TextPainter(text: titleSpan, textDirection: TextDirection.ltr);
    titlePainter.layout();

    final titlePillW = math.max(titlePainter.width + 14, 76.0);
    final titleRect = Rect.fromCenter(center: Offset(cx, cy + depth + 4), width: titlePillW, height: 16);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(titleRect, const Radius.circular(4)),
      fillPaint: NeoTheme.fill(const Color(0xFF0F172A)),
      strokePaint: NeoTheme.stroke(width: 1.8),
      shadowOffset: 1.5,
    );
    titlePainter.paint(canvas, Offset(cx - titlePainter.width * 0.5, cy + depth - 3));

    // 5b. High-Contrast Price Badge with $ and Green Fill
    final costSpan = TextSpan(
      text: '\$$remainingCost',
      style: const TextStyle(
        color: NeoTheme.inkBlack,
        fontSize: 12,
        fontWeight: FontWeight.w900,
        fontFamily: 'sans-serif',
      ),
    );
    final costPainter = TextPainter(text: costSpan, textDirection: TextDirection.ltr);
    costPainter.layout();

    final costBadgeW = math.max(costPainter.width + 16, 52.0);
    final costRect = Rect.fromCenter(center: Offset(cx, cy + depth + 22), width: costBadgeW, height: 18);
    NeoTheme.drawNeoRRect(
      canvas,
      RRect.fromRectAndRadius(costRect, const Radius.circular(5)),
      fillPaint: NeoTheme.fill(NeoTheme.cashGreen),
      strokePaint: NeoTheme.stroke(width: 2.0),
      shadowOffset: 2.0,
    );
    costPainter.paint(canvas, Offset(cx - costPainter.width * 0.5, cy + depth + 14));
  }
}
