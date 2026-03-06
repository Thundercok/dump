public class SortingAlgorithms {
    // Helper method to print the array exactly as the lab requests
    public static void printArray(int[] arr) {
        for (int num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }

    // Selection Sort: choose minimum element
    public static void selectionSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;
            // Find the minimum element in unsorted array
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[minIndex]) {
                    minIndex = j;
                }
            }
            // Swap the found minimum element with the first element
            int temp = a[minIndex];
            a[minIndex] = a[i];
            a[i] = temp;

            // Print state before the outer loop completes
            printArray(a);
        }
    }

    // Bubble Sort: "bubbling up" the largest element
    public static void bubbleSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (a[j] > a[j + 1]) {
                    // Swap adjacent elements if they are in the wrong order
                    int temp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = temp;
                }
            }
            // Print state before the outer loop completes
            printArray(a);
        }
    }

    // Insertion Sort: insert the number to the left partition
    public static void insertionSort(int[] a) {
        int n = a.length;
        // Start from the second element (index 1)
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;

            // Move elements of a[0..i-1], that are greater than key,
            // to one position ahead of their current position
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j = j - 1;
            }
            a[j + 1] = key; // Insert the key

            // Print state before the outer loop completes
            printArray(a);
        }
    }

    public static void main(String[] args) {
        // 1. Testing Selection Sort [cite: 110]
        int[] arrSelection = { 3, 1, 4, 6, 2, 5 };
        System.out.println("Selection Sort With array a={3, 1, 4, 6, 2, 5}");
        selectionSort(arrSelection);

        // 2. Testing Bubble Sort [cite: 113]
        int[] arrBubble = { 5, 3, 4, 2, 6, 1 };
        System.out.println("\nBubble Sort With array a={5, 3, 4, 2, 6, 1}");
        bubbleSort(arrBubble);

        // 3. Testing Insertion Sort [cite: 115]
        int[] arrInsertion = { 5, 1, 2, 6, 4, 3 };
        System.out.println("\nInsertion Sort - With array a={5, 1, 2, 6, 4, 3}");
        insertionSort(arrInsertion);
    }
}
