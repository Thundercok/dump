from manim import *
import numpy as np

COLOR_BG = "#0e1117"
COLOR_TABLE_BG = "#161b22"
COLOR_BORDER = "#30363d"
COLOR_PRIMARY = "#58a6ff"
COLOR_ALERT = "#da3633"
COLOR_GREEN = "#3fb950"
COLOR_YELLOW = "#d29922"

class RulesForFindingNaturalDomains(Scene):
    def construct(self):
        self.camera.background_color = COLOR_BG

        # -------------------------------------------------------------
        # 1. Slide Title & Introductory Text
        # -------------------------------------------------------------
        title = Text("Rules for Finding Natural Domains in  ", font_size=28, weight=BOLD, color=WHITE)
        r2_math = MathTex(r"\mathbb{R}^2", font_size=34, color=COLOR_PRIMARY).next_to(title, RIGHT, buff=0.1)
        title_group = VGroup(title, r2_math).to_edge(UP, buff=0.4).to_edge(LEFT, buff=0.6)

        intro_text = MathTex(
            r"\text{When finding the domain } D \subset \mathbb{R}^2, \text{ identify standard algebraic restrictions:}",
            font_size=22, color=GRAY_B
        ).next_to(title_group, DOWN, buff=0.25, aligned_edge=LEFT)

        self.play(Write(title_group), run_time=1.0)
        self.play(FadeIn(intro_text), run_time=0.8)
        self.wait(0.4)

        # -------------------------------------------------------------
        # 2. Right Side: 2D Coordinate Graph for Visual Demonstrations
        # -------------------------------------------------------------
        axes = Axes(
            x_range=[-3.2, 3.2, 1],
            y_range=[-2.6, 2.6, 1],
            x_length=5.6,
            y_length=4.6,
            axis_config={"color": GRAY_C, "stroke_width": 2, "include_tip": True, "tip_width": 0.15, "tip_height": 0.15}
        ).to_edge(RIGHT, buff=0.6).shift(DOWN*0.5)

        axes_labels = axes.get_axis_labels(MathTex("x", font_size=20), MathTex("y", font_size=20))
        axes_box = RoundedRectangle(
            corner_radius=0.15, width=6.2, height=5.0, 
            color=COLOR_BORDER, fill_color="#13171f", fill_opacity=0.85
        ).move_to(axes.get_center())

        self.play(FadeIn(axes_box), Create(axes), Write(axes_labels), run_time=1.0)

        # -------------------------------------------------------------
        # 3. Left Side: Interactive Table Cards (4 Rules)
        # -------------------------------------------------------------
        card_w, card_h = 6.6, 0.72
        card_start_y = 1.3
        spacing_y = 0.82

        # Card 1: Fractions
        c1_box = RoundedRectangle(corner_radius=0.1, width=card_w, height=card_h, color=COLOR_BORDER, fill_color=COLOR_TABLE_BG, fill_opacity=0.9).move_to([-3.4, card_start_y, 0])
        c1_tag = Text("Fractions:", font_size=15, weight=BOLD, color=WHITE).move_to(c1_box.get_left() + RIGHT*0.75)
        c1_math = MathTex(r"\frac{P(x,y)}{Q(x,y)}", font_size=20, color=YELLOW_C).next_to(c1_tag, RIGHT, buff=0.2)
        c1_arrow = MathTex(r"\implies Q(x,y) \neq 0", font_size=19, color=COLOR_ALERT).next_to(c1_math, RIGHT, buff=0.25)
        c1_group = VGroup(c1_box, c1_tag, c1_math, c1_arrow)

        # Card 2: Square Roots
        c2_box = RoundedRectangle(corner_radius=0.1, width=card_w, height=card_h, color=COLOR_BORDER, fill_color=COLOR_TABLE_BG, fill_opacity=0.9).move_to([-3.4, card_start_y - spacing_y, 0])
        c2_tag = Text("Square Roots:", font_size=15, weight=BOLD, color=WHITE).move_to(c2_box.get_left() + RIGHT*0.95)
        c2_math = MathTex(r"\sqrt{g(x,y)}", font_size=20, color=GREEN_C).next_to(c2_tag, RIGHT, buff=0.2)
        c2_arrow = MathTex(r"\implies g(x,y) \ge 0", font_size=19, color=COLOR_GREEN).next_to(c2_math, RIGHT, buff=0.25)
        c2_group = VGroup(c2_box, c2_tag, c2_math, c2_arrow)

        # Card 3: Logarithms
        c3_box = RoundedRectangle(corner_radius=0.1, width=card_w, height=card_h, color=COLOR_BORDER, fill_color=COLOR_TABLE_BG, fill_opacity=0.9).move_to([-3.4, card_start_y - 2*spacing_y, 0])
        c3_tag = Text("Logarithms:", font_size=15, weight=BOLD, color=WHITE).move_to(c3_box.get_left() + RIGHT*0.85)
        c3_math = MathTex(r"\ln(g(x,y))", font_size=20, color=COLOR_PRIMARY).next_to(c3_tag, RIGHT, buff=0.2)
        c3_arrow = MathTex(r"\implies g(x,y) > 0", font_size=19, color=COLOR_PRIMARY).next_to(c3_math, RIGHT, buff=0.25)
        c3_group = VGroup(c3_box, c3_tag, c3_math, c3_arrow)

        # Card 4: Inverse Trig
        c4_box = RoundedRectangle(corner_radius=0.1, width=card_w, height=card_h, color=COLOR_BORDER, fill_color=COLOR_TABLE_BG, fill_opacity=0.9).move_to([-3.4, card_start_y - 3*spacing_y, 0])
        c4_tag = Text("Inverse Trig:", font_size=15, weight=BOLD, color=WHITE).move_to(c4_box.get_left() + RIGHT*0.85)
        c4_math = MathTex(r"\arcsin(g(x,y))", font_size=19, color=TEAL_C).next_to(c4_tag, RIGHT, buff=0.15)
        c4_arrow = MathTex(r"\implies -1 \le g(x,y) \le 1", font_size=17, color=TEAL_B).next_to(c4_math, RIGHT, buff=0.2)
        c4_group = VGroup(c4_box, c4_tag, c4_math, c4_arrow)

        # Bottom Alert Box: Boundary vs. Interior
        alert_box = RoundedRectangle(corner_radius=0.12, width=card_w, height=1.2, color=COLOR_ALERT, fill_color="#2b1114", fill_opacity=0.95).move_to([-3.4, card_start_y - 4.35*spacing_y + 0.1, 0])
        alert_title = Text("Boundary vs. Interior", font_size=15, weight=BOLD, color=COLOR_ALERT).move_to(alert_box.get_top() + DOWN*0.25).align_to(alert_box, LEFT).shift(RIGHT*0.3)
        alert_p1 = Text("• Strict (> or <): Dashed curve (excluded)", font_size=13, color=RED_B).next_to(alert_title, DOWN, buff=0.12, aligned_edge=LEFT)
        alert_p2 = Text("• Non-strict (>= or <=): Solid curve (included)", font_size=13, color=GREEN_B).next_to(alert_p1, DOWN, buff=0.1, aligned_edge=LEFT)
        alert_group = VGroup(alert_box, alert_title, alert_p1, alert_p2)

        # -------------------------------------------------------------
        # STEP 1: Fraction Animation
        # -------------------------------------------------------------
        c1_box.set_stroke(YELLOW_C, 2)
        self.play(FadeIn(c1_group), run_time=0.8)

        # Graph for Fraction: Excluded Dashed Line y = x
        g1_line = DashedLine(start=axes.c2p(-2.2, -2.2), end=axes.c2p(2.2, 2.2), color=COLOR_ALERT, dash_length=0.14, stroke_width=3.5)
        g1_tag = MathTex(r"Q(x,y) = 0 \text{ (Excluded Curve)}", font_size=16, color=COLOR_ALERT).next_to(axes.c2p(1.0, 1.0), UL, buff=0.1)
        g1_cross1 = Line(axes.c2p(0.8, 1.2), axes.c2p(1.2, 0.8), color=RED, stroke_width=2.5)
        g1_cross2 = Line(axes.c2p(0.8, 0.8), axes.c2p(1.2, 1.2), color=RED, stroke_width=2.5)
        g1_visual = VGroup(g1_line, g1_tag, g1_cross1, g1_cross2)

        self.play(Create(g1_line), Write(g1_tag), Create(g1_cross1), Create(g1_cross2), run_time=1.2)
        self.wait(1.2)
        c1_box.set_stroke(COLOR_BORDER, 1)

        # -------------------------------------------------------------
        # STEP 2: Square Root Animation
        # -------------------------------------------------------------
        c2_box.set_stroke(COLOR_GREEN, 2)
        self.play(FadeOut(g1_visual), FadeIn(c2_group), run_time=0.8)

        # Graph for Square Root: Solid Circle & Shaded Interior
        g2_circle = Circle(radius=axes.c2p(1.8,0)[0] - axes.c2p(0,0)[0], color=COLOR_GREEN, stroke_width=3.5).move_to(axes.c2p(0,0))
        g2_disk = Circle(radius=axes.c2p(1.8,0)[0] - axes.c2p(0,0)[0], color=COLOR_GREEN, fill_color=COLOR_GREEN, fill_opacity=0.3, stroke_width=0).move_to(axes.c2p(0,0))
        g2_tag = MathTex(r"g(x,y) \ge 0 \text{ (Solid Boundary + Interior)}", font_size=16, color=COLOR_GREEN).next_to(axes.c2p(0, 1.8), UP, buff=0.1)
        g2_visual = VGroup(g2_circle, g2_disk, g2_tag)

        self.play(Create(g2_circle), Write(g2_tag), run_time=1.0)
        self.play(FadeIn(g2_disk), run_time=0.8)
        self.wait(1.2)
        c2_box.set_stroke(COLOR_BORDER, 1)

        # -------------------------------------------------------------
        # STEP 3: Logarithm Animation
        # -------------------------------------------------------------
        c3_box.set_stroke(COLOR_PRIMARY, 2)
        self.play(FadeOut(g2_visual), FadeIn(c3_group), run_time=0.8)

        # Graph for Logarithm: Dashed Parabola & Upper Region
        parabola_fn = lambda x: 0.7 * x**2 - 1.2
        g3_curve = axes.plot(parabola_fn, x_range=[-2.2, 2.2], color=COLOR_PRIMARY)
        g3_dashed = DashedVMobject(g3_curve, num_dashes=30, dashed_ratio=0.6).set_color(COLOR_PRIMARY).set_stroke(width=3.5)
        g3_area = axes.get_area(g3_curve, x_range=[-2.2, 2.2], bounded_graph=axes.plot(lambda x: 2.2, x_range=[-2.2, 2.2]), color=COLOR_PRIMARY, opacity=0.3)
        g3_tag = MathTex(r"g(x,y) > 0 \text{ (Dashed Boundary + Region)}", font_size=16, color=COLOR_PRIMARY).next_to(axes.c2p(0, 2.2), DOWN, buff=0.1)
        g3_visual = VGroup(g3_dashed, g3_area, g3_tag)

        self.play(Create(g3_dashed), Write(g3_tag), run_time=1.0)
        self.play(FadeIn(g3_area), run_time=0.8)
        self.wait(1.2)
        c3_box.set_stroke(COLOR_BORDER, 1)

        # -------------------------------------------------------------
        # STEP 4: Inverse Trig Animation
        # -------------------------------------------------------------
        c4_box.set_stroke(TEAL_C, 2)
        self.play(FadeOut(g3_visual), FadeIn(c4_group), run_time=0.8)

        # Graph for Inverse Trig: Horizontal Strip between Solid Lines
        g4_l1 = Line(axes.c2p(-2.8, 1.2), axes.c2p(2.8, 1.2), color=TEAL_B, stroke_width=3)
        g4_l2 = Line(axes.c2p(-2.8, -1.2), axes.c2p(2.8, -1.2), color=TEAL_B, stroke_width=3)
        g4_rect = Rectangle(width=axes.c2p(2.8,0)[0]-axes.c2p(-2.8,0)[0], height=axes.c2p(0,1.2)[1]-axes.c2p(0,-1.2)[1], color=TEAL, fill_color=TEAL, fill_opacity=0.25, stroke_width=0).move_to(axes.c2p(0,0))
        g4_tag = MathTex(r"-1 \le g(x,y) \le 1 \text{ (Enclosed Band)}", font_size=16, color=TEAL_B).next_to(axes.c2p(0, 1.2), UP, buff=0.1)
        g4_visual = VGroup(g4_l1, g4_l2, g4_rect, g4_tag)

        self.play(Create(g4_l1), Create(g4_l2), Write(g4_tag), run_time=1.0)
        self.play(FadeIn(g4_rect), run_time=0.8)
        self.wait(1.2)
        c4_box.set_stroke(COLOR_BORDER, 1)

        # -------------------------------------------------------------
        # STEP 5: Boundary vs Interior Alert Box & Direct Visual Comparison
        # -------------------------------------------------------------
        self.play(FadeOut(g4_visual), FadeIn(alert_group), run_time=1.0)

        # Final Visual: Side-by-side comparison on Graph
        comp_solid_circle = Circle(radius=0.9, color=COLOR_GREEN, stroke_width=3.5).move_to(axes.c2p(-1.3, 0.2))
        comp_solid_fill = Circle(radius=0.9, color=COLOR_GREEN, fill_color=COLOR_GREEN, fill_opacity=0.35, stroke_width=0).move_to(axes.c2p(-1.3, 0.2))
        comp_solid_lbl = MathTex(r"\textbf{Solid } (\ge, \le)", font_size=16, color=COLOR_GREEN).next_to(comp_solid_circle, DOWN, buff=0.2)
        comp_solid_sub = Text("Boundary INCLUDED", font_size=11, color=GRAY_A).next_to(comp_solid_lbl, DOWN, buff=0.08)

        comp_dash_circle = Circle(radius=0.9, color=COLOR_ALERT, stroke_width=0).move_to(axes.c2p(1.3, 0.2))
        comp_dash_stroke = DashedVMobject(Circle(radius=0.9), num_dashes=20, dashed_ratio=0.5).set_color(COLOR_ALERT).set_stroke(width=3.5).move_to(axes.c2p(1.3, 0.2))
        comp_dash_fill = Circle(radius=0.9, color=COLOR_ALERT, fill_color=COLOR_ALERT, fill_opacity=0.25, stroke_width=0).move_to(axes.c2p(1.3, 0.2))
        comp_dash_lbl = MathTex(r"\textbf{Dashed } (>, <, \neq)", font_size=16, color=COLOR_ALERT).next_to(comp_dash_circle, DOWN, buff=0.2)
        comp_dash_sub = Text("Boundary EXCLUDED", font_size=11, color=GRAY_A).next_to(comp_dash_lbl, DOWN, buff=0.08)

        final_comparison = VGroup(
            comp_solid_circle, comp_solid_fill, comp_solid_lbl, comp_solid_sub,
            comp_dash_stroke, comp_dash_fill, comp_dash_lbl, comp_dash_sub
        )

        self.play(
            Create(comp_solid_circle), FadeIn(comp_solid_fill), Write(comp_solid_lbl), FadeIn(comp_solid_sub),
            Create(comp_dash_stroke), FadeIn(comp_dash_fill), Write(comp_dash_lbl), FadeIn(comp_dash_sub),
            run_time=1.8
        )
        self.wait(3.0)
