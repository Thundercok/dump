public class RecursionExericse3 {
    // 3(a) Recursive
    public static double funcA_recur(int n) {
        if (n == 0) {
            return 2.0;
        }
        return 2.0 - (0.5 * funcA_recur(n - 1));
    }

    // 3(a) Iterative
    public static double funcA_iter(int n) {
        double result = 2.0; // Base case value
        for (int i = 1; i <= n; i++) {
            result = 2.0 - (0.5 * result);
        }
        return result;
    }

    // 3(b) Recursive
    public static int funcB_recur(int n) {
        if (n < 10) {
            return 1;
        }
        return 1 + funcB_recur(n / 10);
    }

    // 3(b) Iterative
    public static int funcB_iter(int n) {
        int count = 1;
        while (n >= 10) {
            count++;
            n /= 10;
        }
        return count;
    }

    // 3(c) Recursive
    public static int funcC_recur(int n, int k) {
        if (k == 1) {
            return n;
        }
        return n + funcC_recur(n, k - 1);
    }

    // 3(c) Iterative
    public static int funcC_iter(int n, int k) {
        int sum = n;
        // Loop starts at 2 because we already accounted for the first 'n'
        for (int i = 2; i <= k; i++) {
            sum += n;
        }
        return sum;
    }

    // 3(d) Recursive
    public static int funcD_recur(int n) {
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        return funcD_recur(n - 1) + funcD_recur(n - 2);
    }

    // 3(d) Iterative
    public static int funcD_iter(int n) {
        if (n == 0)
            return 0;
        if (n == 1)
            return 1;

        int prev2 = 0; // F(0)
        int prev1 = 1; // F(1)
        int current = 0;

        for (int i = 2; i <= n; i++) {
            current = prev1 + prev2; // F(n-1) + F(n-2)
            prev2 = prev1; // Shift values up for the next loop
            prev1 = current;
        }
        return current;
    }
}
