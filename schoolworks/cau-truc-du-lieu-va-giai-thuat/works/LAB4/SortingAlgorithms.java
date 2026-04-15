public class SortingAlgorithms {

    // selection sort
    public static void selectionSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int min_idx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[min_idx])
                    min_idx = j;
            }
            int temp = a[min_idx];
            a[min_idx] = a[i];
            a[i] = temp;
        }
    }

    // bubble sort
    public static void bubbleSort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - i - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (a[j] > a[j + 1]) {
                    int temp = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = temp;
                }
            }
        }
    }

    // insertion sort
    public static void insertionSort(int[] a) {
        int n = a.length;
        for (int i = 1; i < n; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    // merge sort
    private static void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;

        int[] L = new int[n1];
        int[] R = new int[n2];
        for (int i = 0; i < n1; i++)
            L[i] = arr[l + i];
        for (int j = 0; j < n2; j++)
            R[j] = arr[m + 1 + j];

        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j])
                arr[k++] = L[i++];
            else
                arr[k++] = R[j++];
        }
        while (i < n1)
            arr[k++] = L[i++];
        while (j < n2)
            arr[k++] = R[j++];
    }

    public static void mergeSort(int[] arr, int first, int last) {
        if (first < last) {
            int middle = (first + last) / 2;
            mergeSort(arr, first, middle);
            mergeSort(arr, middle + 1, last);
            merge(arr, first, middle, last);
        }
    }

    // quick sort
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    // helpers
    public static void printArray(int[] a) {
        for (int x : a)
            System.out.print(x + " ");
        System.out.println();
    }

    public static int[] sample() {
        return new int[] { 64, 25, 12, 22, 11 };
    }

    // main
    public static void main(String[] args) {
        System.out.println("Selection Sort: ");
        int[] a = sample();
        System.out.print("Before: ");
        printArray(a);
        selectionSort(a);
        System.out.print("After: ");
        printArray(a);

        System.out.println("Bubble Sort: ");
        int[] b = sample();
        System.out.print("Before: ");
        printArray(b);
        bubbleSort(b);
        System.out.print("After: ");
        printArray(b);

        System.out.println("Insertion Sort: ");
        int[] c = sample();
        System.out.print("Before: ");
        printArray(c);
        insertionSort(c);
        System.out.print("After: ");
        printArray(c);

        System.out.println("Merge Sort: ");
        int[] d = sample();
        System.out.print("Before: ");
        printArray(d);
        mergeSort(d, 0, d.length - 1);
        System.out.print("After: ");
        printArray(d);

        System.out.println("Quick Sort: ");
        int[] e = sample();
        System.out.print("Before: ");
        printArray(e);
        quickSort(e, 0, e.length - 1);
        System.out.print("After: ");
        printArray(e);
    }

}
