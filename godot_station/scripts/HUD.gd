extends CanvasLayer

@onready var label_money: Label = $TopBar/HBox/PanelMoney/HBox/LabelMoney
@onready var label_time: Label = $TopBar/HBox/PanelTime/LabelTime
@onready var label_rep: Label = $TopBar/HBox/PanelRep/LabelRep

@onready var bar_benzin: ProgressBar = $FuelRail/BenzinChip/Bar
@onready var label_benzin: Label = $FuelRail/BenzinChip/LabelVal

@onready var bar_dizel: ProgressBar = $FuelRail/DizelChip/Bar
@onready var label_dizel: Label = $FuelRail/DizelChip/LabelVal

@onready var bar_lpg: ProgressBar = $FuelRail/LpgChip/Bar
@onready var label_lpg: Label = $FuelRail/LpgChip/LabelVal

@onready var toast_panel: PanelContainer = $ToastPanel
@onready var label_toast: Label = $ToastPanel/LabelToast

@onready var fab_sub_menu: VBoxContainer = $BottomMenu/FabSubMenu
@onready var btn_fab: Button = $BottomMenu/BtnFab

var _toast_timer: float = 0.0

func _ready() -> void:
	EventBus.money_changed.connect(_on_money_changed)
	EventBus.time_updated.connect(_on_time_updated)
	EventBus.reputation_changed.connect(_on_rep_changed)
	EventBus.tank_updated.connect(_on_tank_updated)
	EventBus.show_toast.connect(_show_toast)

	btn_fab.pressed.connect(_toggle_fab_menu)
	$BottomMenu/FabSubMenu/BtnBuild.pressed.connect(func(): EventBus.open_construction_modal.emit())
	$BottomMenu/FabSubMenu/BtnOrder.pressed.connect(func(): EventBus.open_fuel_order_modal.emit())
	$BottomMenu/FabSubMenu/BtnOffice.pressed.connect(func(): EventBus.open_office_modal.emit())

	toast_panel.visible = false
	fab_sub_menu.visible = false

func _process(delta: float) -> void:
	if toast_panel.visible:
		_toast_timer -= delta
		if _toast_timer <= 0:
			toast_panel.visible = false

func _on_money_changed(new_money: float, _delta: float) -> void:
	if label_money:
		label_money.text = "₺ %d" % int(new_money)

func _on_time_updated(h: int, m: int, d: int) -> void:
	if label_time:
		label_time.text = "GÜN %d · %02d:%02d" % [d, h, m]

func _on_rep_changed(r: float) -> void:
	if label_rep:
		label_rep.text = "★ %.1f" % r

func _on_tank_updated(fuel: String, cur: float, cap: float) -> void:
	var ratio: float = (cur / cap) * 100.0
	if fuel == "benzin" and bar_benzin:
		bar_benzin.value = ratio
		label_benzin.text = "%d L" % int(cur)
	elif fuel == "dizel" and bar_dizel:
		bar_dizel.value = ratio
		label_dizel.text = "%d L" % int(cur)
	elif fuel == "lpg" and bar_lpg:
		bar_lpg.value = ratio
		label_lpg.text = "%d L" % int(cur)

func _toggle_fab_menu() -> void:
	fab_sub_menu.visible = not fab_sub_menu.visible

func _show_toast(msg: String, _is_success: bool) -> void:
	if label_toast:
		label_toast.text = msg
	toast_panel.visible = true
	_toast_timer = 2.5
