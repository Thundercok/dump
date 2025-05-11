public interface Movable {
    void moveUp();
    void moveDown();
    void moveLeft();
    void moveRight();
}

public class Point implements Movable {
    private double x;
    private double y;
    private double xSpeed;
    private double ySpeed;

    public Point(double x, double y, double xSpeed, double ySpeed) {
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    @Override
    public void moveUp() {
        y += ySpeed;
    }

    @Override
    public void moveDown() {
        y -= ySpeed;
    }

    @Override
    public void moveLeft() {
        x -= xSpeed;
    }

    @Override
    public void moveRight() {
        x += xSpeed;
    }
}
