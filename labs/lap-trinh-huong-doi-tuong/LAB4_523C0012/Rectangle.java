public class Rectangle{
    private float width = 1.0f;
    private float length = 1.0f;
    
    public Rectangle(){
    }
    public Rectangle(float width, float length){
        this.width = width;
        this.length = length;
    }
    public float getWidth(){
        return width;
    }
    public float getLength(){
        return length;
    }
    public float getArea(){
        float area = width*length;
        return area;
    }
    public float perimeter(){
        float perimeter = (width+ length)*2;
        return perimeter;
    }
    public void setWidth(float width){
        this.width =width;
    }
    public void setLength(float length){
        this.length = length;
    }

    @Override
    public String toString() {
        return "Rectangle [width:" + width + ", length:" + length + "]";
    }

    public static void main(String[] args) {
        Rectangle rectangle1 = new Rectangle(4, 5);
        System.out.println(rectangle1);
    }

}