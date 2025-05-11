import java.util.Scanner;

public class Ex13 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        input.close();
        boolean isPalindrome = isPalindrome(n);
        System.out.println(n + " is " + (isPalindrome ? "a palindrome" : "not a palindrome"));
      }
    
    public static boolean isPalindrome(int n) {
        int reversedNumber = 0;
        int originalNumber = n;
        while (n > 0) {
        int digit = n % 10;
        reversedNumber = reversedNumber * 10 + digit;
        n /= 10;
        }
    return originalNumber == reversedNumber;
    }
}


