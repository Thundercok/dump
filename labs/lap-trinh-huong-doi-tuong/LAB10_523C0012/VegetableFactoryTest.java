
public class VegetableFactoryTest {
    public 
    static void main(String[] args) {
        // Example usage
        Vegetable carrot = VegetableFactory.getVegetable("carrot");
        System.out.println(carrot.getInfo());

        Vegetable cabbage = VegetableFactory.getVegetable("cabbage");
        System.out.println(cabbage.getInfo());

        Vegetable pumpkin = VegetableFactory.getVegetable("pumpkin");
        System.out.println(pumpkin.getInfo());
    }
}