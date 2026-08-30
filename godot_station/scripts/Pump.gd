extends Node3D

@export var pump_index: int = 1
var is_occupied: bool = false
var current_car: Node = null

@onready var label_num: Label3D = $LabelNum
@onready var label_status: Label3D = $LabelStatus

func _ready() -> void:
	if label_num:
		label_num.text = "P-%d" % pump_index
	update_status_display()

func update_status_display() -> void:
	if not label_status:
		return
	if is_occupied:
		label_status.text = "DOLU"
		label_status.modulate = Color(1.0, 0.3, 0.3)
	else:
		label_status.text = "BOŞ"
		label_status.modulate = Color(0.3, 1.0, 0.5)

func _on_area_3d_input_event(_camera: Camera3D, event: InputEvent, _position: Vector3, _normal: Vector3, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if is_occupied and is_instance_valid(current_car):
			EventBus.open_service_panel.emit(current_car)
		else:
			EventBus.show_toast.emit("Pompa %d: Araç bekleniyor..." % pump_index, true)
