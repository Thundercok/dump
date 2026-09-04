from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
RED = "#da3633"
GREEN_COLOR = "#2ecc71"
WHITE_COLOR = "#ffffff"


class HowToPlotSurfaceScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR
        
        # Bắt đầu với góc nhìn 2D thẳng từ trên xuống mặt phẳng Oxy
        self.set_camera_orientation(phi=0 * DEGREES, theta=-90 * DEGREES)

        # 1. Hệ trục tọa độ
        axes = ThreeDAxes(
            x_range=[-2.5, 2.5, 1],
            y_range=[-2.5, 2.5, 1],
            z_range=[0, 3.5, 1],
            x_length=3.8,
            y_length=3.8,
            z_length=2.8
        ).shift(DOWN * 0.4)

        x_lbl = axes.get_x_axis_label(Tex("x", font_size=18), edge=RIGHT)
        y_lbl = axes.get_y_axis_label(Tex("y", font_size=18), edge=UP)
        z_lbl = axes.get_z_axis_label(Tex("z", font_size=18), edge=OUT)

        # UI Tiêu đề các bước vẽ
        step_title = Text("Step 1: Draw Level Curves on xy-plane", font_size=18, color=GOLD).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)
        self.add_fixed_in_frame_mobjects(step_title)

        self.play(Create(axes), Write(x_lbl), Write(y_lbl), Write(step_title), run_time=0.8)

        # =========================================================================
        # BƯỚC 1: VẼ CÁC ĐƯỜNG MỨC 2D TRÊN MẶT ĐÁY Oxy (f(x,y) = k)
        # =========================================================================
        z_levels = [0.8, 1.6, 2.4]
        colors = [GREEN_COLOR, GOLD, RED]
        
        curves_flat = VGroup()
        curves_lifted = VGroup()
        guidelines = VGroup()

        for zk, col in zip(z_levels, colors):
            rk = np.sqrt(zk / 0.55)
            # Đường cong 2D phẳng tại z = 0
            c_flat = ParametricFunction(
                lambda t, r=rk: axes.c2p(r * np.cos(t), r * np.sin(t), 0),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=3.5
            )
            # Đường cong sau khi nhấc lên cao độ zk
            c_lift = ParametricFunction(
                lambda t, r=rk, z=zk: axes.c2p(r * np.cos(t), r * np.sin(t), z),
                t_range=[0, 2 * PI],
                color=col,
                stroke_width=3.5
            )
            curves_flat.add(c_flat)
            curves_lifted.add(c_lift)

            # Các đường gióng nâng độ cao
            for angle in [0, PI/2, PI, 3*PI/2]:
                gl = DashedLine(
                    axes.c2p(rk * np.cos(angle), rk * np.sin(angle), 0),
                    axes.c2p(rk * np.cos(angle), rk * np.sin(angle), zk),
                    color=col,
                    stroke_width=1.5,
                    dash_length=0.06
                )
                guidelines.add(gl)

        # Vẽ từng đường mức trên mặt 2D
        for c in curves_flat:
            self.play(Create(c), run_time=0.5)
        self.wait(0.5)

        # =========================================================================
        # BƯỚC 2: CHUYỂN SANG KHÔNG GIAN 3D VÀ NÂNG CÁC ĐƯỜNG MỨC LÊN ĐÚNG CAO ĐỘ z = k
        # =========================================================================
        step2_title = Text("Step 2: Lift each curve to height z = k", font_size=18, color=CYAN).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)

        self.play(
            Transform(step_title, step2_title),
            Write(z_lbl),
            run_time=0.6
        )
        self.move_camera(phi=68 * DEGREES, theta=-55 * DEGREES, run_time=1.8, rate_func=smooth)

        # Nâng từng đường tròn lên cao độ tương ứng
        self.play(
            Create(guidelines),
            *[Transform(c_flat, c_lift) for c_flat, c_lift in zip(curves_flat, curves_lifted)],
            run_time=2.0,
            rate_func=smooth
        )
        self.wait(0.5)

        # =========================================================================
        # BƯỚC 3: PHỦ MẶT CONG 3D QUA CÁC ĐƯỜNG MỨC (FORM 3D SURFACE)
        # =========================================================================
        step3_title = Text("Step 3: Connect curves to form 3D Surface", font_size=18, color=GREEN_COLOR).to_corner(UL).shift(DOWN * 0.2 + RIGHT * 0.2)

        surface = Surface(
            lambda u, v: axes.c2p(
                u * np.cos(v),
                u * np.sin(v),
                0.55 * (u**2)
            ),
            u_range=[0, 2.15],
            v_range=[0, 2 * PI],
            resolution=(18, 18),
            fill_color=CYAN,
            fill_opacity=0.45,
            stroke_color=WHITE_COLOR,
            stroke_width=0.3
        )

        self.play(
            Transform(step_title, step3_title),
            FadeOut(guidelines),
            Create(surface),
            run_time=1.8
        )

        # =========================================================================
        # BƯỚC 4: QUAY CAMERA ĐỂ QUAN SÁT TÁC PHẨM 3D HOÀN CHỈNH
        # =========================================================================
        self.begin_ambient_camera_rotation(rate=0.3)
        self.wait(3.0)
        self.stop_ambient_camera_rotation()

        # Reset lặp lại vòng lặp
        self.play(
            FadeOut(surface),
            FadeOut(curves_flat),
            run_time=0.8
        )
