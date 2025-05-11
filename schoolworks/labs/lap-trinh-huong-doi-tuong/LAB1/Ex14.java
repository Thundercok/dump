import java.util.Scanner;

public class Ex14 {

    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String[] products = {"Coca", "Pepsi", "Sprite", "Snack"};
        int[] prices = {10, 10, 10, 10};
        while (true) {
            for (int i = 0; i < products.length; i++) {
                System.out.println((i + 1) + ". " + products[i] + " (" + prices[i] + "k)");
            }
            System.out.println("5. Shutdown Machine");

            System.out.print("Enter your choice: ");
            int choice = input.nextInt();

            switch (choice) {
                case 1:
                case 2:
                case 3:
                case 4:
                    int selectedProduct = choice - 1;
                    System.out.print("Enter money (kvnd): ");
                    int money = input.nextInt();
                    if (money >= prices[selectedProduct]) {
                        System.out.println("\nDispensing " + products[selectedProduct]);
                        int change = money - prices[selectedProduct];
                        if (change > 0) {
                            System.out.println("Change: " + change + "k");
                        }
                    } else {
                        System.out.println("Insufficient funds.");
                    }
                    break;
                case 5:
                    System.out.println("Machine shutting down.");
                    return;
                default:
                    System.out.println("Invalid choice.");
            }        
        }
    }
}
