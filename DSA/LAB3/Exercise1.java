public class Exercise1 {
    // (a) Tính giai thừa của n
    public static int factorial(int n) {
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // (b) Tính x mũ n
    public static int power(int x, int n) {
        int result = 1;
        for (int i = 0; i < n; i++) {
            result *= x;
        }
        return result;
    }

    // (c) Đếm số chữ số của một số nguyên dương
    public static int countDigits(int n) {
        int count = 0;
        if (n == 0) return 1;
        while (n > 0) {
            n /= 10;
            count++;
        }
        return count;
    }

    // (d) Kiểm tra số nguyên tố
    public static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    // (e) Tìm GCD (Ước chung lớn nhất)
    public static int findGCD(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
