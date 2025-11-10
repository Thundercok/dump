public class Exercise2 {
    // (a) Giai thừa đệ quy
    public static int factorial(int n) {
        if (n == 0) return 1; // Base case
        return n * factorial(n - 1); // Recursive case
    }

    // (b) Tính x mũ n
    public static int power(int x, int n) {
        if (n == 0) return 1;
        return x * power(x, n - 1);
    }

    // (c) Đếm số chữ số
    public static int countDigits(int n) {
        if (n < 10) return 1;
        return 1 + countDigits(n / 10);
    }

    // (d) Tìm GCD (Euclid đệ quy)
    public static int findGCD(int a, int b) {
        if (b == 0) return a;
        return findGCD(b, a % b);
    }
}
