extends Node

## GameState: Core Tycoon Economy, Fuel Tanks, Upgrades, Staff and 24h Simulation
## Fully synchronized with Web 3D PixelOil Engine

var money: float = 16500.0
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

# Staff Levels
var staff_attendant: int = 1
var staff_cashier: int = 1
var staff_manager: int = 0

# Land Parcels & Base Size
var land_size: float = 80.0
var parcel_a: bool = false
var parcel_b: bool = false
var parcel_c: bool = false

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
	"benzin": 3500.0,
	"dizel": 4200.0,
	"lpg": 2100.0,
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

var _time_acc: float = 0.0
var _manager_timer: float = 0.0

func _ready() -> void:
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

	# Manager Automation
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
		
		# Hourly Turbine Generation
		if has_turbine:
			add_money(180.0)
		
		if hour >= 24:
			hour = 0
			day += 1
			_daily_summary()

	EventBus.time_updated.emit(hour, minute, day)

func _daily_summary() -> void:
	# Payout Tenders
	if contract_bus: add_money(5500.0)
	if contract_courier: add_money(3800.0)
	if contract_taxi: add_money(2900.0)
	
	# Loan interest
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

	# Facility additions: Wash (+45), Market (+35 * cashier)
	if has_car_wash:
		earned += 45.0
		facility_revenue += 45.0
	if has_market:
		earned += 35.0 * staff_cashier
		facility_revenue += 35.0 * staff_cashier

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

# Upgrades & Tabs
func upgrade_pumps() -> bool:
	if pumps_count >= 4:
		return false
	var cost: float = 6000.0
	if spend_money(cost):
		pumps_count += 1
		EventBus.station_upgraded.emit("Pompa %d Kuruldu" % pumps_count)
		EventBus.show_toast.emit(I18n.t("toast_pump_built", [pumps_count]), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["6.000"]), false)
	return false

func build_car_wash() -> bool:
	if has_car_wash:
		return false
	if spend_money(12000.0):
		has_car_wash = true
		EventBus.station_upgraded.emit("Oto Yıkama")
		EventBus.show_toast.emit(I18n.t("toast_wash_active"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["12.000"]), false)
	return false

func build_market() -> bool:
	if has_market:
		return false
	if spend_money(14000.0):
		has_market = true
		EventBus.station_upgraded.emit("Mini Market")
		EventBus.show_toast.emit(I18n.t("toast_market_active"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["14.000"]), false)
	return false

func build_solar_panels() -> bool:
	if has_solar_panels:
		return false
	if spend_money(8500.0):
		has_solar_panels = true
		buy_costs["elektrik"] = 0.0
		EventBus.station_upgraded.emit("Güneş Santrali")
		EventBus.show_toast.emit(I18n.t("toast_solar_built"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["8.500"]), false)
	return false

func build_turbine() -> bool:
	if has_turbine:
		return false
	if spend_money(11000.0):
		has_turbine = true
		EventBus.station_upgraded.emit("Rüzgar Türbini")
		EventBus.show_toast.emit(I18n.t("toast_turbine_built"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["11.000"]), false)
	return false

func build_ev_charger() -> bool:
	if has_ev_charger:
		return false
	if spend_money(18000.0):
		has_ev_charger = true
		EventBus.station_upgraded.emit("EV Şarj İstasyonu")
		EventBus.show_toast.emit(I18n.t("toast_ev_built"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", ["18.000"]), false)
	return false

func train_staff(staff_type: String, cost: float) -> bool:
	if spend_money(cost):
		if staff_type == "attendant":
			staff_attendant += 1
			EventBus.show_toast.emit(I18n.t("toast_staff_trained", [I18n.t("staff_attendant"), staff_attendant]), true)
		elif staff_type == "cashier":
			staff_cashier += 1
			EventBus.show_toast.emit(I18n.t("toast_staff_trained", [I18n.t("staff_cashier"), staff_cashier]), true)
		elif staff_type == "manager":
			staff_manager += 1
			has_manager = true
			EventBus.show_toast.emit(I18n.t("toast_mgr_hired"), true)
		return true
	EventBus.show_toast.emit(I18n.t("toast_insufficient_funds", [int(cost)]), false)
	return false

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
