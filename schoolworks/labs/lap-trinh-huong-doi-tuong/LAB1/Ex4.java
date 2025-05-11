import java.util.Scanner;

public class Ex4 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        
        System.out.println("Input F: ");
        int F = input.nextInt();
        input.close();
        int C = FtoC(F);
        System.out.println(F + " Fahrenheit equals " + C + " Celsius");
    }
    static int FtoC(int F){
        return (int) ((F  - 32) / 1.8);
    }
}