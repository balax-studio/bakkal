import 'dart:convert';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/station_state.dart';

class SaveService {
  static const String _saveKey = 'istasyon_save_v1';

  static Future<bool> saveStation(StationState state) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = jsonEncode(state.toJson());
      return await prefs.setString(_saveKey, jsonString);
    } catch (_) {
      return false;
    }
  }

  static Future<StationState> loadStation() async {
    final state = StationState();
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_saveKey);
      if (jsonString != null && jsonString.isNotEmpty) {
        final Map<String, dynamic> data = jsonDecode(jsonString);
        state.loadFromJson(data);

        // Calculate Offline / AFK Earnings if manager was active
        final int lastSaved = (data['lastSaveTimestamp'] as num?)?.toInt() ?? 0;
        if (lastSaved > 0 && state.hasManager) {
          final now = DateTime.now().millisecondsSinceEpoch;
          final elapsedSeconds = (now - lastSaved) / 1000.0;
          if (elapsedSeconds > 60) {
            // Cap AFK earnings to max 8 hours (28800 seconds)
            final activeAfkSec = min(elapsedSeconds, 28800.0);
            // ~1 customer per 20 seconds
            final afkCustomers = (activeAfkSec / 20.0).floor();
            final afkIncome = afkCustomers * 65.0; // Average ~65₺ net profit
            state.addMoney(afkIncome);
          }
        }
      }
    } catch (_) {}
    return state;
  }

  static Future<void> clearSave() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_saveKey);
    } catch (_) {}
  }
}
