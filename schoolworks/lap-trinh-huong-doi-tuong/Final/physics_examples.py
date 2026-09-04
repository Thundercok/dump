from manim import *

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
GREEN = "#2ecc71"


class KineticEnergyScene(Scene):
    def construct(self):
        self.camera.background_color = BG_COLOR

        # 1. Trackers cho m (khối lượng) và v (vận tốc)
        m_val = ValueTracker(2.0)
        v_val = ValueTracker(1.5)

        # 2. Vật thể chuyển động (khối hộp) có kích thước tỉ lệ với m
        box = always_redraw(lambda: Square(
            side_length=0.4 + 0.25 * m_val.get_value(),
            fill_color=CYAN,
            fill_opacity=0.8,
            stroke_color=WHITE,
            stroke_width=2
        ).move_to(LEFT * 1.8 + DOWN * 0.8))

        # Đường ray chuyển động
        track = Line(LEFT * 2.8, RIGHT * 2.8, color=GRAY).shift(DOWN * (0.8 + 0.45))

        # Vector vận tốc v gắn trên vật
        v_arrow = always_redraw(lambda: Arrow(
            start=box.get_center(),
            end=box.get_center() + RIGHT * (0.5 * v_val.get_value()),
            color=GREEN,
            buff=0,
            stroke_width=4,
            max_tip_length_to_length_ratio=0.3
        ))

        # 3. Đồng hồ đo năng lượng (Dynamic Bar)
        # E_k = 0.5 * m * v^2
        energy_bar_bg = Rectangle(width=0.45, height=2.6, stroke_color=GRAY, stroke_width=1.5).move_to(RIGHT * 2.0 + UP * 0.2)
        
        energy_bar = always_redraw(lambda: Rectangle(
            width=0.41,
            height=max(0.01, min(2.55, 0.5 * m_val.get_value() * (v_val.get_value()**2) * 0.08)),
            fill_color=GOLD,
            fill_opacity=0.9,
            stroke_width=0
        ).align_to(energy_bar_bg, DOWN))

        # 4. Nhãn thông số thời gian thực (Lưu ý: double brace {{ J }} trong f-string)
        m_label = always_redraw(lambda: MathTex(
            f"m = {m_val.get_value():.1f}", font_size=24, color=WHITE
        ).next_to(box, UP, buff=0.15))

        v_label = always_redraw(lambda: MathTex(
            f"v = {v_val.get_value():.1f}", font_size=24, color=GREEN
        ).next_to(v_arrow, UP, buff=0.1))

        ek_label = always_redraw(lambda: MathTex(
            f"E_k = {0.5 * m_val.get_value() * (v_val.get_value()**2):.1f}\\text{{ J}}",
            font_size=26,
            color=GOLD
        ).next_to(energy_bar_bg, UP, buff=0.2))

        # Render cảnh
        self.play(Create(track), Create(box), Create(v_arrow), Write(m_label), Write(v_label), run_time=1)
        self.play(Create(energy_bar_bg), FadeIn(energy_bar), Write(ek_label), run_time=0.8)
        self.wait(0.5)

        # Biến thiên v (bậc 2 - tăng nhanh năng lượng)
        self.play(v_val.animate.set_value(3.8), run_time=1.8, rate_func=smooth)
        self.wait(0.3)

        # Biến thiên m (tuyến tính)
        self.play(m_val.animate.set_value(4.0), run_time=1.5, rate_func=smooth)
        self.wait(0.5)

        # Trả về trạng thái ban đầu để tạo loop
        self.play(
            v_val.animate.set_value(1.5),
            m_val.animate.set_value(2.0),
            run_time=1.2,
            rate_func=smooth
        )
        self.wait(0.5)
