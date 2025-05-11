import java.util.Scanner;

 class Ex2 {
     public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("\nInput height & base:  ");

        int height = input.nextInt(), base = input.nextInt();
        input.close();
        int area = (int) ((0.5) * base * height);
        System.out.println("\nCalculated area: " + area);

    }
}