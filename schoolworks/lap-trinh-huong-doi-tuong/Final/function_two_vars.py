from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
GREEN = "#2ecc71"
RED = "#da3633"


class FunctionMappingScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        
        # Góc nhìn phối cảnh 3D
        self.set_camera_orientation(phi=65 * DEGREES, theta=-55 * DEGREES)

        # 1. Hệ trục tọa độ 3D
        axes = ThreeDAxes(
            x_range=[-2.5, 2.5, 1],
            y_range=[-2.5, 2.5, 1],
            z_range=[-0.5, 3.5, 1],
            x_length=3.8,
            y_length=3.8,
            z_length=2.8
        ).shift(DOWN * 0.4)

        x_lab = axes.get_x_axis_label(Tex("x", font_size=20), edge=RIGHT, direction=RIGHT)
        y_lab = axes.get_y_axis_label(Tex("y", font_size=20), edge=UP, direction=UP)
        z_lab = axes.get_z_axis_label(Tex("z", font_size=20), edge=OUT, direction=OUT)

        # 2. Miền xác định D (Domain D trên mặt phẳng xy)
        domain_d = Polygon(
            axes.c2p(-1.5, -1.5, 0),
            axes.c2p(1.5, -1.5, 0),
            axes.c2p(1.5, 1.5, 0),
            axes.c2p(-1.5, 1.5, 0),
            fill_color=GREEN,
            fill_opacity=0.25,
            stroke_color=GREEN,
            stroke_width=2
        )
        d_label = MathTex("D \\subseteq \\mathbb{R}^2", font_size=22, color=GREEN).move_to(
            axes.c2p(1.1, -1.1, 0.05)
        )

        # 3. Mặt cong z = f(x, y) = 2.4 - 0.4*(x^2 + y^2)
        def func(u, v):
            return 2.5 - 0.45 * (u**2 + v**2)

        surface = Surface(
            lambda u, v: axes.c2p(u, v, func(u, v)),
            u_range=[-1.5, 1.5],
            v_range=[-1.5, 1.5],
            resolution=(18, 18),
            fill_color=CYAN,
            fill_opacity=0.55,
            stroke_color=WHITE,
            stroke_width=0.5
        )

        # 4. Dynamic Mapping: Tracker cho điểm (x, y)
        t_val = ValueTracker(0.0)

        # Điểm input (x, y) di chuyển trong miền D
        input_dot = always_redraw(lambda: Dot3D(
            point=axes.c2p(
                0.8 * np.cos(t_val.get_value()),
                0.8 * np.sin(t_val.get_value()),
                0
            ),
            radius=0.06,
            color=GOLD
        ))

        # Điểm output (x, y, z) trên mặt cong
        surface_dot = always_redraw(lambda: Dot3D(
            point=axes.c2p(
                0.8 * np.cos(t_val.get_value()),
                0.8 * np.sin(t_val.get_value()),
                func(0.8 * np.cos(t_val.get_value()), 0.8 * np.sin(t_val.get_value()))
            ),
            radius=0.06,
            color=RED
        ))

        # Đường gióng độ cao (mapping arrow/dashed line)
        projection_line = always_redraw(lambda: DashedLine(
            start=input_dot.get_center(),
            end=surface_dot.get_center(),
            color=GOLD,
            stroke_width=2.5,
            dash_length=0.08
        ))

        # Render tuần tự
        self.play(Create(axes), Write(x_lab), Write(y_lab), Write(z_lab), run_time=1)
        self.play(FadeIn(domain_d), Write(d_label), run_time=0.8)
        self.play(Create(surface), run_time=1.2)
        self.play(FadeIn(input_dot), FadeIn(surface_dot), Create(projection_line), run_time=0.8)

        # Quay nhẹ camera kết hợp di chuyển điểm input để thể hiện phép ánh xạ liên tục
        self.begin_ambient_camera_rotation(rate=0.25)
        self.play(t_val.animate.set_value(2 * PI), run_time=4.5, rate_func=linear)
        self.stop_ambient_camera_rotation()

        self.wait(0.5)
