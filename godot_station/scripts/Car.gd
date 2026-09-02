extends Node3D

enum State { ENTERING, AT_PUMP, REFUELING, LEAVING }

var state: State = State.ENTERING
var fuel_type: String = "benzin"
var demanded_units: float = 40.0
var car_color: Color = Color(0.85, 0.25, 0.25)
var vehicle_name: String = "Sedan"

var assigned_pump_node: Node = null
var waypoints: Array[Vector3] = []
var current_wp: int = 0
var speed: float = 4.2 # Slower, realistic tycoon pacing

@onready var label_order: Label3D = $LabelOrder
@onready var body_mesh: CSGBox3D = $Body

func _ready() -> void:
	add_to_group("cars")
	if body_mesh:
		var mat: StandardMaterial3D = StandardMaterial3D.new()
		mat.albedo_color = car_color
		mat.roughness = 1.0
		mat.specular_mode = BaseMaterial3D.SPECULAR_DISABLED
		body_mesh.material = mat

	update_order_label()

func update_order_label() -> void:
	var fuel_name: String = I18n.t(fuel_type).to_upper() if I18n else fuel_type.to_upper()
	label_order.text = "[%s]\n%d L" % [fuel_name, int(demanded_units)]
	if state == State.REFUELING:
		label_order.text = "DOLUYOR...\n[%s]" % fuel_name
	elif state == State.LEAVING:
		label_order.text = "OK! +TL"
		label_order.modulate = Color(0.3, 1.0, 0.5)

var stall_time: float = 0.0

func _get_forward_obstacle_distance() -> float:
	var min_dist: float = 999.0
	var all_cars: Array[Node] = get_tree().get_nodes_in_group("cars")
	for other in all_cars:
		if other == self or not is_instance_valid(other):
			continue
		var to_other: Vector3 = (other.global_position - global_position)
		to_other.y = 0
		var d: float = to_other.length()
		if current_wp < waypoints.size():
			var to_wp: Vector3 = (waypoints[current_wp] - global_position)
			to_wp.y = 0
			if to_wp.dot(to_other) > 0.1 and d < 4.2 and d < min_dist:
				min_dist = d
	return min_dist

func _process(delta: float) -> void:
	if state == State.ENTERING or state == State.LEAVING:
		if current_wp < waypoints.size():
			var target: Vector3 = waypoints[current_wp]
			var dir: Vector3 = (target - global_position)
			dir.y = 0 # Keep horizontal
			var dist: float = dir.length()

			if dist > 0.15:
				var move_dir: Vector3 = dir.normalized()
				var current_speed: float = speed
				if state == State.ENTERING and current_wp == waypoints.size() - 1:
					current_speed = maxf(1.0, speed * clampf(dist / 2.2, 0.2, 1.0))
				elif state == State.LEAVING:
					current_speed = speed * 1.15

				# Safe Distance & Anti-Deadlock Stall Safeguard
				var ahead_dist: float = _get_forward_obstacle_distance()
				var obstacle_mult: float = 1.0
				if ahead_dist < 2.2:
					stall_time += delta
					obstacle_mult = 0.35 if stall_time > 1.8 else 0.0
				elif ahead_dist < 4.2:
					stall_time = 0.0
					obstacle_mult = (ahead_dist - 2.2) / 2.0
				else:
					stall_time = 0.0

				current_speed *= obstacle_mult

				if current_speed > 0.01:
					global_position += move_dir * current_speed * delta
				# Smooth face rotation using shortest angle
				var target_rot_y: float = atan2(move_dir.x, move_dir.z)
				rotation.y = lerp_angle(rotation.y, target_rot_y, 8.5 * delta)
			else:
				current_wp += 1
				if current_wp >= waypoints.size():
					if state == State.ENTERING:
						_arrive_at_pump()
					elif state == State.LEAVING:
						_depart_station()

func _arrive_at_pump() -> void:
	state = State.AT_PUMP
	rotation.y = PI / 2.0 # Exact parallel side-docking facing +X alongside pump
	if is_instance_valid(assigned_pump_node):
		assigned_pump_node.is_occupied = true
		assigned_pump_node.current_car = self
		assigned_pump_node.update_status_display()

	EventBus.open_service_panel.emit(self)
	EventBus.show_toast.emit("%s pompaya yanaştı (%s)!" % [vehicle_name, fuel_type.to_upper()], true)

func start_refueling() -> void:
	state = State.REFUELING
	update_order_label()

func finish_refueling(earned_money: float) -> void:
	state = State.LEAVING
	update_order_label()

	if is_instance_valid(assigned_pump_node):
		assigned_pump_node.is_occupied = false
		assigned_pump_node.current_car = null
		assigned_pump_node.update_status_display()

	var is_front_row: bool = global_position.z >= 2.5
	if is_front_row:
		waypoints = [
			Vector3(global_position.x + 2.5, 0, 5.2),
			Vector3(8.5, 0, 5.2),
			Vector3(11.5, 0, 7.2),
			Vector3(14.5, 0, 9.2),
			Vector3(56.0, 0, 9.8)
		]
	else:
		waypoints = [
			Vector3(global_position.x + 2.5, 0, 0.0),
			Vector3(7.8, 0, 0.0),
			Vector3(9.8, 0, 3.2),
			Vector3(12.0, 0, 7.2),
			Vector3(14.8, 0, 9.2),
			Vector3(56.0, 0, 9.8)
		]
	current_wp = 0

func _depart_station() -> void:
	queue_free()

func _on_area_3d_input_event(_camera: Camera3D, event: InputEvent, _position: Vector3, _normal: Vector3, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if state == State.AT_PUMP or state == State.REFUELING:
			EventBus.open_service_panel.emit(self)
