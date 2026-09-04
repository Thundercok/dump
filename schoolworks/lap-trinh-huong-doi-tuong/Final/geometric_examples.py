from manim import *
import numpy as np

# Cấu hình màu sắc đặc trưng 3Blue1Brown
BG_COLOR = "#0e1117"
CYAN_ACCENT = "#58C4DD"
GOLD_ACCENT = "#F4D03F"
GREEN_ACCENT = "#2ecc71"
RED_ACCENT = "#da3633"


class GeometricExamplesScene(ThreeDScene):
    def construct(self):
        self.camera.background_color = BG_COLOR

        # =========================================================================
        # PHẦN 1: DIỆN TÍCH HÌNH CHỮ NHẬT A(x, y) = x * y (2D Visualization)
        # =========================================================================
        
        # Tiêu đề cố định trên góc màn hình
        title = Title(
            r"Multivariable Geometry: Independent Variations",
            font_size=36,
            color=WHITE
        )
        self.add_fixed_in_frame_mobjects(title)
        self.play(Write(title), run_time=0.8)

        # 1.1 Tạo nhãn công thức
        rect_formula = MathTex(
            r"A(x, y) = x \cdot y",
            font_size=38,
            color=GOLD_ACCENT
        ).to_corner(UL).shift(DOWN * 0.8)
        self.add_fixed_in_frame_mobjects(rect_formula)
        self.play(FadeIn(rect_formula, shift=UP * 0.2))

        # 1.2 Thiết lập ValueTracker cho 2 kích thước x và y
        x_val = ValueTracker(3.0)
        y_val = ValueTracker(2.0)

        # Định nghĩa đối tượng hình chữ nhật bám theo ValueTracker
        rect = always_redraw(lambda: Rectangle(
            width=x_val.get_value(),
            height=y_val.get_value(),
            fill_color=CYAN_ACCENT,
            fill_opacity=0.35,
            stroke_color=CYAN_ACCENT,
            stroke_width=3
        ).move_to(LEFT * 2.5 + DOWN * 0.5))

        # Nhãn kích thước x (độ dài)
        x_label = always_redraw(lambda: MathTex(
            f"x = {x_val.get_value():.2f}",
            font_size=28,
            color=WHITE
        ).next_to(rect, DOWN, buff=0.2))

        # Nhãn kích thước y (chiều rộng)
        y_label = always_redraw(lambda: MathTex(
            f"y = {y_val.get_value():.2f}",
            font_size=28,
            color=WHITE
        ).next_to(rect, LEFT, buff=0.2))

        # Nhãn diện tích hiện thời
        area_readout = always_redraw(lambda: MathTex(
            f"A = {x_val.get_value() * y_val.get_value():.2f}",
            font_size=32,
            color=GOLD_ACCENT
        ).move_to(rect.get_center()))

        self.play(
            Create(rect),
            Write(x_label),
            Write(y_label),
            FadeIn(area_readout),
            run_time=1.5
        )
        self.wait(0.5)

        # Mô phỏng: Cố định y = 2, chỉ cho x tăng (Đạo hàm riêng theo x: dA/dx = y)
        subtext_x = Text("Cố định y, tăng x: Tốc độ tăng diện tích = y", font_size=20, color=GREEN_ACCENT).next_to(rect_formula, DOWN, aligned_edge=LEFT)
        self.add_fixed_in_frame_mobjects(subtext_x)
        self.play(Write(subtext_x))
        self.play(x_val.animate.set_value(5.0), run_time=2, rate_func=smooth)
        self.wait(0.5)

        # Mô phỏng: Cố định x = 5, chỉ cho y tăng (Đạo hàm riêng theo y: dA/dy = x)
        subtext_y = Text("Cố định x, tăng y: Tốc độ tăng diện tích = x", font_size=20, color=GREEN_ACCENT).next_to(subtext_x, DOWN, aligned_edge=LEFT)
        self.add_fixed_in_frame_mobjects(subtext_y)
        self.play(FadeIn(subtext_y))
        self.play(y_val.animate.set_value(3.5), run_time=2, rate_func=smooth)
        self.wait(1)

        # Xóa phần 2D để chuẩn bị sang không gian 3D
        self.play(
            FadeOut(rect),
            FadeOut(x_label),
            FadeOut(y_label),
            FadeOut(area_readout),
            FadeOut(rect_formula),
            FadeOut(subtext_x),
            FadeOut(subtext_y),
            run_time=1
        )

        # =========================================================================
        # PHẦN 2: THỂ TÍCH KHỐI NÓN TRÒN XOAY V(r, h) = 1/3 * pi * r^2 * h (3D)
        # =========================================================================

        cone_formula = MathTex(
            r"V(r, h) = \frac{1}{3}\pi r^2 h",
            font_size=38,
            color=GOLD_ACCENT
        ).to_corner(UL).shift(DOWN * 0.8)
        self.add_fixed_in_frame_mobjects(cone_formula)
        self.play(FadeIn(cone_formula, shift=UP * 0.2))

        # Chuyển góc nhìn camera sang không gian phối cảnh 3D
        self.set_camera_orientation(phi=70 * DEGREES, theta=-45 * DEGREES)

        # Hệ trục tọa độ 3D
        axes_3d = ThreeDAxes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            z_range=[-1, 4, 1],
            x_length=5,
            y_length=5,
            z_length=4
        ).shift(DOWN * 0.5)

        # Tạo hình nón 3D (Cone) với bán kính đáy r=1.5, chiều cao h=2.5
        cone_surface = Cone(
            base_radius=1.5,
            height=2.5,
            direction=-IN,
            show_base=True,
            fill_color=CYAN_ACCENT,
            fill_opacity=0.6,
            stroke_color=WHITE,
            stroke_width=1
        ).shift(axes_3d.c2p(0, 0, 0))

        self.play(Create(axes_3d), run_time=1)
        self.play(Create(cone_surface), run_time=1.5)

        # Hiệu ứng xoay camera mượt mà để quan sát toàn bộ khối hình học
        self.begin_ambient_camera_rotation(rate=0.2)
        
        cone_details = Text(
            "Bậc 2 theo r và bậc 1 theo h",
            font_size=22,
            color=WHITE
        ).next_to(cone_formula, DOWN, aligned_edge=LEFT)
        self.add_fixed_in_frame_mobjects(cone_details)
        self.play(FadeIn(cone_details))

        self.wait(4)
        self.stop_ambient_camera_rotation()

        # Kết thúc hoạt cảnh
        self.play(
            FadeOut(cone_surface),
            FadeOut(axes_3d),
            FadeOut(cone_formula),
            FadeOut(cone_details),
            FadeOut(title),
            run_time=1
        )
