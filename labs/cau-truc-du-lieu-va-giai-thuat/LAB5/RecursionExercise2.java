public class RecursionExercise2 {

    // 2(a) Recursive
    public static double sumA_recur(int n) {
        if (n == 0) {
            return 1.0 / 2.0; // Base case: when x = 0, (0+1)/2
        }
        return (n + 1) / 2.0 + sumA_recur(n - 1);
    }

    // 2(a) Iterative
    public static double sumA_iter(int n) {
        double sum = 0;
        for (int x = 0; x <= n; x++) {
            sum += (x + 1) / 2.0;
        }
        return sum;
    }

    // 2(b) Recursive
    public static int sumB_recur(int n) {
        if (n == 1) {
            return 2; // Base case: 2^1 = 2
        }
        if (n < 1) {
            return 0; // Safeguard
        }
        return (int) Math.pow(2, n) + sumB_recur(n - 1);
    }

    // 2(b) Iterative
    public static int sumB_iter(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += (int) Math.pow(2, i);
        }
        return sum;
    }
    // --- 2(c): Sum of i ---

    // 2(c) Recursive
    public static int sumC_recur(int n) {
        if (n == 1) {
            return 1; // Base case
        }
        return n + sumC_recur(n - 1);
    }

    // 2(c) Iterative
    public static int sumC_iter(int n) {
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        return sum;
    }

    // --- 2(d): Sum of x*(x-1) ---

    // 2(d) Recursive
    public static int sumD_recur(int n) {
        if (n == 1) {
            return 0; // Base case: 1 * (1 - 1) = 0
        }
        return (n * (n - 1)) + sumD_recur(n - 1);
    }

    // 2(d) Iterative
    public static int sumD_iter(int n) {
        int sum = 0;
        for (int x = 1; x <= n; x++) {
            sum += x * (x - 1);
        }
        return sum;
    }

    // --- 2(e): Product of x (Factorial) ---

    // 2(e) Recursive
    public static long prodE_recur(int n) {
        if (n <= 1) {
            return 1; // Base case: product of 1 is 1
        }
        return n * prodE_recur(n - 1);
    }

    // 2(e) Iterative
    public static long prodE_iter(int n) {
        long product = 1; // Start at 1 for multiplication!
        for (int x = 1; x <= n; x++) {
            product *= x;
        }
        return product;
    }
}
