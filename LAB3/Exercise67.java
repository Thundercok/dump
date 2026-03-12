public class ArrayExercises {
    // --- Exercise 6: Iteration ---
    
    // (a) Tìm Min
    public static int findMinIter(int[] a, int n) {
        int min = a[0];
        for (int i = 1; i < n; i++) {
            if (a[i] < min) min = a[i];
        }
        return min;
    }

    // (b) Tính tổng
    public static int sumIter(int[] a, int n) {
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += a[i];
        }
        return sum;
    }

    // (c) Đếm số chẵn
    public static int countEvenIter(int[] a, int n) {
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (a[i] % 2 == 0) count++;
        }
        return count;
    }

    // --- Exercise 7: Recursion ---
    
    // (a) Tìm Min đệ quy
    public static int findMinRec(int[] a, int n) {
        if (n == 1) return a[0]; // Base case: mảng chỉ có 1 phần tử
        int minOfRest = findMinRec(a, n - 1);
        return Math.min(a[n - 1], minOfRest);
    }

    // (b) Tính tổng đệ quy
    public static int sumRec(int[] a, int n) {
        if (n == 0) return 0; // Base case: mảng rỗng
        return a[n - 1] + sumRec(a, n - 1);
    }

    // (c) Đếm số chẵn đệ quy
    public static int countEvenRec(int[] a, int n) {
        if (n == 0) return 0;
        int checkCurrent = (a[n - 1] % 2 == 0) ? 1 : 0;
        return checkCurrent + countEvenRec(a, n - 1);
    }
}
