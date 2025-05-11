
public class VegetableFactory {

    public static Vegetable getVegetable(String type) {
        switch (type) {
            case "carrot":
                return new Carrot(100); // Replace with logic to get weight
            case "cabbage":
                return new Cabbage("chinese", 10); // Replace with logic to get type
            case "pumpkin":
                return new Pumpkin(500); // Replace with logic to get weight
            default:
                throw new IllegalArgumentException("Invalid vegetable type: " + type);
        }
    }
}