public class Problem1 {

    public static double calcS(int n) {
        if (n == 1) {
            return 1.0;
        }
        return (1.0 / n) + calcS(n - 1);
    }

    public static void main(String[] args) {
        int n = 4;
        double result = calcS(4);
        System.out.println("The exact value of S(4) as a fraction is 25/12.");

        // Print results
        System.out.println("The computed value of S(" + n + ") as a decimal is: " + result);

        System.out.println("25.0 / 12.0 is: " + (25.0 / 12.0));
    }
}
