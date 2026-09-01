extends Node3D

@export var car_scene: PackedScene = preload("res://scenes/Car.tscn")
@export var spawn_interval: float = 3.5

var _timer: float = 0.0
var pump_nodes: Array[Node] = []

# Slot positions relative to station
# Pump 1: (-3.5, 0, 0), Pump 2: (3.5, 0, 0), Pump 3: (-3.5, 0, 5), Pump 4: (3.5, 0, 5)
var pump_positions: Array[Vector3] = [
	Vector3(-3.5, 0, 0),
	Vector3(3.5, 0, 0),
	Vector3(-3.5, 0, 5),
	Vector3(3.5, 0, 5)
]

var car_colors: Array[Color] = [
	Color(0.37, 0.55, 0.72), # Pastel Vintage Blue
	Color(0.83, 0.42, 0.37), # Pastel Terracotta Coral
	Color(0.44, 0.65, 0.49), # Pastel Sage Green
	Color(0.92, 0.87, 0.73), # Cream Vanilla
	Color(0.86, 0.49, 0.20), # Warm Apricot
	Color(0.29, 0.35, 0.41), # Slate Navy
	Color(0.79, 0.46, 0.54)  # Dusty Rose
]

var vehicle_types: Array[Dictionary] = [
	{"name": "Sedan", "fuels": ["benzin", "dizel", "lpg"], "min": 30.0, "max": 50.0},
	{"name": "Hatchback", "fuels": ["benzin", "lpg"], "min": 25.0, "max": 40.0},
	{"name": "SUV", "fuels": ["dizel", "benzin"], "min": 45.0, "max": 75.0},
	{"name": "Ticari Van", "fuels": ["dizel"], "min": 50.0, "max": 80.0},
	{"name": "Elektrikli Sedan", "fuels": ["elektrik"], "min": 20.0, "max": 45.0}
]

func _ready() -> void:
	# Find pumps in parent
	call_deferred("_find_pumps")

func _find_pumps() -> void:
	var pumps_root: Node = get_node_or_null("../Pumps")
	if pumps_root:
		for child in pumps_root.get_children():
			pump_nodes.append(child)

func _process(delta: float) -> void:
	_timer += delta
	if _timer >= spawn_interval:
		_timer = 0.0
		_try_spawn_car()

func _try_spawn_car() -> void:
	var active_pumps_count: int = GameState.pumps_count
	var free_pump_idx: int = -1

	# Find first unoccupied active pump
	for i in range(active_pumps_count):
		if i < pump_nodes.size():
			var p: Node = pump_nodes[i]
			if not p.is_occupied:
				free_pump_idx = i
				break

	if free_pump_idx == -1:
		return # All pumps full

	var assigned_pump: Node = pump_nodes[free_pump_idx]
	var pump_slot_pos: Vector3 = pump_positions[free_pump_idx]

	var car: Node3D = car_scene.instantiate()
	var v_type: Dictionary = vehicle_types.pick_random()

	# If EV chosen but no charger built, pick normal vehicle
	if v_type["fuels"].has("elektrik") and not GameState.has_ev_charger:
		v_type = vehicle_types[0]

	car.vehicle_name = v_type["name"]
	car.fuel_type = v_type["fuels"].pick_random()
	car.demanded_units = randf_range(v_type["min"], v_type["max"])
	car.car_color = car_colors.pick_random()
	car.assigned_pump_node = assigned_pump

	# Route: Main Road Spawn -> Curved Forecourt Turn -> Pump bay alignment -> Pump slot
	var spawn_pos: Vector3 = Vector3(-45, 0, 14)
	var wp1: Vector3 = Vector3(pump_slot_pos.x - 7.0, 0, 14.0)
	var wp2: Vector3 = Vector3(pump_slot_pos.x - 3.5, 0, 11.5)
	var wp3: Vector3 = Vector3(pump_slot_pos.x - 1.0, 0, pump_slot_pos.z + 2.8)
	var final_pump_pos: Vector3 = pump_slot_pos + Vector3(0, 0, -1.8)

	car.global_position = spawn_pos
	car.waypoints = [wp1, wp2, wp3, final_pump_pos]

	get_parent().add_child(car)
