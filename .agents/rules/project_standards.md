# PixelOil 3D Core Standards

1. **No Emojis Policy**: Never use unicode emojis anywhere. Use brutalist 2px/2.5px inline SVGs.
2. **i18n Multi-Language (TR / EN)**: All user-facing strings must use a structured translation dictionary. Support dynamic language switching between Turkish and English.
3. **Dual Engine Synchronization**: Web 3D (`web_3d_station/`) and Godot 4 (`godot_station/`) must remain synchronized on all game features, balance parameters, diorama structure, and gameplay loops.
4. **Mobile Store Ready**: Adhere to Apple App Store and Google Play standards regarding touch targets (>=48px), safe areas, 60fps mobile optimization, and zero layout overflow.
5. **No Automated Playtesting (User Playtests Only)**: Never run browser subagents or automated clicking bots to play or interactively test the game. All gameplay testing is performed exclusively by the user. The agent only develops code, performs syntax verification, and synchronizes the dual engines.
