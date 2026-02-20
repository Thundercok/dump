import java.util.Scanner;

public class Ex12 {

  public static void main(String[] args) {
    Scanner input = new Scanner(System.in);
    int n = input.nextInt();
    input.close();
    int reversedNumber = reverseInteger(n);
    System.out.println("The reversed integer: " + reversedNumber);
  }

  public static int reverseInteger(int n) {
    int reversedNum = 0;
    int digit = 0;

    while (n > 0) {
      digit = n % 10;
      reversedNum = reversedNum * 10 + digit;
      n /= 10;
    }

    return n < 0 ? -reversedNum : reversedNum;
  }
}
