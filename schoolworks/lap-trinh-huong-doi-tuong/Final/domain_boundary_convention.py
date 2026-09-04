from manim import *
import numpy as np

BG_COLOR = "#0e1117"
CYAN = "#58C4DD"
GOLD = "#F4D03F"
GREEN = "#2ecc71"
RED = "#da3633"


class DomainBoundaryScene(Scene):
    def construct(self):
        self.camera.background_color = BG_COLOR

        # 1. Hệ trục tọa độ 2D mặt phẳng Oxy
        axes = Axes(
            x_range=[-2.5, 2.5, 1],
            y_range=[-2.5, 2.5, 1],
            x_length=4.2,
            y_length=4.2,
            axis_config={"color": GRAY, "stroke_width": 2, "include_ticks": False}
        ).shift(DOWN * 0.2)

        x_lbl = axes.get_x_axis_label(Tex("x", font_size=20), edge=RIGHT)
        y_lbl = axes.get_y_axis_label(Tex("y", font_size=20), edge=UP)
        self.play(Create(axes), Write(x_lbl), Write(y_lbl), run_time=0.8)

        # 2. Miền trong (Shaded region) x^2 + y^2 < R^2
        R = 1.4
        region_fill = Circle(
            radius=R * (axes.x_length / 5.0),
            fill_color=CYAN,
            fill_opacity=0.35,
            stroke_width=0
        ).move_to(axes.c2p(0, 0))

        # =========================================================================
        # TRƯỜNG HỢP 1: BẤT ĐẲNG THỨC NGẶT (Dashed Boundary - Points Excluded)
        # =========================================================================
        boundary_base = Circle(
            radius=R * (axes.x_length / 5.0),
            color=GOLD,
            stroke_width=3.5
        ).move_to(axes.c2p(0, 0))
        dashed_boundary = DashedVMobject(boundary_base, num_dashes=28)

        label_strict = MathTex(r"x^2 + y^2 < r^2", font_size=28, color=GOLD).to_edge(UP, buff=0.35)
        badge_strict = Text("Strict: Dashed (Excluded)", font_size=18, color=RED).next_to(label_strict, DOWN, buff=0.15)

        # Điểm biên rỗng (Excluded boundary point)
        point_on_edge = Dot(
            point=axes.c2p(R * np.cos(PI / 4), R * np.sin(PI / 4)),
            radius=0.08,
            color=RED,
            stroke_width=2,
            fill_opacity=0
        )
        cross_mark = MathTex(r"\notin D", font_size=22, color=RED).next_to(point_on_edge, UR, buff=0.1)

        self.play(
            FadeIn(region_fill),
            Create(dashed_boundary),
            Write(label_strict),
            FadeIn(badge_strict),
            run_time=1.2
        )
        self.play(Create(point_on_edge), Write(cross_mark), run_time=0.8)
        self.wait(1.5)

        # =========================================================================
        # TRƯỜNG HỢP 2: BẤT ĐẲNG THỨC KHÔNG NGẶT (Solid Boundary - Points Included)
        # =========================================================================
        label_non_strict = MathTex(r"x^2 + y^2 \le r^2", font_size=28, color=GREEN).to_edge(UP, buff=0.35)
        badge_non_strict = Text("Non-strict: Solid (Included)", font_size=18, color=GREEN).next_to(label_non_strict, DOWN, buff=0.15)

        solid_boundary = Circle(
            radius=R * (axes.x_length / 5.0),
            color=GREEN,
            stroke_width=3.5
        ).move_to(axes.c2p(0, 0))

        point_included = Dot(
            point=axes.c2p(R * np.cos(PI / 4), R * np.sin(PI / 4)),
            radius=0.08,
            color=GREEN,
            fill_opacity=1
        )
        check_mark = MathTex(r"\in D", font_size=22, color=GREEN).next_to(point_included, UR, buff=0.1)

        # Morphing chuyển tiếp mượt mà
        self.play(
            Transform(dashed_boundary, solid_boundary),
            Transform(label_strict, label_non_strict),
            Transform(badge_strict, badge_non_strict),
            Transform(point_on_edge, point_included),
            Transform(cross_mark, check_mark),
            run_time=1.4
        )
        self.wait(2.0)

        # Reset lặp lại vòng lặp
        self.play(
            FadeOut(dashed_boundary),
            FadeOut(region_fill),
            FadeOut(label_strict),
            FadeOut(badge_strict),
            FadeOut(point_on_edge),
            FadeOut(cross_mark),
            run_time=0.8
        )
