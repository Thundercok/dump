from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
GREEN = "#2ecc71"

# =========================================================================
# SCENE 1 (Slide 1): 2D Curve to 3D Surface
# =========================================================================
class CurveToSurfaceScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        self.set_camera_orientation(phi=65 * DEGREES, theta=-55 * DEGREES)

        axes = ThreeDAxes(
            x_range=[-2, 2, 1], y_range=[-2, 2, 1], z_range=[-0.5, 3, 1],
            x_length=3.6, y_length=3.6, z_length=2.8
        ).shift(DOWN * 0.4)

        x_lbl = axes.get_x_axis_label(Tex("x", font_size=18), edge=RIGHT)
        y_lbl = axes.get_y_axis_label(Tex("y", font_size=18), edge=UP)
        z_lbl = axes.get_z_axis_label(Tex("z", font_size=18), edge=OUT)

        # 2D trace curve on xz-plane
        curve_2d = ParametricFunction(
            lambda t: axes.c2p(t, 0, 0.6 * t**2),
            t_range=[-1.8, 1.8], color=GOLD, stroke_width=3.5
        )

        # 3D full surface
        surface_3d = Surface(
            lambda u, v: axes.c2p(u * np.cos(v), u * np.sin(v), 0.6 * u**2),
            u_range=[0, 1.8], v_range=[0, 2 * PI],
            resolution=(18, 18), fill_color=CYAN, fill_opacity=0.55,
            stroke_color=WHITE, stroke_width=0.3
        )

        self.play(Create(axes), Write(x_lbl), Write(y_lbl), Write(z_lbl), run_time=0.8)
        self.play(Create(curve_2d), run_time=1.0)
        self.wait(0.4)
        
        # Mở rộng đường cong thành mặt cong 3D
        self.play(Transform(curve_2d, surface_3d), run_time=1.5)
        self.begin_ambient_camera_rotation(rate=0.35)
        self.wait(3.5)
        self.stop_ambient_camera_rotation()
        self.play(FadeOut(curve_2d), FadeOut(axes), run_time=0.8)


# =========================================================================
# SCENE 2 (Slide 2): Vertical Line Test in 3D
# =========================================================================
class VerticalLineTestScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        self.set_camera_orientation(phi=70 * DEGREES, theta=-50 * DEGREES)

        axes = ThreeDAxes(
            x_range=[-2.2, 2.2, 1], y_range=[-2.2, 2.2, 1], z_range=[-0.5, 3.2, 1],
            x_length=3.8, y_length=3.8, z_length=3.0
        ).shift(DOWN * 0.5)

        # Mặt cong z = f(x, y) = 2.4 - 0.4*(x^2 + y^2)
        def f(x, y):
            return 2.5 - 0.45 * (x**2 + y**2)

        surface = Surface(
            lambda u, v: axes.c2p(u, v, f(u, v)),
            u_range=[-1.6, 1.6], v_range=[-1.6, 1.6],
            resolution=(16, 16), fill_color=CYAN, fill_opacity=0.45,
            stroke_color=WHITE, stroke_width=0.3
        )

        t_tracker = ValueTracker(0.0)

        # Điểm (x0, y0) chạy trên Oxy
        base_dot = always_redraw(lambda: Dot3D(
            point=axes.c2p(0.9 * np.cos(t_tracker.get_value()), 0.9 * np.sin(t_tracker.get_value()), 0),
            radius=0.06, color=GOLD
        ))

        # Điểm giao duy nhất P(x0, y0, f(x0, y0))
        surface_dot = always_redraw(lambda: Dot3D(
            point=axes.c2p(
                0.9 * np.cos(t_tracker.get_value()),
                0.9 * np.sin(t_tracker.get_value()),
                f(0.9 * np.cos(t_tracker.get_value()), 0.9 * np.sin(t_tracker.get_value()))
            ),
            radius=0.07, color=RED
        ))

        # Đường thẳng đứng xuyên qua (x0, y0)
        vertical_line = always_redraw(lambda: Line3D(
            start=axes.c2p(0.9 * np.cos(t_tracker.get_value()), 0.9 * np.sin(t_tracker.get_value()), -0.3),
            end=axes.c2p(0.9 * np.cos(t_tracker.get_value()), 0.9 * np.sin(t_tracker.get_value()), 3.0),
            color=GOLD, thickness=0.025
        ))

        self.play(Create(axes), Create(surface), run_time=1.0)
        self.play(FadeIn(base_dot), FadeIn(surface_dot), Create(vertical_line), run_time=0.8)

        # Quét kiểm tra nghiệm duy nhất
        self.begin_ambient_camera_rotation(rate=0.2)
        self.play(t_tracker.animate.set_value(2 * PI), run_time=4.5, rate_func=linear)
        self.stop_ambient_camera_rotation()
        self.play(FadeOut(base_dot), FadeOut(surface_dot), FadeOut(vertical_line), FadeOut(surface), FadeOut(axes))


# =========================================================================
# SCENE 3 (Slide 3): Saddle Surface (Hyperbolic Paraboloid)
# =========================================================================
class SaddleSurfaceScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        self.set_camera_orientation(phi=68 * DEGREES, theta=-60 * DEGREES)

        axes = ThreeDAxes(
            x_range=[-2, 2, 1], y_range=[-2, 2, 1], z_range=[-2, 2, 1],
            x_length=3.8, y_length=3.8, z_length=3.0
        )

        # Mặt yên ngựa: z = x^2 - y^2
        saddle = Surface(
            lambda u, v: axes.c2p(u, v, 0.7 * (u**2 - v**2)),
            u_range=[-1.4, 1.4], v_range=[-1.4, 1.4],
            resolution=(20, 20), fill_color=GOLD, fill_opacity=0.6,
            stroke_color=WHITE, stroke_width=0.4
        )

        badge = MathTex(r"z = x^2 - y^2", font_size=26, color=GOLD).to_corner(UL).shift(DOWN * 0.2)
        self.add_fixed_in_frame_mobjects(badge)

        self.play(Create(axes), Create(saddle), Write(badge), run_time=1.2)
        self.begin_ambient_camera_rotation(rate=0.4)
        self.wait(5.0)
        self.stop_ambient_camera_rotation()
        self.play(FadeOut(saddle), FadeOut(axes), FadeOut(badge), run_time=0.8)
