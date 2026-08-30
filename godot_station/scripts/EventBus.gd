extends Node

## EventBus: Global signal bus for decoupling systems across Godot scenes

signal money_changed(new_money: float, delta: float)
signal time_updated(hour: int, minute: int, day: int)
signal tank_updated(fuel_type: String, current: float, capacity: float)
signal reputation_changed(new_rep: float)

signal open_service_panel(car_node: Node)
signal close_service_panel()

signal open_construction_modal()
signal open_fuel_order_modal()
signal open_office_modal()
signal close_modals()

signal vehicle_refueled(fuel_type: String, liters: float, total_cost: float)
signal station_upgraded(upgrade_name: String)
signal tanker_arrived(fuel_type: String, amount: float)
signal show_toast(message: String, is_success: bool)
