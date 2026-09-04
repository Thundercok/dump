from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
WHITE_COLOR = "#ffffff"


class SurfaceLevelCurvesScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        self.set_camera_orientation(phi=70 * DEGREES, theta=-50 * DEGREES)

        # 1. Hệ trục tọa độ 3D
        axes = ThreeDAxes(
            x_range=[-2.5, 2.5, 1],
            y_range=[-2.5, 2.5, 1],
            z_range=[-0.5, 3.2, 1],
            x_length=3.8,
            y_length=3.8,
            z_length=3.0
        ).shift(DOWN * 0.5)

        x_lbl = axes.get_x_axis_label(Tex("x", font_size=18), edge=RIGHT)
        y_lbl = axes.get_y_axis_label(Tex("y", font_size=18), edge=UP)
        z_lbl = axes.get_z_axis_label(Tex("z", font_size=18), edge=OUT)

        # 2. Mặt cong Paraboloid z = 0.55 * (x^2 + y^2)
        surface = Surface(
            lambda u, v: axes.c2p(
                u * np.cos(v),
                u * np.sin(v),
                0.55 * (u**2)
            ),
            u_range=[0, 2.1],
            v_range=[0, 2 * PI],
            resolution=(20, 20),
            fill_color=CYAN,
            fill_opacity=0.45,
            stroke_color=WHITE_COLOR,
            stroke_width=0.4
        )

        # 3. Dynamic ValueTracker cho độ cao mặt phẳng z0
        z0_val = ValueTracker(1.2)

        # Mặt phẳng ngang z = z0 (Horizontal plane)
        slicing_plane = always_redraw(lambda: Surface(
            lambda u, v: axes.c2p(u, v, z0_val.get_value()),
            u_range=[-2.1, 2.1],
            v_range=[-2.1, 2.1],
            resolution=(10, 10),
            fill_color=GOLD,
            fill_opacity=0.22,
            stroke_color=GOLD,
            stroke_width=1.2
        ))

        # Đường giao tuyến (Level Curve z0 = f(x, y) -> Bán kính r = sqrt(z0 / 0.55))
        level_curve = always_redraw(lambda: ParametricFunction(
            lambda t: axes.c2p(
                np.sqrt(max(0.01, z0_val.get_value() / 0.55)) * np.cos(t),
                np.sqrt(max(0.01, z0_val.get_value() / 0.55)) * np.sin(t),
                z0_val.get_value()
            ),
            t_range=[0, 2 * PI],
            color=RED,
            stroke_width=4
        ))

        # 4. Hiển thị UI giá trị z0 trên góc màn hình
        z0_label = always_redraw(lambda: MathTex(
            f"z = z_0 = {z0_val.get_value():.2f}",
            font_size=24,
            color=GOLD
        ).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2))
        self.add_fixed_in_frame_mobjects(z0_label)

        # Render cảnh
        self.play(Create(axes), Write(x_lbl), Write(y_lbl), Write(z_lbl), run_time=0.8)
        self.play(Create(surface), run_time=1.2)
        self.play(FadeIn(slicing_plane), Create(level_curve), Write(z0_label), run_time=1.0)

        # Quay camera nhẹ nhàng kết hợp thay đổi mặt cắt z0
        self.begin_ambient_camera_rotation(rate=0.25)
        self.play(z0_val.animate.set_value(2.3), run_time=2.2, rate_func=smooth)
        self.play(z0_val.animate.set_value(0.4), run_time=2.2, rate_func=smooth)
        self.play(z0_val.animate.set_value(1.2), run_time=1.5, rate_func=smooth)
        self.stop_ambient_camera_rotation()
        self.wait(0.5)
