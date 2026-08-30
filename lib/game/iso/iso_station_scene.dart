import 'dart:math' as math;
import 'package:flame/components.dart';
import 'package:flutter/material.dart';
import '../../core/theme/station_theme.dart';
import '../../domain/fuel_type.dart';
import '../petrol_station_game.dart';
import 'iso_math.dart';
import 'iso_prop.dart';
import 'iso_shapes.dart';
import 'iso_world.dart';

/// 2.5D İzometrik Benzin İstasyonu Sahne Bileşeni (beneloil.com Flat-Shaded Diorama)
class IsoStationScene extends Component with HasGameReference<PetrolStationGame> {
  final IsoWorld world = IsoWorld();

  // Kamera ayarları
  double cameraOffsetX = 0.0;
  double cameraOffsetY = 0.0;

  // Çim varyasyonu için sabit seed
  static final List<double> _grassSeeds = List.generate(
    28 * 28,
    (index) => (math.sin(index * 997.0) * 0.5 + 0.5),
  );

  /// Pompa slotları için grid koordinatları sorgulama fonksiyonu
  static Vector2 gridPosForPumpSlot(int slotIndex, int totalPumps) {
    // Pompaları forecourt ortasında X ekseninde sırala
    const double startGx = 8.5;
    const double spacingGx = 3.6;
    const double baseGy = 8.8;

    final gx = startGx + (slotIndex * spacingGx);
    const gy = baseGy;
    return Vector2(gx, gy);
  }

  /// Pompanın araba yanaşma bekleme noktası (gx, gy)
  static Vector2 vehicleParkPosForSlot(int slotIndex, int totalPumps) {
    final pumpPos = gridPosForPumpSlot(slotIndex, totalPumps);
    return Vector2(pumpPos.x + 0.2, pumpPos.y + 1.2);
  }

  @override
  void render(Canvas canvas) {
    super.render(canvas);

    final state = game.stationState;
    final isNight = state.timeOfDay < 6.0 || state.timeOfDay >= 21.0;
    final isDusk = (state.timeOfDay >= 18.5 && state.timeOfDay < 21.0) ||
        (state.timeOfDay >= 5.0 && state.timeOfDay < 6.5);

    // Sahneyi ekranda ortala
    canvas.save();
    canvas.translate(
      game.size.x / 2 + cameraOffsetX,
      game.size.y * 0.32 + cameraOffsetY,
    );

    // Dünyayı temizle ve yeniden inşa et
    world.clear();

    // 1. ZEMİN İNŞASI
    _buildGround(state);

    // 2. DİKEY PROPLAR VE BİNALAR
    _buildProps(state, isNight, isDusk);

    // 3. DÜNYAYI ÇİZ (Zemin + Derinlik Sıralı Proplar)
    world.render(canvas);

    // 4. ATMOSFER & GÜN/GECE TİNTİ (Faz 6)
    _renderAtmosphere(canvas, state.timeOfDay);

    canvas.restore();
  }

  /// Zemin Katmanı (Çim, Çapraz Yol, Forecourt, Şeritler)
  void _buildGround(dynamic state) {
    // 1.1 Çim Karoları (24x24 tile, deterministik ton varyasyonu)
    world.ground.add(
      CustomIsoProp(
        gx: -4,
        gy: -4,
        w: 28,
        d: 28,
        onRender: (canvas) {
          const int minG = -2;
          const int maxG = 24;

          for (int gx = minG; gx < maxG; gx += 2) {
            for (int gy = minG; gy < maxG; gy += 2) {
              final seedIndex = ((gx + 4) * 28 + (gy + 4)) % _grassSeeds.length;
              final variation = _grassSeeds[seedIndex] * 0.05;
              final tileColor = shadeFlat(StationTheme.isoGrass, variation);

              drawIsoTile(
                canvas,
                gx: gx.toDouble(),
                gy: gy.toDouble(),
                w: 2.0,
                d: 2.0,
                color: tileColor,
              );
            }
          }
        },
      ),
    );

    // 1.2 Çapraz Asfalt Yol (gx: -4 -> 28, gy: 14 -> 20)
    world.ground.add(
      CustomIsoProp(
        gx: -4,
        gy: 14,
        w: 32,
        d: 6.5,
        onRender: (canvas) {
          // Asfalt zemin
          drawIsoTile(
            canvas,
            gx: -4,
            gy: 14,
            w: 32,
            d: 6.5,
            color: StationTheme.isoAsphalt,
          );

          // Yol Kenar Bordürü (Açık çizgi)
          drawIsoTile(
            canvas,
            gx: -4,
            gy: 14.0,
            w: 32,
            d: 0.15,
            color: StationTheme.isoConcreteEdge,
          );
          drawIsoTile(
            canvas,
            gx: -4,
            gy: 20.35,
            w: 32,
            d: 0.15,
            color: StationTheme.isoConcreteEdge,
          );

          // Çift Sarı Orta Çizgi (gy: 17.15 ve 17.35)
          drawIsoTile(
            canvas,
            gx: -4,
            gy: 17.10,
            w: 32,
            d: 0.10,
            color: StationTheme.isoRoadLineYellow,
          );
          drawIsoTile(
            canvas,
            gx: -4,
            gy: 17.30,
            w: 32,
            d: 0.10,
            color: StationTheme.isoRoadLineYellow,
          );

          // Beyaz Kesikli Şerit Çizgileri
          for (double x = -4; x < 28; x += 2.8) {
            // Sağ şerit kesiklisi
            drawIsoTile(
              canvas,
              gx: x,
              gy: 15.6,
              w: 1.4,
              d: 0.10,
              color: StationTheme.isoRoadLineWhite,
            );
            // Sol şerit kesiklisi
            drawIsoTile(
              canvas,
              gx: x,
              gy: 18.8,
              w: 1.4,
              d: 0.10,
              color: StationTheme.isoRoadLineWhite,
            );
          }
        },
      ),
    );

    // 1.3 Beton İstasyon Platformu (Forecourt) (gx: 4 -> 21, gy: 3 -> 14)
    world.ground.add(
      CustomIsoProp(
        gx: 4,
        gy: 3,
        w: 17,
        d: 11,
        onRender: (canvas) {
          // Beton alan
          drawIsoTile(
            canvas,
            gx: 4,
            gy: 3,
            w: 17,
            d: 11,
            color: StationTheme.isoConcrete,
          );

          // Forecourt dış bordür şeridi
          drawIsoTile(
            canvas,
            gx: 4,
            gy: 3,
            w: 17,
            d: 0.25,
            color: StationTheme.isoConcreteEdge,
          );
          drawIsoTile(
            canvas,
            gx: 4,
            gy: 3,
            w: 0.25,
            d: 11,
            color: StationTheme.isoConcreteEdge,
          );
          drawIsoTile(
            canvas,
            gx: 4,
            gy: 13.75,
            w: 17,
            d: 0.25,
            color: StationTheme.isoConcreteEdge,
          );
          drawIsoTile(
            canvas,
            gx: 20.75,
            gy: 3,
            w: 0.25,
            d: 11,
            color: StationTheme.isoConcreteEdge,
          );

          // Giriş Oku (Kırmızı-Beyaz zemin oku)
          final inPos = iso(6.0, 13.2, 0);
          final inPaint = Paint()
            ..style = PaintingStyle.fill
            ..color = StationTheme.red;
          canvas.drawCircle(inPos, 6.0, inPaint);

          // Çıkış Oku
          final outPos = iso(19.0, 13.2, 0);
          final outPaint = Paint()
            ..style = PaintingStyle.fill
            ..color = StationTheme.green;
          canvas.drawCircle(outPos, 6.0, outPaint);
        },
      ),
    );
  }

  /// Dikey Nesneler (Binalar, Pompalar, Ağaçlar, Lambalar, Kanopi)
  void _buildProps(dynamic state, bool isNight, bool isDusk) {
    // 2.1 ANA OFİS VE MARKET BİNASI (2 Katlı, Krem/Koyu Gri Çatı)
    world.props.add(
      CustomIsoProp(
        gx: 14.5,
        gy: 3.5,
        w: 5.5,
        d: 5.5,
        onRender: (canvas) {
          // Temas Gölgesi
          drawContactShadow(canvas, gx: 14.5, gy: 3.5, w: 5.5, d: 5.5, opacity: 0.22);

          // 1. Kat (Gövde)
          drawIsoBox(
            canvas,
            gx: 14.5,
            gy: 3.5,
            w: 5.5,
            d: 5.5,
            h: 2.2,
            color: StationTheme.isoBuilding,
          );

          // 1. Kat Pencereleri (Ön sol yüze)
          final winColor = isNight ? StationTheme.isoWindowNight : StationTheme.isoWindow;
          drawIsoBox(
            canvas,
            gx: 14.7,
            gy: 8.9,
            w: 1.8,
            d: 0.1,
            h: 1.1,
            color: winColor,
            baseZ: 0.6,
          );
          drawIsoBox(
            canvas,
            gx: 17.5,
            gy: 8.9,
            w: 1.8,
            d: 0.1,
            h: 1.1,
            color: winColor,
            baseZ: 0.6,
          );

          // Giriş Kapısı & Kırmızı Tente
          drawIsoBox(
            canvas,
            gx: 16.6,
            gy: 8.9,
            w: 0.8,
            d: 0.1,
            h: 1.3,
            color: const Color(0xFF333333),
            baseZ: 0.0,
          );
          drawIsoPrism(
            canvas,
            gx: 16.2,
            gy: 8.8,
            w: 1.6,
            d: 0.8,
            h: 0.35,
            color: StationTheme.red,
            baseZ: 1.35,
            ridgeAlong: Axis.horizontal,
          );

          // 2. Kat (Hafif içeride)
          drawIsoBox(
            canvas,
            gx: 14.8,
            gy: 3.8,
            w: 4.9,
            d: 4.9,
            h: 1.7,
            color: StationTheme.isoBuilding,
            baseZ: 2.2,
          );

          // 2. Kat Pencereleri
          drawIsoBox(
            canvas,
            gx: 15.2,
            gy: 8.6,
            w: 1.4,
            d: 0.1,
            h: 0.9,
            color: winColor,
            baseZ: 2.6,
          );
          drawIsoBox(
            canvas,
            gx: 17.6,
            gy: 8.6,
            w: 1.4,
            d: 0.1,
            h: 0.9,
            color: winColor,
            baseZ: 2.6,
          );

          // Koyu Gri Çatı Plakası
          drawIsoBox(
            canvas,
            gx: 14.6,
            gy: 3.6,
            w: 5.3,
            d: 5.3,
            h: 0.25,
            color: StationTheme.isoRoof,
            baseZ: 3.9,
          );

          // Çatı Klima Havalandırma Üniteleri
          drawIsoBox(
            canvas,
            gx: 15.2,
            gy: 4.2,
            w: 1.1,
            d: 0.9,
            h: 0.5,
            color: const Color(0xFF6C757D),
            baseZ: 4.15,
          );
          drawIsoBox(
            canvas,
            gx: 17.2,
            gy: 5.2,
            w: 0.9,
            d: 0.8,
            h: 0.4,
            color: const Color(0xFF495057),
            baseZ: 4.15,
          );

          // Çatı Güneş Panelleri (Eğer satın alınmışsa)
          if (state.hasSolarPanels) {
            drawIsoBox(
              canvas,
              gx: 15.2,
              gy: 6.2,
              w: 3.8,
              d: 2.0,
              h: 0.1,
              color: const Color(0xFF1E3A8A),
              baseZ: 4.15,
            );
          }

          // Bina Önü "BENELOIL OFİS" Tabelası
          drawIsoBox(
            canvas,
            gx: 15.2,
            gy: 8.92,
            w: 3.5,
            d: 0.1,
            h: 0.45,
            color: StationTheme.red,
            baseZ: 2.0,
          );

          final textPainter = TextPainter(
            text: const TextSpan(
              text: 'BENELOIL MARKET',
              style: TextStyle(
                fontFamily: 'Courier',
                fontSize: 8.5,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: 0.5,
              ),
            ),
            textDirection: TextDirection.ltr,
          )..layout();
          final signPos = iso(16.0, 9.0, 2.1);
          textPainter.paint(canvas, signPos);
        },
      ),
    );

    // 2.2 DEPOLAMA TANKLARI (Benzin, Dizel, LPG Silindirleri)
    world.props.add(
      CustomIsoProp(
        gx: 20.0,
        gy: 4.0,
        w: 1.8,
        d: 5.0,
        onRender: (canvas) {
          // Benzin Tankı
          drawContactShadow(canvas, gx: 20.2, gy: 4.2, w: 1.2, d: 1.2);
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 4.8,
            radius: 0.5,
            h: 1.8,
            color: const Color(0xFFD4D8D3),
          );
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 4.8,
            radius: 0.52,
            h: 0.25,
            color: StationTheme.green,
            baseZ: 1.1,
          );

          // Dizel Tankı
          drawContactShadow(canvas, gx: 20.2, gy: 6.2, w: 1.2, d: 1.2);
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 6.8,
            radius: 0.5,
            h: 1.8,
            color: const Color(0xFFD4D8D3),
          );
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 6.8,
            radius: 0.52,
            h: 0.25,
            color: StationTheme.orange,
            baseZ: 1.1,
          );

          // LPG Tankı
          drawContactShadow(canvas, gx: 20.2, gy: 8.2, w: 1.2, d: 1.2);
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 8.8,
            radius: 0.5,
            h: 1.8,
            color: const Color(0xFFD4D8D3),
          );
          drawIsoCylinder(
            canvas,
            gx: 20.8,
            gy: 8.8,
            radius: 0.52,
            h: 0.25,
            color: StationTheme.blue,
            baseZ: 1.1,
          );
        },
      ),
    );

    // 2.3 POMPA ADALARI (stationState.pumpsCount kadar)
    final int pumpsCount = state.pumpsCount;
    for (int i = 0; i < pumpsCount; i++) {
      final pPos = gridPosForPumpSlot(i, pumpsCount);

      world.props.add(
        CustomIsoProp(
          gx: pPos.x,
          gy: pPos.y,
          w: 2.2,
          d: 1.2,
          onRender: (canvas) {
            // Ada Gölgesi
            drawContactShadow(canvas, gx: pPos.x, gy: pPos.y, w: 2.2, d: 1.2);

            // Beton Ada Platformu
            drawIsoBox(
              canvas,
              gx: pPos.x,
              gy: pPos.y,
              w: 2.2,
              d: 1.2,
              h: 0.18,
              color: StationTheme.isoConcreteEdge,
            );

            // Kırmızı Dispenser / Pompa Kabini
            drawIsoBox(
              canvas,
              gx: pPos.x + 0.6,
              gy: pPos.y + 0.35,
              w: 1.0,
              d: 0.5,
              h: 1.4,
              color: StationTheme.red,
              baseZ: 0.18,
            );

            // Dispenser LCD Ekranı (Ön yüz)
            drawIsoBox(
              canvas,
              gx: pPos.x + 0.7,
              gy: pPos.y + 0.84,
              w: 0.8,
              d: 0.05,
              h: 0.4,
              color: StationTheme.lcdBg,
              baseZ: 0.9,
            );

            // Pompa Numarası
            final numPainter = TextPainter(
              text: TextSpan(
                text: '#${i + 1}',
                style: const TextStyle(
                  fontSize: 8.0,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              textDirection: TextDirection.ltr,
            )..layout();
            final numPos = iso(pPos.x + 0.9, pPos.y + 0.9, 1.4);
            numPainter.paint(canvas, numPos);
          },
        ),
      );
    }

    // 2.4 KANOPİ (Pompaların Üzerindeki Geniş Çatı ve Direkler)
    if (pumpsCount > 0) {
      final firstPos = gridPosForPumpSlot(0, pumpsCount);
      final lastPos = gridPosForPumpSlot(pumpsCount - 1, pumpsCount);

      final canopyGx = firstPos.x - 1.0;
      final canopyGy = firstPos.y - 0.8;
      final canopyW = (lastPos.x - firstPos.x) + 4.2;
      const canopyD = 2.8;

      world.props.add(
        CustomIsoProp(
          gx: canopyGx,
          gy: canopyGy,
          w: canopyW,
          d: canopyD,
          onRender: (canvas) {
            // Kanopinin Yerdeki Geniş Yumuşak Gölgesi
            drawContactShadow(
              canvas,
              gx: canopyGx,
              gy: canopyGy,
              w: canopyW,
              d: canopyD,
              opacity: 0.14,
            );

            // 4 Adet Silindir Taşıyıcı Direk
            const poleH = 2.8;
            drawIsoCylinder(
              canvas,
              gx: canopyGx + 0.5,
              gy: canopyGy + 0.4,
              radius: 0.08,
              h: poleH,
              color: Colors.white70,
            );
            drawIsoCylinder(
              canvas,
              gx: canopyGx + canopyW - 0.5,
              gy: canopyGy + 0.4,
              radius: 0.08,
              h: poleH,
              color: Colors.white70,
            );
            drawIsoCylinder(
              canvas,
              gx: canopyGx + 0.5,
              gy: canopyGy + canopyD - 0.4,
              radius: 0.08,
              h: poleH,
              color: Colors.white70,
            );
            drawIsoCylinder(
              canvas,
              gx: canopyGx + canopyW - 0.5,
              gy: canopyGy + canopyD - 0.4,
              radius: 0.08,
              h: poleH,
              color: Colors.white70,
            );

            // Üst Kanopi Çatı Bloğu (Beyaz + Kırmızı Şerit)
            drawIsoBox(
              canvas,
              gx: canopyGx,
              gy: canopyGy,
              w: canopyW,
              d: canopyD,
              h: 0.35,
              color: Colors.white,
              baseZ: poleH,
            );

            // Kanopi Kenarı Kırmızı Şerit
            drawIsoBox(
              canvas,
              gx: canopyGx,
              gy: canopyGy + canopyD - 0.05,
              w: canopyW,
              d: 0.05,
              h: 0.12,
              color: StationTheme.red,
              baseZ: poleH + 0.1,
            );

            // Gece Kanopi Altı Işık Havuzu
            if (isNight) {
              final lightCenter = iso(
                canopyGx + canopyW / 2,
                canopyGy + canopyD / 2,
                0,
              );
              final lightPaint = Paint()
                ..style = PaintingStyle.fill
                ..color = const Color(0xFFFFF9C4).withValues(alpha: 0.18)
                ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18);
              canvas.drawCircle(lightCenter, 60.0, lightPaint);
            }
          },
        ),
      );
    }

    // 2.5 DEV BENELOIL TOTEM TABELASI (Yol Girişinde)
    world.props.add(
      CustomIsoProp(
        gx: 3.5,
        gy: 13.5,
        w: 1.0,
        d: 1.0,
        onRender: (canvas) {
          drawContactShadow(canvas, gx: 3.5, gy: 13.5, w: 0.8, d: 0.8);

          // Uzun Direk
          drawIsoBox(
            canvas,
            gx: 3.8,
            gy: 13.8,
            w: 0.4,
            d: 0.4,
            h: 4.6,
            color: const Color(0xFF4A5057),
          );

          // Totem Fiyat Panosu (Tepede)
          drawIsoBox(
            canvas,
            gx: 3.0,
            gy: 13.4,
            w: 2.0,
            d: 0.6,
            h: 2.2,
            color: const Color(0xFF222831),
            baseZ: 3.2,
          );

          // Kırmızı Başlık
          drawIsoBox(
            canvas,
            gx: 3.0,
            gy: 13.4,
            w: 2.0,
            d: 0.6,
            h: 0.4,
            color: StationTheme.red,
            baseZ: 5.0,
          );

          // BENELOIL Yazısı
          final totemTitle = TextPainter(
            text: const TextSpan(
              text: 'BENELOIL',
              style: TextStyle(
                fontFamily: 'Courier',
                fontSize: 7.5,
                fontWeight: FontWeight.w900,
                color: Colors.white,
              ),
            ),
            textDirection: TextDirection.ltr,
          )..layout();
          totemTitle.paint(canvas, iso(3.2, 14.1, 5.1));

          // Fiyat Yazıları (Yeşil LED rakamlar)
          final pricesText = TextPainter(
            text: TextSpan(
              children: [
                TextSpan(
                  text: 'B: ${(state.prices[FuelType.benzin] ?? 43.5).toStringAsFixed(1)}\n',
                  style: const TextStyle(fontSize: 6.5, color: StationTheme.green, fontWeight: FontWeight.bold),
                ),
                TextSpan(
                  text: 'D: ${(state.prices[FuelType.dizel] ?? 44.0).toStringAsFixed(1)}\n',
                  style: const TextStyle(fontSize: 6.5, color: StationTheme.orange, fontWeight: FontWeight.bold),
                ),
                TextSpan(
                  text: 'L: ${(state.prices[FuelType.lpg] ?? 22.5).toStringAsFixed(1)}',
                  style: const TextStyle(fontSize: 6.5, color: StationTheme.blue, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            textDirection: TextDirection.ltr,
          )..layout();
          pricesText.paint(canvas, iso(3.2, 14.1, 3.4));
        },
      ),
    );

    // 2.6 OTO YIKAMA TÜNELİ (Eğer satın alınmışsa)
    if (state.hasCarWash) {
      world.props.add(
        CustomIsoProp(
          gx: 5.0,
          gy: 3.5,
          w: 4.0,
          d: 4.5,
          onRender: (canvas) {
            drawContactShadow(canvas, gx: 5.0, gy: 3.5, w: 4.0, d: 4.5);
            drawIsoBox(
              canvas,
              gx: 5.0,
              gy: 3.5,
              w: 4.0,
              d: 4.5,
              h: 1.9,
              color: const Color(0xFF3B82F6),
            );
            // Yıkama Giriş Kemeri
            drawIsoBox(
              canvas,
              gx: 5.8,
              gy: 7.9,
              w: 2.4,
              d: 0.1,
              h: 1.5,
              color: const Color(0xFF1E293B),
            );
          },
        ),
      );
    }

    // 2.7 EV ELEKTRİK HIZLI ŞARJ İSTASYONU (Eğer satın alınmışsa)
    if (state.hasEvCharger) {
      world.props.add(
        CustomIsoProp(
          gx: 9.8,
          gy: 3.8,
          w: 3.0,
          d: 1.2,
          onRender: (canvas) {
            drawContactShadow(canvas, gx: 9.8, gy: 3.8, w: 3.0, d: 1.2);
            drawIsoBox(
              canvas,
              gx: 9.8,
              gy: 3.8,
              w: 3.0,
              d: 1.2,
              h: 0.15,
              color: StationTheme.isoConcreteEdge,
            );
            // 2 Adet EV Ünitesi
            drawIsoBox(
              canvas,
              gx: 10.2,
              gy: 4.1,
              w: 0.7,
              d: 0.5,
              h: 1.3,
              color: StationTheme.evCyan,
              baseZ: 0.15,
            );
            drawIsoBox(
              canvas,
              gx: 11.8,
              gy: 4.1,
              w: 0.7,
              d: 0.5,
              h: 1.3,
              color: StationTheme.evCyan,
              baseZ: 0.15,
            );
          },
        ),
      );
    }

    // 2.8 PROPLAR: SOKAK LAMBALARI VE LOW-POLY AĞAÇLAR
    // Ağaçlar
    world.props.add(TreeIsoProp(gx: 0.0, gy: 4.0, foliageColor: StationTheme.isoTree, scale: 1.2));
    world.props.add(TreeIsoProp(gx: 1.5, gy: 7.5, foliageColor: const Color(0xFF388E3C), scale: 1.0));
    world.props.add(TreeIsoProp(gx: 22.5, gy: 2.5, foliageColor: StationTheme.isoTree, scale: 1.3));
    world.props.add(TreeIsoProp(gx: 23.5, gy: 6.5, foliageColor: const Color(0xFF2E7D32), scale: 1.1));
    world.props.add(TreeIsoProp(gx: 22.0, gy: 11.0, foliageColor: StationTheme.isoTree, scale: 1.0));
    world.props.add(TreeIsoProp(gx: -1.0, gy: 18.0, foliageColor: const Color(0xFF388E3C), scale: 0.9));
    world.props.add(TreeIsoProp(gx: 26.0, gy: 17.5, foliageColor: StationTheme.isoTree, scale: 1.1));

    // Sokak Lambaları
    world.props.add(LampIsoProp(gx: 5.5, gy: 12.8, isNight: isNight));
    world.props.add(LampIsoProp(gx: 18.5, gy: 12.8, isNight: isNight));
    world.props.add(LampIsoProp(gx: 13.5, gy: 3.2, isNight: isNight));
  }

  /// Atmosfer & Gün/Gece Renk Filtresi (Faz 6)
  void _renderAtmosphere(Canvas canvas, double timeOfDay) {
    Color? ambientColor;

    if (timeOfDay < 5.0 || timeOfDay >= 22.0) {
      // Tam Gece (Derin Lacivert / Mor)
      ambientColor = const Color(0xFF0F172A).withValues(alpha: 0.38);
    } else if (timeOfDay >= 5.0 && timeOfDay < 7.0) {
      // Şafak / Sabah Güneşi (Sıcak Şeftali)
      final progress = (timeOfDay - 5.0) / 2.0;
      final dawnColor = Color.lerp(
        const Color(0xFF0F172A).withValues(alpha: 0.38),
        const Color(0xFFF97316).withValues(alpha: 0.16),
        progress,
      );
      ambientColor = dawnColor;
    } else if (timeOfDay >= 7.0 && timeOfDay < 18.0) {
      // Gündüz — Tint yok
      ambientColor = null;
    } else if (timeOfDay >= 18.0 && timeOfDay < 20.5) {
      // Gün Batımı / Alacakaranlık (Sıcak Turuncu / Amber)
      final progress = (timeOfDay - 18.0) / 2.5;
      final duskColor = Color.lerp(
        Colors.transparent,
        const Color(0xFFEA580C).withValues(alpha: 0.22),
        progress,
      );
      ambientColor = duskColor;
    } else {
      // Akşamdan Geceye Geçiş (20.5 -> 22.0)
      final progress = (timeOfDay - 20.5) / 1.5;
      final nightColor = Color.lerp(
        const Color(0xFFEA580C).withValues(alpha: 0.22),
        const Color(0xFF0F172A).withValues(alpha: 0.38),
        progress,
      );
      ambientColor = nightColor;
    }

    if (ambientColor != null) {
      final overlayRect = Rect.fromCenter(
        center: Offset.zero,
        width: game.size.x * 3.0,
        height: game.size.y * 3.0,
      );
      final overlayPaint = Paint()
        ..style = PaintingStyle.fill
        ..color = ambientColor
        ..blendMode = BlendMode.darken;
      canvas.drawRect(overlayRect, overlayPaint);
    }
  }
}
