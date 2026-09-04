from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
ORANGE_COLOR = "#e67e22"
GREEN_COLOR = "#2ecc71"
TEAL_COLOR = "#1abc9c"
WHITE_COLOR = "#ffffff"


class TopDownLevelCurvesScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        
        # Góc nhìn phối cảnh 3D ban đầu
        self.set_camera_orientation(phi=68 * DEGREES, theta=-55 * DEGREES)

        # 1. Hệ trục tọa độ 3D
        axes = ThreeDAxes(
            x_range=[-2.5, 2.5, 1],
            y_range=[-2.5, 2.5, 1],
            z_range=[-0.5, 3.2, 1],
            x_length=3.8,
            y_length=3.8,
            z_length=2.8
        ).shift(DOWN * 0.4)

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
            resolution=(18, 18),
            fill_color=CYAN,
            fill_opacity=0.35,
            stroke_color=WHITE_COLOR,
            stroke_width=0.3
        )

        # 3. Các đường mức 3D tại các cao độ z = 0.5, 1.0, 1.5, 2.0
        z_levels = [0.5, 1.0, 1.5, 2.0]
        colors = [TEAL_COLOR, GREEN_COLOR, GOLD, RED]
        
        curves_3d = VGroup()
        curves_2d = VGroup()
        drop_lines = VGroup()

        for z_k, col in zip(z_levels, colors):
            r_k = np.sqrt(z_k / 0.55)
            # Đường cong tại cao độ z_k trên mặt cong
            c3d = ParametricFunction(
                lambda t, r=r_k, z=z_k: axes.c2p(r * np.cos(t), r * np.sin(t), z),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=3.5
            )
            curves_3d.add(c3d)

            # Đường cong hình chiếu rơi xuống mặt phẳng xy (z = 0)
            c2d = ParametricFunction(
                lambda t, r=r_k: axes.c2p(r * np.cos(t), r * np.sin(t), 0),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=3.5
            )
            curves_2d.add(c2d)

            # Các đường gióng thẳng đứng
            for angle in [0, PI/2, PI, 3*PI/2]:
                dl = DashedLine(
                    axes.c2p(r_k * np.cos(angle), r_k * np.sin(angle), z_k),
                    axes.c2p(r_k * np.cos(angle), r_k * np.sin(angle), 0),
                    color=col,
                    stroke_width=1.5,
                    dash_length=0.06
                )
                drop_lines.add(dl)

        # UI Header trạng thái
        view_label = Text("3D Perspective: Surface & Slices", font_size=18, color=WHITE).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)
        self.add_fixed_in_frame_mobjects(view_label)

        # Render cảnh 3D
        self.play(Create(axes), Write(x_lbl), Write(y_lbl), Write(z_lbl), Write(view_label), run_time=0.8)
        self.play(Create(surface), run_time=1.0)
        self.play(Create(curves_3d), run_time=1.2)
        self.wait(0.5)

        # Chiếu xuống mặt phẳng xy
        self.play(
            Create(drop_lines),
            FadeIn(curves_2d),
            run_time=1.2
        )
        self.wait(0.5)

        # =========================================================================
        # CHUYỂN GÓC NHÌN TỪ TRÊN TRỤC Z NHÌN XUỐNG (TOP-DOWN 2D CONTOUR MAP)
        # =========================================================================
        top_down_label = Text("Top-Down View (+z): 2D Contour Map", font_size=18, color=GOLD).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)

        self.play(
            FadeOut(surface),
            FadeOut(drop_lines),
            Transform(view_label, top_down_label),
            run_time=0.8
        )
        self.move_camera(phi=0 * DEGREES, theta=-90 * DEGREES, run_time=2.5, rate_func=smooth)
        self.wait(2.0)

        # =========================================================================
        # XOAY TRỞ LẠI PHỐI CẢNH 3D ĐỂ TẠO LOOP LIÊN TỤC
        # =========================================================================
        reset_label = Text("3D Perspective: Surface & Slices", font_size=18, color=WHITE).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)

        self.play(
            FadeIn(surface),
            Transform(view_label, reset_label),
            run_time=0.8
        )
        self.move_camera(phi=68 * DEGREES, theta=-55 * DEGREES, run_time=2.2, rate_func=smooth)
        self.wait(0.5)
