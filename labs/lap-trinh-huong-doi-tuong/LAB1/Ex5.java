import java.util.Scanner;

class Ex5 {
    public static void main(String[] args) {
        Scanner Input = new Scanner(System.in);
        int year = Input.nextInt();
        System.out.println("Confirm year: " + year);
        Input.close();
        if (leapYearCheck(year) == true) {
            System.out.println("\nThe year " + year + " is a leap year");
        }   else {
            System.out.println("\nThe year " + year + " is not a leap year");
        }
    }
    static boolean leapYearCheck(int year) {
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }
}
