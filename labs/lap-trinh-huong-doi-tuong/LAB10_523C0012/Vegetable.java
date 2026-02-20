// Vegetable interface
public interface Vegetable {
    String getInfo();
}

// Concrete vegetable classes
class Carrot implements Vegetable {
    private double weight;

    public Carrot(double weight) {
        this.weight = weight;
    }

    @Override
    public String getInfo() {
        return "Carrot: " + weight + "g";
    }
}

class Cabbage implements Vegetable {
    private String type;
    private double weight;
    public Cabbage(String type, double weight) {
        this.type = type;
        this.weight = weight;
    }




    @Override
    public String getInfo() {
        return "Cabbage: " + type +" "+ weight + "g";
    }
}

class Pumpkin implements Vegetable {
    private double weight;

    public Pumpkin(double weight) {
        this.weight = weight;
    }

    @Override
    public String getInfo() {
        return "Pumpkin: " + weight + "g";
    }
}
