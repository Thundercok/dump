public class RecursionExercise1 {

    // Exercise 1(a): Product of 2 numbers
    public static double prod_recur(int a, int b) {
        // Base case
        if (b == 0) {
            return 0;
        }

        // Handling negative 'b' just to be safe and avoid infinite loops
        if (b < 0) {
            return -prod_recur(a, -b);
        }

        // Recursive step: a + (a * (b-1))
        return a + prod_recur(a, b - 1);
    }

    // Exercise 1(b): Binary to Decimal
    public static int bin2dec(int n, int exp) {
        // Base case: no more digits left to process
        if (n == 0) {
            return 0;
        }

        // Extract the last digit (it will be either a 0 or a 1)
        int lastDigit = n % 10;

        // Calculate the value of this digit and add it to the result of the rest
        return (int) (lastDigit * Math.pow(2, exp)) + bin2dec(n / 10, exp + 1);
    }

    // Exercise 1(c): Find the largest digit in a positive integer n
    public static int maxDigit(int n) {
        // Base case: if it's a single digit, return it
        if (n < 10) {
            return n;
        }

        // Extract the last digit
        int lastDigit = n % 10;

        // Recursively find the max digit in the remaining number
        int maxOfRest = maxDigit(n / 10);

        // Return the larger of the two
        return Math.max(lastDigit, maxOfRest);
    }

    // Exercise 1(d): Find the largest element in an array a
    public static int maxElement(int[] a, int n) {
        // Base case: if there's only one element, it's the max
        if (n == 1) {
            return a[0];
        }

        // Recursively find the max of the array minus the last element
        int maxOfRest = maxElement(a, n - 1);

        // Return the larger of the current element and the max of the rest
        return Math.max(a[n - 1], maxOfRest);
    }

    // Exercise 1(e): Find the position of the key in an array a
    public static int search(int[] a, int n, int key) {
        // Base case 1: array is fully searched, key not found
        if (n == 0) {
            return -1;
        }

        // Base case 2: key is found at the current last position
        if (a[n - 1] == key) {
            return n - 1;
        }

        // Recursive step: search in the remaining part of the array
        return search(a, n - 1, key);
    }
}
