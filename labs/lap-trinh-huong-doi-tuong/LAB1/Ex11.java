import java.util.Scanner;public class Ex11 {

    public static void main(String[] args) {
   System.out.println("\nInput n: ");
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        input.close();
        int count = DigitCounts(n);
        System.out.println("The number of digits in n is: " + n + " is: " + count);
    }


    public static int DigitCounts(int n) {
      int i = 0;
      for(i = 0; i < n; i++) {
          n /= 10;
        }
      return i;
    }
}