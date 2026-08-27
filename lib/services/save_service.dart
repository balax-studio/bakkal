import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/models/game_models.dart';

class SaveService {
  static const String _playerDataKey = 'myminimart_player_data_v1';
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  static Future<PlayerData> loadPlayerData() async {
    await init();
    final rawJson = _prefs?.getString(_playerDataKey);
    if (rawJson != null) {
      try {
        final Map<String, dynamic> decoded = jsonDecode(rawJson);
        return PlayerData.fromJson(decoded);
      } catch (e) {
        // Fallback on clean player data if corrupted
        return PlayerData();
      }
    }
    return PlayerData();
  }

  static Future<void> savePlayerData(PlayerData data) async {
    await init();
    final jsonStr = jsonEncode(data.toJson());
    await _prefs?.setString(_playerDataKey, jsonStr);
  }

  static Future<void> clearAll() async {
    await init();
    await _prefs?.remove(_playerDataKey);
  }
}
