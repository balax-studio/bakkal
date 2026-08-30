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
var speed: float = 9.0

@onready var label_order: Label3D = $LabelOrder
@onready var body_mesh: CSGBox3D = $Body

func _ready() -> void:
	if body_mesh:
		var mat: StandardMaterial3D = StandardMaterial3D.new()
		mat.albedo_color = car_color
		mat.roughness = 1.0
		mat.specular_mode = BaseMaterial3D.SPECULAR_DISABLED
		body_mesh.material = mat

	update_order_label()

func update_order_label() -> void:
	if not label_order:
		return
	var icon: String = "⛽"
	if fuel_type == "dizel":
		icon = "🛢️"
	elif fuel_type == "lpg":
		icon = "🔥"
	elif fuel_type == "elektrik":
		icon = "⚡"

	label_order.text = "%s %s\n%d L" % [icon, fuel_type.to_upper(), int(demanded_units)]
	if state == State.REFUELING:
		label_order.text = "DOLUYOR...\n%s" % icon
	elif state == State.LEAVING:
		label_order.text = "✓ TEŞEKKÜRLER!"
		label_order.modulate = Color(0.3, 1.0, 0.5)

func _process(delta: float) -> void:
	if state == State.ENTERING or state == State.LEAVING:
		if current_wp < waypoints.size():
			var target: Vector3 = waypoints[current_wp]
			var dir: Vector3 = (target - global_position)
			dir.y = 0 # Keep horizontal
			var dist: float = dir.length()

			if dist > 0.2:
				var move_dir: Vector3 = dir.normalized()
				global_position += move_dir * speed * delta
				# Smooth face rotation
				var target_rot_y: float = atan2(move_dir.x, move_dir.z)
				rotation.y = lerp_angle(rotation.y, target_rot_y, 12.0 * delta)
			else:
				current_wp += 1
				if current_wp >= waypoints.size():
					if state == State.ENTERING:
						_arrive_at_pump()
					elif state == State.LEAVING:
						_depart_station()

func _arrive_at_pump() -> void:
	state = State.AT_PUMP
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

	# Generate exit waypoints to main road
	waypoints = [
		global_position + Vector3(0, 0, 8),
		Vector3(28, 0, 14),
		Vector3(50, 0, 14)
	]
	current_wp = 0

func _depart_station() -> void:
	queue_free()

func _on_area_3d_input_event(_camera: Camera3D, event: InputEvent, _position: Vector3, _normal: Vector3, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if state == State.AT_PUMP or state == State.REFUELING:
			EventBus.open_service_panel.emit(self)
