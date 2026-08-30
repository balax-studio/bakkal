extends CanvasLayer

var current_car: Node = null
var target_liters: float = 40.0
var current_liters: float = 0.0
var current_cost: float = 0.0
var is_pumping: bool = false
var is_finished: bool = false
var cleaned_windows: bool = false

@onready var panel_root: Control = $Root
@onready var label_title: Label = $Root/Card/VBox/Header/LabelTitle
@onready var label_liters: Label = $Root/Card/VBox/LcdDisplay/HBox/LitersBox/LabelLiters
@onready var label_cost: Label = $Root/Card/VBox/LcdDisplay/HBox/CostBox/LabelCost
@onready var btn_start: Button = $Root/Card/VBox/BtnStart
@onready var btn_finish: Button = $Root/Card/VBox/BtnFinish
@onready var btn_wash: Button = $Root/Card/VBox/BtnWash
@onready var btn_close: Button = $Root/Card/VBox/Header/BtnClose

func _ready() -> void:
	EventBus.open_service_panel.connect(_open)
	EventBus.close_service_panel.connect(_close)

	btn_close.pressed.connect(_close)
	btn_start.pressed.connect(_start_pumping)
	btn_finish.pressed.connect(_finish_and_depart)
	btn_wash.pressed.connect(_clean_windows)

	$Root/Card/VBox/Presets/Btn50.pressed.connect(func(): _set_preset(50.0))
	$Root/Card/VBox/Presets/Btn100.pressed.connect(func(): _set_preset(100.0))
	$Root/Card/VBox/Presets/Btn250.pressed.connect(func(): _set_preset(250.0))
	$Root/Card/VBox/Presets/BtnFull.pressed.connect(_set_full)

	panel_root.visible = false

func _open(car: Node) -> void:
	current_car = car
	target_liters = car.demanded_units
	current_liters = 0.0
	current_cost = 0.0
	is_pumping = false
	is_finished = false
	cleaned_windows = false

	label_title.text = "%s · %s" % [car.vehicle_name, car.fuel_type.to_upper()]
	_update_lcd()

	btn_start.visible = true
	btn_finish.visible = false
	btn_wash.visible = true
	panel_root.visible = true

func _close() -> void:
	panel_root.visible = false
	is_pumping = false

func _set_preset(cash: float) -> void:
	if is_pumping or is_finished:
		return
	var price: float = GameState.sell_prices.get(current_car.fuel_type, 44.0)
	target_liters = snapped(cash / price, 0.1)
	_update_lcd()

func _set_full() -> void:
	if is_pumping or is_finished:
		return
	target_liters = current_car.demanded_units
	_update_lcd()

func _clean_windows() -> void:
	if not cleaned_windows:
		cleaned_windows = true
		GameState.add_money(25.0)
		btn_wash.text = "Camlar Silindi (+₺25)"
		EventBus.show_toast.emit(I18n.t("toast_tip") if I18n else "Cam Temizliği: +₺25 Bahşiş!", true)

func _start_pumping() -> void:
	if is_pumping or is_finished:
		return

	var available: float = GameState.tanks.get(current_car.fuel_type, 0.0)
	if available <= 0.5:
		EventBus.show_toast.emit("Depoda %s kalmadı! Önce tanker sipariş edin." % current_car.fuel_type.to_upper(), false)
		return

	is_pumping = true
	btn_start.disabled = true
	btn_start.text = "DOLUM YAPILIYOR..."
	current_car.start_refueling()

func _process(delta: float) -> void:
	if is_pumping and not is_finished:
		var price: float = GameState.sell_prices.get(current_car.fuel_type, 44.0)
		current_liters += 12.0 * delta # Pumping flow speed
		current_cost = current_liters * price

		if current_liters >= target_liters:
			current_liters = target_liters
			current_cost = current_liters * price
			is_pumping = false
			is_finished = true

			# Refuel from GameState
			var res: Dictionary = GameState.refuel_car(current_car.fuel_type, current_liters)
			current_cost = res["earned"]

			btn_start.visible = false
			btn_finish.visible = true
			btn_finish.text = "TAMAMLA & UĞURLA (+₺%d)" % int(current_cost)

		_update_lcd()

func _update_lcd() -> void:
	if label_liters:
		label_liters.text = "%.1f L" % current_liters
	if label_cost:
		label_cost.text = "₺ %.2f" % current_cost

func _finish_and_depart() -> void:
	if is_instance_valid(current_car):
		current_car.finish_refueling(current_cost)
	_close()
