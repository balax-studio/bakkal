import 'package:flutter/material.dart';
import 'iso_prop.dart';

/// İzometrik 2.5D Dünya Yöneticisi (Painter's Algorithm ile sıralama)
class IsoWorld {
  /// Sabit zemin katmanı (Çim karoları, asfalt yol, sarı/beyaz şeritler, bordürler)
  final List<IsoProp> ground = [];

  /// Derinliğe göre sıralanacak dikey nesneler (Binalar, pompalar, ağaçlar, araçlar, propler)
  final List<IsoProp> props = [];

  /// Dünyayı temizle
  void clear() {
    ground.clear();
    props.clear();
  }

  /// Tüm sahneyi doğru katmanlama ve derinlik sırasıyla çiz
  void render(Canvas canvas) {
    // 1. Zemin Katmanı — Sıralama gerekmez, ekleme sırasıyla çizilir
    for (int i = 0; i < ground.length; i++) {
      ground[i].render(canvas);
    }

    // 2. Dikey Nesneler — Derinliğe göre sırala (Painter's Algorithm)
    props.sort((a, b) => a.depth.compareTo(b.depth));
    for (int i = 0; i < props.length; i++) {
      props[i].render(canvas);
    }
  }
}
