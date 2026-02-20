public class Point{
    private float x = 0.0f;
    private float y = 0.0f;
    
    public Point(){
    }
    public Point(float x, float y){
        this.x = x;
        this.y = y;
    }

    public float getX(float x){
        return x;
    }

    public float getY(float y){
        return y;
    }
    @Override

    public String toString(){
        return "Point [x =" + x + ", y =" + y +"]";
    }
    public static void main(String[] args)   {
        Point point1 = new Point(5, 6);
        System.out.print(point1);
    }
}