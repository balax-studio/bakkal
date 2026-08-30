extends CanvasLayer

@onready var panel_root: Control = $Root
@onready var btn_close: Button = $Root/Card/VBox/Header/BtnClose

var order_amounts: Dictionary = {
	"benzin": 1000.0,
	"dizel": 1500.0,
	"lpg": 800.0
}

func _ready() -> void:
	EventBus.open_fuel_order_modal.connect(_open)
	EventBus.close_modals.connect(_close)

	btn_close.pressed.connect(_close)

	# Benzin controls
	$Root/Card/VBox/Rows/RowBenzin/BtnMinus.pressed.connect(func(): _change_qty("benzin", -250.0))
	$Root/Card/VBox/Rows/RowBenzin/BtnPlus.pressed.connect(func(): _change_qty("benzin", 250.0))
	$Root/Card/VBox/Rows/RowBenzin/BtnOrder.pressed.connect(func(): _order("benzin"))

	# Dizel controls
	$Root/Card/VBox/Rows/RowDizel/BtnMinus.pressed.connect(func(): _change_qty("dizel", -250.0))
	$Root/Card/VBox/Rows/RowDizel/BtnPlus.pressed.connect(func(): _change_qty("dizel", 250.0))
	$Root/Card/VBox/Rows/RowDizel/BtnOrder.pressed.connect(func(): _order("dizel"))

	# LPG controls
	$Root/Card/VBox/Rows/RowLpg/BtnMinus.pressed.connect(func(): _change_qty("lpg", -250.0))
	$Root/Card/VBox/Rows/RowLpg/BtnPlus.pressed.connect(func(): _change_qty("lpg", 250.0))
	$Root/Card/VBox/Rows/RowLpg/BtnOrder.pressed.connect(func(): _order("lpg"))

	panel_root.visible = false

func _open() -> void:
	panel_root.visible = true
	_refresh_ui()

func _close() -> void:
	panel_root.visible = false

func _change_qty(fuel: String, delta: float) -> void:
	order_amounts[fuel] = clamp(order_amounts[fuel] + delta, 250.0, 5000.0)
	_refresh_ui()

func _order(fuel: String) -> void:
	var amt: float = order_amounts[fuel]
	if GameState.order_tanker(fuel, amt):
		_refresh_ui()

func _refresh_ui() -> void:
	for fuel in ["benzin", "dizel", "lpg"]:
		var amt: float = order_amounts[fuel]
		var cost: float = amt * GameState.buy_costs[fuel]
		var cur: float = GameState.tanks[fuel]
		var cap: float = GameState.capacities[fuel]

		var row_node: Node = $Root/Card/VBox/Rows.get_node("Row" + fuel.capitalize())
		if row_node:
			row_node.get_node("LabelTank").text = "Depo: %d / %d L" % [int(cur), int(cap)]
			row_node.get_node("LabelQty").text = "%d L" % int(amt)
			row_node.get_node("BtnOrder").text = "Sipariş: ₺%d" % int(cost)
