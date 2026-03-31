public class Exercise3 {
    public static boolean checkPrime(int n, int d) {
        if (n < 2) return false;
        if (d > Math.sqrt(n)) return true; // Base case: đã kiểm tra hết ước
        if (n % d == 0) return false;      // Base case: tìm thấy ước
        return checkPrime(n, d + 1);       // Recursive case: tăng d lên
    }
    
    // Hàm gọi phụ trợ (người dùng chỉ cần truyền n)
    public static boolean isPrime(int n) {
        return checkPrime(n, 2);
    }
}
