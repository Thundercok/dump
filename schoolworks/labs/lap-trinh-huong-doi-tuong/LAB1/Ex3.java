import java.util.*;

public class Ex3 {
    public static void main(String[] args) {
        Scanner Input = new Scanner(System.in);
        int a = Input.nextInt(), b = Input.nextInt();
        Input.close();
        System.out.println("Confirm a = " + a + " & b = " + b);

        System.out.println( a + " % " + b + " = " + Remainder(a, b));
    }
    static int Remainder(int a, int b) {
        return a % b;
    }
}