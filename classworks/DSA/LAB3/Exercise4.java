public class Exercise4 {
    // (a) Sum 2i + 1
    public static int sumA(int n) {
        if (n == 1) return 3; // (2*1 + 1)
        return (2 * n + 1) + sumA(n - 1);
    }

    // Helper cho giai thừa (dùng lại của Ex2)
    public static int fact(int n) {
        if (n == 0) return 1;
        return n * fact(n - 1);
    }

    // (b) Sum của giai thừa: 1! + 2! + ... + n!
    public static int sumFact(int n) {
        if (n == 1) return 1;
        return fact(n) + sumFact(n - 1);
    }

    // (c) Tích của giai thừa: 1! * 2! * ... * n!
    public static int prodFact(int n) {
        if (n == 1) return 1;
        return fact(n) * prodFact(n - 1);
    }

    // (d) P(n, r) = n(n-1)...(n-r+1)
    public static int calP(int n, int r) {
        if (r == 0) return 1; // Hoặc điều kiện n < r tùy đề bài "otherwise"
        if (n < r) return 1;  // Theo đề bài
        return n * calP(n - 1, r - 1);
    }

    // (e) Công thức truy hồi: u(n) = 2^n + n^2 + u(n-1)
    public static int calExpression(int n) {
        if (n == 1) return 3;
        return (int)Math.pow(2, n) + (n * n) + calExpression(n - 1);
    }
}
