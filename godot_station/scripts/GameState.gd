extends Node

## GameState: Core Tycoon Economy, Fuel Tanks, Upgrades, Staff and 7-Minute 24h Simulation
## Fully synchronized with Web 3D PixelOil Engine

var money: float = 8500.0
var reputation: float = 4.8
var total_revenue: float = 0.0
var total_customers_served: int = 0

var day: int = 1
var hour: int = 8
var minute: float = 0.0
var time_speed: float = 1.0

# 7 real minutes (420 seconds) = 1 in-game day (1440 game minutes)
const INGAME_MINUTES_PER_REAL_SECOND: float = 1440.0 / 420.0

# Station Infrastructure Upgrades (Starts with ONLY 1 Pump)
var pumps_count: int = 1 # 1 to 4
var has_car_wash: bool = false
var has_market: bool = false
var has_solar_panels: bool = false
var has_turbine: bool = false
var has_ev_charger: bool = false
var has_manager: bool = false

# Themes
var current_theme: String = "standard"
var unlocked_themes: Array = ["standard"]

# Visual Addons
var has_totem_addon: bool = false
var has_garden_addon: bool = false

# Staff Levels (Starts with 0 - requires manual pumping initially!)
var staff_attendant: int = 0
var staff_cashier: int = 0
var staff_manager: int = 0

# Land Parcels & Base Size
var land_size: float = 80.0
var parcel_a: bool = false
var parcel_b: bool = false
var parcel_c: bool = false

# Asynchronous Construction & Training Timers
var active_timers: Array = []

# Financials & Ledger
var fuel_revenue: float = 0.0
var fuel_cost: float = 0.0
var facility_revenue: float = 0.0
var staff_salaries: float = 0.0
var energy_net: float = 0.0
var bank_loan: float = 0.0

# Contracts & Tenders
var contract_bus: bool = false
var contract_courier: bool = false
var contract_taxi: bool = false

# Fuel Storage Tanks (Current Liters / kWh)
var tanks: Dictionary = {
	"benzin": 3200.0,
	"dizel": 3800.0,
	"lpg": 1800.0,
	"elektrik": 100.0
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
	"elektrik": 4.5
}

# Retail Pump Sell Prices (₺ / Unit)
var sell_prices: Dictionary = {
	"benzin": 44.9,
	"dizel": 45.4,
	"lpg": 26.2,
	"elektrik": 9.8
}

var _manager_timer: float = 0.0

func _ready() -> void:
	call_deferred("_emit_initial_state")

func _emit_initial_state() -> void:
	EventBus.money_changed.emit(money, 0.0)
	EventBus.time_updated.emit(hour, int(minute), day)
	EventBus.reputation_changed.emit(reputation)
	for f in tanks.keys():
		EventBus.tank_updated.emit(f, tanks[f], capacities[f])

func _process(delta: float) -> void:
	# Continuous 7-minute Day Simulation
	var advance_mins: float = delta * INGAME_MINUTES_PER_REAL_SECOND * time_speed
	minute += advance_mins
	while minute >= 60.0:
		minute -= 60.0
		hour += 1
		
		# Hourly Turbine Generation
		if has_turbine:
			add_money(180.0)
		
		if hour >= 24:
			hour = 0
			day += 1
			_daily_summary()

	EventBus.time_updated.emit(hour, int(minute), day)

	# Process Active Construction/Training Timers
	_process_active_timers(delta)

	# Manager Automation (Auto refuels idle cars & orders critical fuel)
	if has_manager:
		_manager_timer += delta
		if _manager_timer >= 3.0:
			_manager_timer = 0.0
			_run_manager_cycle()

func _process_active_timers(delta: float) -> void:
	for i in range(active_timers.size() - 1, -1, -1):
		var timer = active_timers[i]
		timer.remaining -= delta * time_speed
		if timer.remaining <= 0.0:
			if timer.has("callback") and timer.callback.is_valid():
				timer.callback.call()
			active_timers.remove_at(i)

func _daily_summary() -> void:
	if contract_bus: add_money(5500.0)
	if contract_courier: add_money(3800.0)
	if contract_taxi: add_money(2900.0)
	
	if bank_loan > 0:
		var interest: float = bank_loan * 0.02
		money = max(0.0, money - interest)
		
	EventBus.show_toast.emit(I18n.t("toast_new_day", [day]), true)

func _run_manager_cycle() -> void:
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
		fuel_cost += cost
		EventBus.tank_updated.emit(fuel_type, tanks[fuel_type], cap)
		EventBus.tanker_arrived.emit(fuel_type, amount)
		var msg: String = I18n.t("toast_tanker_arrived", [int(amount), I18n.t(fuel_type)])
		if auto_ordered:
			msg = "[Müdür] " + msg
		EventBus.show_toast.emit(msg, true)
		return true
	else:
		EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(cost)]), false)
		return false

func refuel_car(fuel_type: String, requested_units: float) -> Dictionary:
	var available: float = tanks.get(fuel_type, 0.0)
	var filled: float = min(available, requested_units)
	var price_per_unit: float = sell_prices.get(fuel_type, 40.0)
	var earned: float = filled * price_per_unit

	if has_car_wash:
		earned += 45.0
		facility_revenue += 45.0
	if has_market:
		earned += 35.0 * max(1, staff_cashier)
		facility_revenue += 35.0 * max(1, staff_cashier)

	tanks[fuel_type] = max(0.0, available - filled)
	add_money(earned)
	fuel_revenue += filled * price_per_unit
	fuel_cost += filled * buy_costs.get(fuel_type, 0.0)
	total_customers_served += 1
	reputation = min(5.0, reputation + 0.02)

	EventBus.tank_updated.emit(fuel_type, tanks[fuel_type], capacities[fuel_type])
	EventBus.reputation_changed.emit(reputation)
	EventBus.vehicle_refueled.emit(fuel_type, filled, earned)

	return {
		"filled": filled,
		"earned": earned
	}

# Upgrades with Timers
func upgrade_pumps() -> bool:
	if pumps_count >= 4:
		return false
	var cost: float = 6000.0 + (pumps_count - 1) * 2000.0
	if spend_money(cost):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", ["Pompa #%d" % (pumps_count + 1), 45]), true)
		active_timers.append({
			"id": "pump_%d" % (pumps_count + 1),
			"total": 45.0,
			"remaining": 45.0,
			"callback": Callable(self, "_on_pump_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(cost)]), false)
	return false

func _on_pump_built() -> void:
	pumps_count += 1
	EventBus.station_upgraded.emit("Pompa %d Kuruldu" % pumps_count)
	EventBus.show_toast.emit(I18n.t("toast_pump_built", [pumps_count]), true)

func build_car_wash() -> bool:
	if has_car_wash:
		return false
	if spend_money(12000.0):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", [I18n.t("upgrade_wash_title"), 90]), true)
		active_timers.append({
			"id": "wash",
			"total": 90.0,
			"remaining": 90.0,
			"callback": Callable(self, "_on_wash_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["12.000"]), false)
	return false

func _on_wash_built() -> void:
	has_car_wash = true
	EventBus.station_upgraded.emit("Oto Yıkama")
	EventBus.show_toast.emit(I18n.t("toast_wash_active"), true)

func build_market() -> bool:
	if has_market:
		return false
	if spend_money(14000.0):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", [I18n.t("upgrade_market_title"), 90]), true)
		active_timers.append({
			"id": "market",
			"total": 90.0,
			"remaining": 90.0,
			"callback": Callable(self, "_on_market_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["14.000"]), false)
	return false

func _on_market_built() -> void:
	has_market = true
	EventBus.station_upgraded.emit("Mini Market")
	EventBus.show_toast.emit(I18n.t("toast_market_active"), true)

func build_solar_panels() -> bool:
	if has_solar_panels:
		return false
	if spend_money(8500.0):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", [I18n.t("upgrade_solar_title"), 60]), true)
		active_timers.append({
			"id": "solar",
			"total": 60.0,
			"remaining": 60.0,
			"callback": Callable(self, "_on_solar_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["8.500"]), false)
	return false

func _on_solar_built() -> void:
	has_solar_panels = true
	buy_costs["elektrik"] = 0.0
	EventBus.station_upgraded.emit("Güneş Santrali")
	EventBus.show_toast.emit(I18n.t("toast_solar_built"), true)

func build_turbine() -> bool:
	if has_turbine:
		return false
	if spend_money(11000.0):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", ["Rüzgar Türbini", 60]), true)
		active_timers.append({
			"id": "turbine",
			"total": 60.0,
			"remaining": 60.0,
			"callback": Callable(self, "_on_turbine_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["11.000"]), false)
	return false

func _on_turbine_built() -> void:
	has_turbine = true
	EventBus.station_upgraded.emit("Rüzgar Türbini")
	EventBus.show_toast.emit(I18n.t("toast_turbine_built"), true)

func build_ev_charger() -> bool:
	if has_ev_charger:
		return false
	if spend_money(18000.0):
		EventBus.show_toast.emit(I18n.t("toast_construction_started", ["EV Ultra Şarj", 60]), true)
		active_timers.append({
			"id": "ev",
			"total": 60.0,
			"remaining": 60.0,
			"callback": Callable(self, "_on_ev_built")
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["18.000"]), false)
	return false

func _on_ev_built() -> void:
	has_ev_charger = true
	EventBus.station_upgraded.emit("EV Şarj İstasyonu")
	EventBus.show_toast.emit(I18n.t("toast_ev_built"), true)

func train_staff(staff_type: String, cost: float) -> bool:
	if spend_money(cost):
		EventBus.show_toast.emit(I18n.t("toast_training_started", [I18n.t("staff_" + staff_type), 30]), true)
		active_timers.append({
			"id": "staff_" + staff_type,
			"total": 30.0,
			"remaining": 30.0,
			"callback": Callable(self, "_on_staff_trained").bind(staff_type)
		})
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(cost)]), false)
	return false

func _on_staff_trained(staff_type: String) -> void:
	if staff_type == "attendant":
		staff_attendant += 1
		EventBus.show_toast.emit(I18n.t("toast_training_finished", [I18n.t("staff_attendant"), staff_attendant]), true)
	elif staff_type == "cashier":
		staff_cashier += 1
		EventBus.show_toast.emit(I18n.t("toast_training_finished", [I18n.t("staff_cashier"), staff_cashier]), true)
	elif staff_type == "manager":
		staff_manager += 1
		has_manager = true
		EventBus.show_toast.emit(I18n.t("toast_training_finished", [I18n.t("staff_manager"), staff_manager]), true)

func buy_land(parcel: String, cost: float) -> bool:
	if spend_money(cost):
		if parcel == "A":
			parcel_a = true
			land_size = 100.0
		elif parcel == "B":
			parcel_b = true
			land_size = 115.0
		elif parcel == "C":
			parcel_c = true
			land_size = 130.0
		EventBus.show_toast.emit(I18n.t("toast_land_expanded", [parcel]), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(cost)]), false)
	return false

func take_loan() -> void:
	add_money(25000.0)
	bank_loan += 25000.0
	EventBus.show_toast.emit(I18n.t("toast_loan_taken"), true)

func sign_contract(key: String, collateral: float) -> bool:
	if spend_money(collateral):
		if key == "bus": contract_bus = true
		elif key == "courier": contract_courier = true
		elif key == "taxi": contract_taxi = true
		EventBus.show_toast.emit(I18n.t("toast_tender_signed", [key.to_upper()]), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(collateral)]), false)
	return false

func get_sky_color() -> Color:
	if hour >= 22 or hour < 5:
		return Color(0.12, 0.14, 0.22)
	elif hour >= 5 and hour < 8:
		return Color(0.88, 0.62, 0.48)
	elif hour >= 8 and hour < 18:
		return Color(0.749, 0.878, 0.933)
	else:
		return Color(0.85, 0.48, 0.38)
