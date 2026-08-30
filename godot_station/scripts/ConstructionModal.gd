extends CanvasLayer

@onready var panel_root: Control = $Root
@onready var btn_close: Button = $Root/Card/VBox/Header/BtnClose
@onready var btn_pumps: Button = $Root/Card/VBox/UpgradesList/CardPumps/BtnBuy
@onready var btn_wash: Button = $Root/Card/VBox/UpgradesList/CardWash/BtnBuy
@onready var btn_solar: Button = $Root/Card/VBox/UpgradesList/CardSolar/BtnBuy
@onready var btn_ev: Button = $Root/Card/VBox/UpgradesList/CardEv/BtnBuy
@onready var btn_manager: Button = $Root/Card/VBox/UpgradesList/CardManager/BtnBuy

func _ready() -> void:
	EventBus.open_construction_modal.connect(_open)
	EventBus.close_modals.connect(_close)

	btn_close.pressed.connect(_close)
	btn_pumps.pressed.connect(func(): if GameState.upgrade_pumps(): _refresh_ui())
	btn_wash.pressed.connect(func(): if GameState.build_car_wash(): _refresh_ui())
	btn_solar.pressed.connect(func(): if GameState.build_solar_panels(): _refresh_ui())
	btn_ev.pressed.connect(func(): if GameState.build_ev_charger(): _refresh_ui())
	btn_manager.pressed.connect(func(): if GameState.hire_manager(): _refresh_ui())

	panel_root.visible = false

func _open() -> void:
	panel_root.visible = true
	_refresh_ui()

func _close() -> void:
	panel_root.visible = false

func _refresh_ui() -> void:
	if GameState.pumps_count >= 4:
		btn_pumps.text = "MAKS SEVİYE (4)"
		btn_pumps.disabled = true
	else:
		btn_pumps.text = "₺%d" % int(6000.0 * GameState.pumps_count)
		btn_pumps.disabled = false

	if GameState.has_car_wash:
		btn_wash.text = "KURULDU ✓"
		btn_wash.disabled = true
	else:
		btn_wash.text = "₺12.000"
		btn_wash.disabled = false

	if GameState.has_solar_panels:
		btn_solar.text = "KURULDU ✓"
		btn_solar.disabled = true
	else:
		btn_solar.text = "₺8.500"
		btn_solar.disabled = false

	if GameState.has_ev_charger:
		btn_ev.text = "KURULDU ✓"
		btn_ev.disabled = true
	else:
		btn_ev.text = "₺10.000"
		btn_ev.disabled = false

	if GameState.has_manager:
		btn_manager.text = "GÖREVDE ✓"
		btn_manager.disabled = true
	else:
		btn_manager.text = "₺15.000"
		btn_manager.disabled = false
