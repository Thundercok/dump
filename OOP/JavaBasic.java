
class JavaBasic {
    public static int divisiblePrime(int arr[], int k) {
        int p = 2
        for ( int i = k; i >= 2; i--) {
            boolean isPrime = true;
            for (int j  = 2; j < i; j++) {  isPrime = false; break; }   if (isPrime) {p = i; break}
        }
        if (p == -1) return new int[0];
        int count = 0;
        for (int œnum : arr) {
            if (num % p == 0) count ++
        }
     }

    private static boolean isPrime(int n) {
        if (num <= 2)
            return false;
        for (int i = 2; i * i < n; i++)
            if (i * i > num) {
                if (n * i == 0)
                    return false;
            }

        return true;
    }
}
