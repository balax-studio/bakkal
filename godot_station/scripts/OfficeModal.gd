extends CanvasLayer

@onready var panel_root: Control = $Root
@onready var btn_close: Button = $Root/Card/VBox/Header/BtnClose
@onready var label_stats: Label = $Root/Card/VBox/StatsBox/LabelStats

func _ready() -> void:
	EventBus.open_office_modal.connect(_open)
	EventBus.close_modals.connect(_close)

	btn_close.pressed.connect(_close)

	# Setup +/- for prices
	for fuel in ["benzin", "dizel", "lpg", "elektrik"]:
		var row: Node = $Root/Card/VBox/PriceRows.get_node_or_null("Row" + fuel.capitalize())
		if row:
			row.get_node("BtnMinus").pressed.connect(func(): _adjust_price(fuel, -0.5))
			row.get_node("BtnPlus").pressed.connect(func(): _adjust_price(fuel, 0.5))

	panel_root.visible = false

func _open() -> void:
	panel_root.visible = true
	_refresh_ui()

func _close() -> void:
	panel_root.visible = false

func _adjust_price(fuel: String, delta: float) -> void:
	var cur: float = GameState.sell_prices[fuel]
	GameState.sell_prices[fuel] = max(10.0, cur + delta)
	_refresh_ui()

func _refresh_ui() -> void:
	if label_stats:
		label_stats.text = "Toplam Ciro: ₺%d   |   Hizmet Verilen: %d Araç   |   İtibar: ★ %.1f" % [
			int(GameState.total_revenue),
			GameState.total_customers_served,
			GameState.reputation
		]

	for fuel in ["benzin", "dizel", "lpg", "elektrik"]:
		var row: Node = $Root/Card/VBox/PriceRows.get_node_or_null("Row" + fuel.capitalize())
		if row:
			var price: float = GameState.sell_prices[fuel]
			var buy_cost: float = GameState.buy_costs[fuel]
			row.get_node("LabelPrice").text = "₺ %.2f" % price
			row.get_node("LabelCost").text = "(Maliyet: ₺%.2f)" % buy_cost
