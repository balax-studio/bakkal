extends Node3D

@onready var world_env: WorldEnvironment = $WorldEnvironment
@onready var dir_light: DirectionalLight3D = $DirectionalLight3D
@onready var camera: Camera3D = $Camera3D

var is_dragging: bool = false
var last_mouse_pos: Vector2 = Vector2.ZERO
var initial_cam_pos: Vector3 = Vector3(26, 24, 26)
var cam_speed: float = 25.0

func _ready() -> void:
	EventBus.time_updated.connect(_on_time_updated)
	EventBus.canopy_visibility_changed.connect(_on_canopy_visibility_changed)
	_on_canopy_visibility_changed(GameState.show_canopy)
	_update_lighting(GameState.hour)
	if camera:
		initial_cam_pos = camera.position

func _process(delta: float) -> void:
	_handle_keyboard_pan(delta)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT or event.button_index == MOUSE_BUTTON_RIGHT:
			if event.pressed:
				is_dragging = true
				last_mouse_pos = event.position
			else:
				is_dragging = false
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
			_zoom_camera(-1.5)
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			_zoom_camera(1.5)
	elif event is InputEventMouseMotion and is_dragging:
		var delta_m = event.position - last_mouse_pos
		last_mouse_pos = event.position
		_pan_camera_by_mouse(delta_m)
	elif event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_T:
			GameState.toggle_canopy_visibility()

func _pan_camera_by_mouse(delta_m: Vector2) -> void:
	if not camera:
		return
	var factor: float = 0.05
	var right: Vector3 = camera.global_transform.basis.x
	var up: Vector3 = camera.global_transform.basis.y
	right.y = 0.0
	up.y = 0.0
	right = right.normalized()
	up = up.normalized()
	var offset: Vector3 = (-right * delta_m.x + up * delta_m.y) * factor
	camera.position += offset
	_clamp_camera()

func _handle_keyboard_pan(delta: float) -> void:
	if not camera:
		return
	var forward: Vector3 = -camera.global_transform.basis.z
	var right: Vector3 = camera.global_transform.basis.x
	forward.y = 0.0
	right.y = 0.0
	forward = forward.normalized()
	right = right.normalized()

	var move_vec: Vector3 = Vector3.ZERO
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		move_vec += forward
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		move_vec -= forward
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		move_vec += right
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		move_vec -= right
	if Input.is_key_pressed(KEY_R) or Input.is_key_pressed(KEY_SPACE):
		camera.position = initial_cam_pos

	if move_vec.length_squared() > 0.0:
		camera.position += move_vec.normalized() * cam_speed * delta
		_clamp_camera()

func _zoom_camera(amount: float) -> void:
	if not camera:
		return
	if camera.projection == Camera3D.PROJECTION_ORTHOGONAL:
		camera.size = clampf(camera.size + amount, 8.0, 50.0)
	else:
		var forward: Vector3 = -camera.global_transform.basis.z
		camera.position += forward * (-amount)

func _clamp_camera() -> void:
	if not camera:
		return
	var max_pan: float = 45.0
	camera.position.x = clampf(camera.position.x, initial_cam_pos.x - max_pan, initial_cam_pos.x + max_pan)
	camera.position.z = clampf(camera.position.z, initial_cam_pos.z - max_pan, initial_cam_pos.z + max_pan)

func _on_time_updated(h: int, _m: int, _d: int) -> void:
	_update_lighting(h)

func _update_lighting(hour: int) -> void:
	var sky_color: Color = GameState.get_sky_color()
	if world_env and world_env.environment:
		world_env.environment.background_color = sky_color

	if dir_light:
		if hour >= 21 or hour < 5:
			dir_light.light_energy = 0.35
			dir_light.light_color = Color(0.4, 0.45, 0.7) # Moon tint
		elif hour >= 5 and hour < 8:
			dir_light.light_energy = 0.85
			dir_light.light_color = Color(1.0, 0.8, 0.65) # Warm dawn
		elif hour >= 8 and hour < 18:
			dir_light.light_energy = 1.15
			dir_light.light_color = Color(1.0, 0.98, 0.95) # Bright day
		else:
			dir_light.light_energy = 0.75
			dir_light.light_color = Color(1.0, 0.65, 0.45) # Dusk sunset

func _on_canopy_visibility_changed(is_vis: bool) -> void:
	var canopy: Node3D = get_node_or_null("Diorama/Canopy")
	if not canopy:
		return
	var tween: Tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	if is_vis:
		canopy.visible = true
		tween.tween_property(canopy, "scale:z", 1.0, 0.65)
		tween.tween_property(canopy, "position:z", 0.0, 0.65)
		tween.tween_property(canopy, "rotation_degrees:x", 0.0, 0.65)
	else:
		tween.tween_property(canopy, "scale:z", 0.04, 0.65)
		tween.tween_property(canopy, "position:z", -6.2, 0.65)
		tween.tween_property(canopy, "rotation_degrees:x", -20.0, 0.65)
		tween.chain().tween_callback(func(): if not GameState.show_canopy: canopy.visible = false)

