extends Node

## I18n: Dynamic Multi-Language Localization Singleton (TR / EN)
## PixelOil 3D Godot Engine Synchronized Localization

signal locale_changed(new_locale: String)

var current_locale: String = "tr"

const DICTIONARY: Dictionary = {
	"tr": {
		"cash": "KASA",
		"day": "GÜN",
		"reputation": "İTİBAR",
		"gasoline": "BENZİN",
		"diesel": "DİZEL",
		"lpg": "LPG",
		"electric": "ELEKTRİK",
		"fab_build": "İnşaat",
		"fab_order": "Sipariş",
		"fab_office": "Ofis",
		"liters_label": "LİTRE (L)",
		"cost_label": "TUTAR (TL)",
		"fill_full": "FULLE",
		"btn_start_pump": "POMPAYI BAŞLAT",
		"btn_finish_pump": "TAMAMLA & UĞURLA",
		"btn_wash_tip": "Camları Sil (+₺25 Bahşiş)",
		"build_title": "İstasyon Yatırımları",
		"upgrade_pump_title": "Pompa Adası Ekle",
		"upgrade_pump_desc": "Aynı anda daha fazla araca dolum yapın.",
		"upgrade_wash_title": "Otomatik Tünel Oto Yıkama",
		"upgrade_wash_desc": "Gelen araçlardan otomatik yıkama ücreti tahsil eder.",
		"upgrade_solar_title": "Çatı Güneş Enerjisi (GES)",
		"upgrade_solar_desc": "Gündüz istasyonun elektrik faturasını sıfırlar.",
		"upgrade_mgr_title": "İstasyon Müdürü İşe Al",
		"upgrade_mgr_desc": "Dolum ve tanker siparişlerini otomatik yönetir.",
		"btn_bought": "ALINDI",
		"btn_working": "ÇALIŞIYOR",
		"order_title": "Yakıt Siparişi (Tanker)",
		"tank_status": "Depo",
		"office_title": "İstasyon Yönetim Ofisi",
		"stat_total_rev": "Toplam Ciro:",
		"stat_total_cars": "Hizmet Verilen Araç:",
		"stat_satisfaction": "Genel Memnuniyet:",
		"tariff_title": "Litre / Birim Satış Tarifesi",
		"cost_prefix": "Maliyet",
		"no_waiting_car": "(Bekleyen Araç Yok)",
		"toast_welcome": "PixelOil 3D İstasyonuna Hoş Geldiniz!",
		"toast_car_docked": "Araç #%s pompasına yanaştı.",
		"toast_fuel_empty": "UYARI: Depoda %s kalmadı!",
		"toast_collected": "+₺%s tahsil edildi.",
		"toast_tip": "Camlar temizlendi (+₺25 Bahşiş).",
		"toast_mgr": "İstasyon Müdürü: Pompa #%s dolduruldu (+₺%s)",
		"toast_speed": "Zaman Hızı: %sx",
		"toast_max_pumps": "Maksimum pompa sayısına ulaşıldı (4).",
		"toast_insufficient_funds": "Yetersiz bakiye! (Gereken: ₺%s)",
		"toast_pump_built": "Pompa #%s inşa edildi.",
		"toast_wash_active": "Otomatik Oto Yıkama aktif edildi (+₺80/araç).",
		"toast_solar_built": "Çatı GES kuruldu. Gündüz elektrik faturası ₺0.",
		"toast_mgr_hired": "İstasyon Müdürü göreve başladı. Dolumlar otomatik.",
		"toast_tanker_arrived": "%sL %s tankeri ikmal yaptı.",
		"toast_tank_overflow": "Depo kapasitesi aşılıyor! (Boş yer: %s L)",
		"toast_tariff_updated": "%s tarifesi güncellendi: ₺%s",
		"toast_new_day": "GÜN %s BAŞLADI"
	},
	"en": {
		"cash": "CASH",
		"day": "DAY",
		"reputation": "RATING",
		"gasoline": "GASOLINE",
		"diesel": "DIESEL",
		"lpg": "LPG",
		"electric": "ELECTRIC",
		"fab_build": "Build",
		"fab_order": "Order",
		"fab_office": "Office",
		"liters_label": "LITERS (L)",
		"cost_label": "COST (TL)",
		"fill_full": "FILL UP",
		"btn_start_pump": "START PUMP",
		"btn_finish_pump": "COMPLETE & DISMISS",
		"btn_wash_tip": "Wash Windshield (+₺25 Tip)",
		"build_title": "Station Investments",
		"upgrade_pump_title": "Add Pump Island",
		"upgrade_pump_desc": "Serve more vehicles simultaneously.",
		"upgrade_wash_title": "Automatic Tunnel Car Wash",
		"upgrade_wash_desc": "Automatically charges incoming vehicles for wash.",
		"upgrade_solar_title": "Rooftop Solar (PV)",
		"upgrade_solar_desc": "Eliminates daytime station power bills.",
		"upgrade_mgr_title": "Hire Station Manager",
		"upgrade_mgr_desc": "Automates car refueling and tanker orders.",
		"btn_bought": "OWNED",
		"btn_working": "ACTIVE",
		"order_title": "Fuel Tanker Order",
		"tank_status": "Tank",
		"office_title": "Station Management Office",
		"stat_total_rev": "Total Revenue:",
		"stat_total_cars": "Vehicles Served:",
		"stat_satisfaction": "Satisfaction:",
		"tariff_title": "Fuel Unit Price Tariff",
		"cost_prefix": "Cost",
		"no_waiting_car": "(No Waiting Vehicle)",
		"toast_welcome": "Welcome to PixelOil 3D Station!",
		"toast_car_docked": "Vehicle docked at Pump #%s.",
		"toast_fuel_empty": "WARNING: Out of %s fuel in storage!",
		"toast_collected": "+₺%s collected.",
		"toast_tip": "Windshield cleaned (+₺25 Tip).",
		"toast_mgr": "Station Manager: Filled Pump #%s (+₺%s)",
		"toast_speed": "Time Speed: %sx",
		"toast_max_pumps": "Maximum pump count reached (4).",
		"toast_insufficient_funds": "Insufficient funds! (Required: ₺%s)",
		"toast_pump_built": "Pump #%s constructed.",
		"toast_wash_active": "Automatic Car Wash activated (+₺80/car).",
		"toast_solar_built": "Solar panels installed. Daytime power cost ₺0.",
		"toast_mgr_hired": "Station Manager hired. Refueling automated.",
		"toast_tanker_arrived": "%sL %s tanker delivery completed.",
		"toast_tank_overflow": "Tank capacity exceeded! (Available: %s L)",
		"toast_tariff_updated": "%s tariff updated: ₺%s",
		"toast_new_day": "DAY %s HAS BEGUN"
	}
}

func _ready() -> void:
	# Load persisted locale if available
	pass

func t(key: String, args: Array = []) -> String:
	var dict: Dictionary = DICTIONARY.get(current_locale, DICTIONARY["tr"])
	var text: String = dict.get(key, key)
	if args.size() > 0:
		text = text % args
	return text

func set_locale(locale: String) -> void:
	if locale == "tr" or locale == "en":
		current_locale = locale
		locale_changed.emit(current_locale)

func toggle_locale() -> void:
	if current_locale == "tr":
		set_locale("en")
	else:
		set_locale("tr")
