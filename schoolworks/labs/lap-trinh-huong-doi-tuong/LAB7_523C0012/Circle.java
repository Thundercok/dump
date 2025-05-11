public interface Resizable {
    void resize(double percent);
}

public class Circle extends Shape implements Resizable {
    private double radius;

    public Circle(double radius, String color) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void resize(double percent) {
        radius *= (1 + percent / 100);
    }
}

public class Rectangle extends Shape implements Resizable {
    private double length;
    private double width;

    public Rectangle(double length, double width, String color) {
        super(color);
        this.length = length;
        this.width = width;
    }

    @Override
    public double getArea() {
        return length * width;
    }

    @Override
    public void resize(double percent) {
        length *= (1 + percent / 100);
        width *= (1 + percent / 100);
    }
}
