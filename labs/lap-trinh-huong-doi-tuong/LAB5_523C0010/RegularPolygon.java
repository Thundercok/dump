public class RegularPolygon {
    private String name;
    private int EdgeAmount;
    private double EdgeLength;

    public RegularPolygon(){
        name = "";
        EdgeAmount = 3;
        EdgeLength = 1;
    }

    public RegularPolygon(String name, int EdgeAmount, double EdgeLength){
        this.name = name;
        this.EdgeAmount = EdgeAmount;
        this.EdgeLength = EdgeLength;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEdgeAmount(int edgeAmount) {
        EdgeAmount = edgeAmount;
    }

    public void setEdgeLength(double edgeLength) {
        EdgeLength = edgeLength;
    }

    public String getName() {
        return name;
    }

    public int getEdgeAmount() {
        return EdgeAmount;
    }
    
    public double getEdgeLength() {
        return EdgeLength;
    }

    public String getPolygon(){
        if (EdgeAmount == 3)
            return "Is Triangle";
        if (EdgeAmount == 4)
            return "Is Quadrangle";
        if (EdgeAmount == 5)
            return "Is Pentagon";
        if (EdgeAmount == 6)
            return "Is Hexagon";
        return "Polygon has the number of  edges greater than 6";
    }

    public double getPerimeter(){
        return EdgeAmount * EdgeLength;
    }

    public double getArea(){
        double a = 0;
        if (EdgeAmount == 3){
            a = 0.433;
        }
        if (EdgeAmount == 4){
            a = 1;
        }
        if (EdgeAmount == 5){
            a = 1.72;
        }
        if (EdgeAmount == 6){
            a = 2.595;
        }
        return EdgeLength * EdgeLength * a;
    }

    public String toString(){
        return name + " - " + getPolygon() + " - " + EdgeLength;
    }

}
