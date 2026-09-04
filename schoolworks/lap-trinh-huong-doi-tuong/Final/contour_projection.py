from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
GREEN = "#2ecc71"


class ContourProjectionScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        # Góc nhìn phối cảnh 3D nhìn nghiêng từ trên xuống
        self.set_camera_orientation(phi=65 * DEGREES, theta=-45 * DEGREES)

        # 1. Hệ trục tọa độ 3D
        axes = ThreeDAxes(
            x_range=[-2.2, 2.2, 1],
            y_range=[-2.2, 2.2, 1],
            z_range=[0, 3.2, 1],
            x_length=3.6,
            y_length=3.6,
            z_length=2.8
        ).shift(DOWN * 0.6)

        x_lbl = axes.get_x_axis_label(Tex("x", font_size=18), edge=RIGHT)
        y_lbl = axes.get_y_axis_label(Tex("y", font_size=18), edge=UP)
        z_lbl = axes.get_z_axis_label(Tex("z", font_size=18), edge=OUT)

        # 2. Mặt cong Paraboloid z = f(x, y) = 0.5 * (x^2 + y^2)
        surface = Surface(
            lambda u, v: axes.c2p(
                u * np.cos(v),
                u * np.sin(v),
                0.5 * (u**2)
            ),
            u_range=[0, 2.2],
            v_range=[0, 2 * PI],
            resolution=(18, 18),
            fill_color=CYAN,
            fill_opacity=0.35,
            stroke_color=WHITE,
            stroke_width=0.3
        )

        self.play(Create(axes), Write(x_lbl), Write(y_lbl), Write(z_lbl), run_time=0.8)
        self.play(Create(surface), run_time=1.0)

        # 3. Tạo 3 lớp đường mức cắt ở các độ cao z0 = 0.6, 1.4, 2.2
        z_levels = [0.6, 1.4, 2.2]
        colors = [GREEN, GOLD, RED]
        
        slices_3d = VGroup()
        projections_2d = VGroup()

        for z0, col in zip(z_levels, colors):
            r = np.sqrt(z0 / 0.5)
            # Đường cong 3D trên mặt
            c3d = ParametricFunction(
                lambda t, r_val=r, z_val=z0: axes.c2p(r_val * np.cos(t), r_val * np.sin(t), z_val),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=3.5
            )
            # Hình chiếu đường cong xuống mặt phẳng Oxy (z = 0)
            c2d = ParametricFunction(
                lambda t, r_val=r: axes.c2p(r_val * np.cos(t), r_val * np.sin(t), 0),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=2.5
            )
            slices_3d.add(c3d)
            projections_2d.add(c2d)

        # Tạo hiệu ứng cắt từng tầng và chiếu thẳng xuống đáy Oxy
        for c3d, c2d in zip(slices_3d, projections_2d):
            self.play(Create(c3d), run_time=0.6)
            self.play(TransformFromCopy(c3d, c2d), run_time=0.8)

        # 4. Hiệu ứng xoay camera để thấy rõ tầng 3D và bản đồ đường mức 2D bên dưới
        self.begin_ambient_camera_rotation(rate=0.3)
        self.wait(3.5)
        self.stop_ambient_camera_rotation()

        # Reset mượt mà để lặp
        self.play(
            FadeOut(slices_3d),
            FadeOut(projections_2d),
            run_time=0.8
        )
        self.wait(0.3)
