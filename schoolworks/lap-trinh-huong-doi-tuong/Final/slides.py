from manim import *
from manim_slides import Slide
import numpy as np

class MultivariableLecture(Slide, ThreeDScene):
    def construct(self):
        # -------------------------------------------------------------
        # Slide 1: Title Slide (3B1B Style)
        # -------------------------------------------------------------
        title = Text("Functions of Several Variables", font_size=48, color=BLUE_B)
        subtitle = Text("Visual Intuition with 3Blue1Brown Animations", font_size=28, color=GRAY_B)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.next_slide()  # <-- Press Right Arrow / Space to proceed

        self.play(FadeOut(title), FadeOut(subtitle))

        # -------------------------------------------------------------
        # Slide 2: 3D Surface & Level Curves
        # -------------------------------------------------------------
        self.set_camera_orientation(phi=65 * DEGREES, theta=-45 * DEGREES)
        axes = ThreeDAxes(
            x_range=[-3, 3, 1], y_range=[-3, 3, 1], z_range=[0, 5, 1],
            x_length=5.5, y_length=5.5, z_length=3.5
        )
        axes_labels = axes.get_axis_labels(MathTex("x").scale(0.7), MathTex("y").scale(0.7), MathTex("z").scale(0.7))
        
        surface = Surface(
            lambda u, v: axes.c2p(u, v, (u**2 + v**2)/2),
            u_range=[-2.2, 2.2], v_range=[-2.2, 2.2], resolution=(20, 20)
        )
        surface.set_style(fill_opacity=0.6, stroke_color=BLUE_E, stroke_width=0.5)
        surface.set_fill_by_checkerboard(BLUE_D, BLUE_C, opacity=0.7)

        slide2_title = Title("Level Curves: $z = x^2 + y^2$").scale(0.8)
        self.add_fixed_in_frame_mobjects(slide2_title)

        self.play(Create(axes), Write(axes_labels))
        self.play(Create(surface), run_time=2)
        self.next_slide()  # <-- Pause for lecture explanation

        # Slicing Plane at k = 2
        h = 2.0
        plane = Surface(
            lambda u, v: axes.c2p(u, v, h),
            u_range=[-2.2, 2.2], v_range=[-2.2, 2.2], resolution=(10, 10)
        )
        plane.set_style(fill_opacity=0.35, fill_color=YELLOW, stroke_color=YELLOW, stroke_width=1)
        
        r = np.sqrt(2 * h)
        ring_3d = ParametricFunction(
            lambda t: axes.c2p(r * np.cos(t), r * np.sin(t), h),
            t_range=[0, TAU], color=YELLOW, stroke_width=4
        )
        ring_proj = ParametricFunction(
            lambda t: axes.c2p(r * np.cos(t), r * np.sin(t), 0),
            t_range=[0, TAU], color=YELLOW, stroke_width=3
        )

        self.play(FadeIn(plane), Create(ring_3d), run_time=1.5)
        self.next_slide()  # <-- Pause to show intersection ring

        self.play(TransformFromCopy(ring_3d, ring_proj), run_time=1.2)
        self.play(FadeOut(plane), run_time=0.8)
        
        self.begin_ambient_camera_rotation(rate=0.2)
        self.wait(2)
        self.stop_ambient_camera_rotation()
        self.next_slide()

        # -------------------------------------------------------------
        # Slide 3: Two-Path Test Visualization
        # -------------------------------------------------------------
        self.play(FadeOut(surface), FadeOut(ring_3d), FadeOut(ring_proj), FadeOut(slide2_title))
        
        slide3_title = Title("Two-Path Test: Non-Existence of Limits").scale(0.8)
        self.add_fixed_in_frame_mobjects(slide3_title)

        # Path 1: y = x (z = 0.5)
        path1 = ParametricFunction(lambda t: axes.c2p(t, t, 0.5), t_range=[0.05, 1.5], color=YELLOW, stroke_width=4)
        dot1 = Dot3D(point=axes.c2p(1.5, 1.5, 0.5), color=YELLOW, radius=0.08)
        label1 = MathTex("y = x \\implies z \\to 1/2", color=YELLOW).scale(0.65).to_corner(UL).shift(DOWN*0.8)
        self.add_fixed_in_frame_mobjects(label1)

        self.play(Create(path1), FadeIn(dot1), Write(label1))
        self.play(dot1.animate.move_to(axes.c2p(0.05, 0.05, 0.5)), run_time=2)
        self.next_slide()

        # Path 2: y = -x (z = -0.5)
        path2 = ParametricFunction(lambda t: axes.c2p(t, -t, -0.5), t_range=[0.05, 1.5], color=RED, stroke_width=4)
        dot2 = Dot3D(point=axes.c2p(1.5, -1.5, -0.5), color=RED, radius=0.08)
        label2 = MathTex("y = -x \\implies z \\to -1/2", color=RED).scale(0.65).next_to(label1, DOWN, aligned_edge=LEFT)
        self.add_fixed_in_frame_mobjects(label2)

        self.play(Create(path2), FadeIn(dot2), Write(label2))
        self.play(dot2.animate.move_to(axes.c2p(0.05, -0.05, -0.5)), run_time=2)
        self.next_slide()

        # Conclusion
        conclusion = MathTex("\\text{Different path limits } \\implies \\text{Limit DOES NOT EXIST!}", color=WHITE).scale(0.7).to_edge(DOWN)
        self.add_fixed_in_frame_mobjects(conclusion)
        self.play(Write(conclusion))
        self.wait(1)
