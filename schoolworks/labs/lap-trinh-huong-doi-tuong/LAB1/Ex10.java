import java.util.Scanner;

public class Ex10 {

    public static void main(String[] args) {
   System.out.println("\nInput n: ");
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        input.close();
        int sum = sumFirstAndLastDigit(n);
        System.out.println("The sum of the first and last digits of " + n + " is: " + sum);
    }


    public static int sumFirstAndLastDigit(int n) {
        if (n < 0) {
        n *= -1;
        }
        int firstDigit = n / (int) Math.pow(10, Integer.toString(n).length() - 1);
        int lastDigit = n % 10;
        return firstDigit + lastDigit;
  }
}