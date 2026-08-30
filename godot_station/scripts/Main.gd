extends Node3D

@onready var world_env: WorldEnvironment = $WorldEnvironment
@onready var dir_light: DirectionalLight3D = $DirectionalLight3D
@onready var camera: Camera3D = $Camera3D

func _ready() -> void:
	EventBus.time_updated.connect(_on_time_updated)
	_update_lighting(GameState.hour)

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
