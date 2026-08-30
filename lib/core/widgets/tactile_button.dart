import 'package:flutter/material.dart';
import '../audio/haptic_feedback.dart';
import '../theme/station_theme.dart';

class TactileButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  final Color backgroundColor;
  final Color borderColor;
  final Color textColor;
  final double radius;
  final EdgeInsetsGeometry padding;
  final double minWidth;
  final double minHeight;
  final bool isPrimary;
  final bool isGood;
  final bool isWarn;
  final bool isDanger;
  final bool isPill;
  final bool compact;

  const TactileButton({
    super.key,
    required this.child,
    this.onPressed,
    this.backgroundColor = StationTheme.paper,
    this.borderColor = StationTheme.ink,
    this.textColor = StationTheme.ink,
    this.radius = StationTheme.rMd,
    this.padding = const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    this.minWidth = 0,
    this.minHeight = 44,
    this.isPrimary = false,
    this.isGood = false,
    this.isWarn = false,
    this.isDanger = false,
    this.isPill = false,
    this.compact = false,
  });

  @override
  State<TactileButton> createState() => _TactileButtonState();
}

class _TactileButtonState extends State<TactileButton> {
  bool _isPressed = false;

  Color get _bg {
    if (widget.isPrimary || widget.isDanger) return StationTheme.red;
    if (widget.isGood) return StationTheme.green;
    if (widget.isWarn) return StationTheme.orange;
    return widget.backgroundColor;
  }

  Color get _fg {
    if (widget.isPrimary || widget.isGood || widget.isWarn || widget.isDanger) {
      return Colors.white;
    }
    return widget.textColor;
  }

  @override
  Widget build(BuildContext context) {
    final bool disabled = widget.onPressed == null;
    final double offset = _isPressed ? 0.0 : (widget.compact ? 2.5 : 3.5);

    return GestureDetector(
      onTapDown: disabled
          ? null
          : (_) {
              setState(() => _isPressed = true);
              StationHaptics.light();
            },
      onTapUp: disabled
          ? null
          : (_) {
              setState(() => _isPressed = false);
              widget.onPressed?.call();
            },
      onTapCancel: disabled
          ? null
          : () {
              setState(() => _isPressed = false);
            },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 50),
        margin: EdgeInsets.only(
          left: _isPressed ? offset : 0.0,
          top: _isPressed ? offset : 0.0,
          right: _isPressed ? 0.0 : offset,
          bottom: _isPressed ? 0.0 : offset,
        ),
        constraints: BoxConstraints(
          minWidth: widget.minWidth,
          minHeight: widget.compact ? 36 : widget.minHeight,
        ),
        decoration: BoxDecoration(
          color: _bg,
          borderRadius: BorderRadius.circular(
            widget.isPill ? 99.0 : widget.radius,
          ),
          border: Border.all(
            color: widget.borderColor,
            width: widget.compact ? 2.0 : 2.5,
          ),
          boxShadow: disabled || _isPressed
              ? null
              : [
                  BoxShadow(
                    color: widget.borderColor,
                    offset: Offset(offset, offset),
                    blurRadius: 0,
                  ),
                ],
        ),
        padding: widget.compact
            ? const EdgeInsets.symmetric(horizontal: 10, vertical: 6)
            : widget.padding,
        child: Opacity(
          opacity: disabled ? 0.45 : 1.0,
          child: DefaultTextStyle(
            style: StationTheme.font(
              fontSize: widget.compact ? 12 : 14,
              fontWeight: FontWeight.w800,
              color: _fg,
            ),
            child: IconTheme(
              data: IconThemeData(
                color: _fg,
                size: widget.compact ? 15 : 18,
              ),
              child: Center(
                widthFactor: 1.0,
                heightFactor: 1.0,
                child: widget.child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
