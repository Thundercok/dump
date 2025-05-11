import java.util.ArrayList;

class Point {
    private double x;
    private double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    // Getters and setters

    public double distanceToOrigin() {
        return Math.sqrt(x * x + y * y);
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

public class Exercise2 {
    public static ArrayList<Point> pointsInsideCircle(ArrayList<Point> points) {
        ArrayList<Point> result = new ArrayList<>();
        for (Point p : points) {
            if (p.distanceToOrigin() <= 1) {
                result.add(p);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        ArrayList<Point> points = new ArrayList<>();
        points.add(new Point(0.5, 0.5));
        points.add(new Point(1.2, 0.8));
        points.add(new Point(-0.3, -0.7));

        ArrayList<Point> pointsInside = pointsInsideCircle(points);
        System.out.println("Points inside the circle:");
        for (Point p : pointsInside) {
            System.out.println(p);
        }
    }
}
