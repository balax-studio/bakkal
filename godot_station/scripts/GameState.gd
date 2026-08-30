extends Node

## GameState: Core Tycoon Economy, Fuel Tanks, Upgrades and 24h Simulation

var money: float = 12500.0
var reputation: float = 4.8
var total_revenue: float = 0.0
var total_customers_served: int = 0

var day: int = 1
var hour: int = 8
var minute: int = 30
var time_speed: float = 4.0 # In-game minutes per real second

# Station Infrastructure Upgrades
var pumps_count: int = 2 # 1 to 4
var has_car_wash: bool = false
var has_solar_panels: bool = false
var has_ev_charger: bool = false
var has_manager: bool = false

# Fuel Storage Tanks (Current Liters / kWh)
var tanks: Dictionary = {
	"benzin": 3500.0,
	"dizel": 4200.0,
	"lpg": 2100.0,
	"elektrik": 85.0
}

# Maximum Capacities
var capacities: Dictionary = {
	"benzin": 5000.0,
	"dizel": 5000.0,
	"lpg": 3000.0,
	"elektrik": 100.0
}

# Wholesale Buy Costs (₺ / Unit)
var buy_costs: Dictionary = {
	"benzin": 38.5,
	"dizel": 39.2,
	"lpg": 21.8,
	"elektrik": 4.2
}

# Retail Pump Sell Prices (₺ / Unit)
var sell_prices: Dictionary = {
	"benzin": 44.9,
	"dizel": 45.4,
	"lpg": 26.2,
	"elektrik": 8.5
}

var _time_acc: float = 0.0
var _manager_timer: float = 0.0

func _ready() -> void:
	# Initial notifications
	call_deferred("_emit_initial_state")

func _emit_initial_state() -> void:
	EventBus.money_changed.emit(money, 0.0)
	EventBus.time_updated.emit(hour, minute, day)
	EventBus.reputation_changed.emit(reputation)
	for f in tanks.keys():
		EventBus.tank_updated.emit(f, tanks[f], capacities[f])

func _process(delta: float) -> void:
	_time_acc += delta * time_speed
	if _time_acc >= 1.0:
		var mins_to_add: int = int(_time_acc)
		_time_acc -= mins_to_add
		_advance_time(mins_to_add)

	# Manager Automation (Auto refuels idle cars & orders critical fuel)
	if has_manager:
		_manager_timer += delta
		if _manager_timer >= 3.0:
			_manager_timer = 0.0
			_run_manager_cycle()

func _advance_time(mins: int) -> void:
	minute += mins
	while minute >= 60:
		minute -= 60
		hour += 1
		if hour >= 24:
			hour = 0
			day += 1
			_daily_summary()

	EventBus.time_updated.emit(hour, minute, day)

func _daily_summary() -> void:
	EventBus.show_toast.emit("Yeni Gün Başladı! (Gün %d)" % day, true)

func _run_manager_cycle() -> void:
	# Check low tanks (<20%) and auto-order if affordable
	for fuel in ["benzin", "dizel", "lpg"]:
		var current: float = tanks[fuel]
		var cap: float = capacities[fuel]
		if current < cap * 0.25:
			var needed: float = cap - current
			var cost: float = needed * buy_costs[fuel]
			if money >= cost:
				order_tanker(fuel, needed, true)

func add_money(amount: float) -> void:
	money += amount
	total_revenue += amount
	EventBus.money_changed.emit(money, amount)

func spend_money(amount: float) -> bool:
	if money >= amount:
		money -= amount
		EventBus.money_changed.emit(money, -amount)
		return true
	return false

func order_tanker(fuel_type: String, amount: float, auto_ordered: bool = false) -> bool:
	if not buy_costs.has(fuel_type):
		return false
	var cost: float = amount * buy_costs[fuel_type]
	if spend_money(cost):
		var cur: float = tanks[fuel_type]
		var cap: float = capacities[fuel_type]
		tanks[fuel_type] = min(cap, cur + amount)
		EventBus.tank_updated.emit(fuel_type, tanks[fuel_type], cap)
		EventBus.tanker_arrived.emit(fuel_type, amount)
		var msg: String = "Tanker Geldi: +%d %s dolduruldu!" % [int(amount), fuel_type.to_upper()]
		if auto_ordered:
			msg = "[Müdür] Otomatik Sipariş: +%d %s dolduruldu!" % [int(amount), fuel_type.to_upper()]
		EventBus.show_toast.emit(msg, true)
		return true
	else:
		EventBus.show_toast.emit("Kasa Yetersiz! Sipariş verilemedi.", false)
		return false

func refuel_car(fuel_type: String, requested_units: float) -> Dictionary:
	var available: float = tanks.get(fuel_type, 0.0)
	var filled: float = min(available, requested_units)
	var price_per_unit: float = sell_prices.get(fuel_type, 40.0)
	var earned: float = filled * price_per_unit

	tanks[fuel_type] = max(0.0, available - filled)
	add_money(earned)
	total_customers_served += 1
	reputation = min(5.0, reputation + 0.02)

	EventBus.tank_updated.emit(fuel_type, tanks[fuel_type], capacities[fuel_type])
	EventBus.reputation_changed.emit(reputation)
	EventBus.vehicle_refueled.emit(fuel_type, filled, earned)

	return {
		"filled": filled,
		"earned": earned
	}

# Upgrades
func upgrade_pumps() -> bool:
	if pumps_count >= 4:
		return false
	var cost: float = 6000.0 * pumps_count
	if spend_money(cost):
		pumps_count += 1
		EventBus.station_upgraded.emit("Pompa %d Kuruldu" % pumps_count)
		EventBus.show_toast.emit("Yeni Pompa Adası Açıldı! (Toplam %d)" % pumps_count, true)
		return true
	EventBus.show_toast.emit("Yetersiz Bakiye!", false)
	return false

func build_car_wash() -> bool:
	if has_car_wash:
		return false
	if spend_money(12000.0):
		has_car_wash = true
		reputation = min(5.0, reputation + 0.3)
		EventBus.station_upgraded.emit("Oto Yıkama")
		EventBus.show_toast.emit("Otomatik Tünel Oto Yıkama Kuruldu! ★", true)
		return true
	EventBus.show_toast.emit("Yetersiz Bakiye!", false)
	return false

func build_solar_panels() -> bool:
	if has_solar_panels:
		return false
	if spend_money(8500.0):
		has_solar_panels = true
		buy_costs["elektrik"] = 0.0 # Free solar charging
		EventBus.station_upgraded.emit("Güneş Santrali")
		EventBus.show_toast.emit("Güneş Panelleri Kuruldu! Elektrik maliyeti ₺0 oldu.", true)
		return true
	EventBus.show_toast.emit("Yetersiz Bakiye!", false)
	return false

func build_ev_charger() -> bool:
	if has_ev_charger:
		return false
	if spend_money(10000.0):
		has_ev_charger = true
		EventBus.station_upgraded.emit("EV Şarj İstasyonu")
		EventBus.show_toast.emit("Hızlı EV Şarj İstasyonu Açıldı!", true)
		EventBus.tank_updated.emit("elektrik", tanks["elektrik"], capacities["elektrik"])
		return true
	EventBus.show_toast.emit("Yetersiz Bakiye!", false)
	return false

func hire_manager() -> bool:
	if has_manager:
		return false
	if spend_money(15000.0):
		has_manager = true
		EventBus.station_upgraded.emit("İstasyon Müdürü")
		EventBus.show_toast.emit("İstasyon Müdürü İşe Alındı! Otomasyon aktif.", true)
		return true
	EventBus.show_toast.emit("Yetersiz Bakiye!", false)
	return false

func get_sky_color() -> Color:
	# 24h Day/Night Cycle sky color
	if hour >= 22 or hour < 5:
		return Color(0.12, 0.14, 0.22) # Deep night
	elif hour >= 5 and hour < 8:
		return Color(0.88, 0.62, 0.48) # Dawn / Sunrise
	elif hour >= 8 and hour < 18:
		return Color(0.749, 0.878, 0.933) # Crisp Day Sky
	else:
		return Color(0.85, 0.48, 0.38) # Sunset / Dusk
