import java.util.Scanner;

public class Ex9{

    public static void main(String[] args) {
    System.out.println("\nInput n: ");
    Scanner input = new Scanner(System.in);
    int n = input.nextInt();
    input.close();
    System.out.println("\nHailstone sequence of n: ");
    hailstoneSequence(n);
    }
      
    public static void hailstoneSequence(int n) {   
        while (n != 1) {
            System.out.print(n + " ");
            if (n % 2 == 0) {
              n /= 2;
        } else {
            n = 3 * n + 1;
            }
        }
    System.out.println(n);
    }
}