public class Exercise5 {
    public static int decToBin(int n) {
        if (n == 0) return 0;
        // Công thức: (Kết quả của phần nguyên chia 2) * 10 + (phần dư)
        // Ví dụ: 5 -> (10) * 10 + 1 = 101
        return decToBin(n / 2) * 10 + (n % 2);
    }
}
