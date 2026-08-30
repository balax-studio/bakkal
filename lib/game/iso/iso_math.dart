import 'package:flutter/material.dart';

/// Bir grid karesinin ekrandaki genişliği (2:1 dimetrik izometrik).
const double kTileW = 64.0;

/// Bir grid karesinin ekrandaki yüksekliği.
const double kTileH = 32.0;

/// 1 birim dünya yüksekliğinin (gz) ekrandaki piksel karşılığı.
const double kZUnit = 32.0;

/// Grid koordinatını (gx, gy, gz) ekran koordinatına çevirir.
/// gx: sağa-aşağı eksen, gy: sola-aşağı eksen, gz: yukarı (yükseklik).
Offset iso(double gx, double gy, [double gz = 0.0]) => Offset(
      (gx - gy) * (kTileW / 2),
      (gx + gy) * (kTileH / 2) - gz * kZUnit,
    );

/// Ekran koordinatını grid koordinatına çevirir (dokunma/tap testi için, gz=0 düzleminde).
Offset screenToIso(Offset p) {
  final double gx = (p.dx / (kTileW / 2) + p.dy / (kTileH / 2)) / 2;
  final double gy = (p.dy / (kTileH / 2) - p.dx / (kTileW / 2)) / 2;
  return Offset(gx, gy);
}

// --- Flat shading: ışık sol-üstten sabit ---

/// Üst yüz — en parlak, taban rengin kendisi.
Color shadeTop(Color c) => c;

/// +gy yönüne bakan yüz (ekranda SOLDA görünür) — orta ton.
Color shadeLeft(Color c) => Color.lerp(c, Colors.black, 0.18)!;

/// +gx yönüne bakan yüz (ekranda SAĞDA görünür) — en koyu.
Color shadeRight(Color c) => Color.lerp(c, Colors.black, 0.34)!;

/// Zemin/düz yüzeyler için hafif ton oynatma (tile varyasyonu).
Color shadeFlat(Color c, double amount) => Color.lerp(c, Colors.black, amount)!;
