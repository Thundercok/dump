import java.util.Scanner;
public class MyArray{

    public static int maxEven(int a[]){
        int max = a[0];
        for (int i = 1; i < a.length; i++){
            if (a[i] % 2 == 0){
                if (a[i] > max){
                    max = a[i];
                }
            }
        }
        return max;
    }
    public static int minOdd(int a[]){
        int min = a[0];
        for (int i = 1; i < a.length; i++){
            if (a[i] % 2 != 0){
                if (a[i] < min){
                    min = a[i];
                }
            }
        }
        return min;
    }

    public static int sumEven(int[] a){
        int sum = 0;
        for (int i = 0; i < a.length; i ++){
            if (a[i] % 2 == 0){
                sum += a[i];
            }
        }
        return sum;
    }

    public static int prodOdd(int[] a){
        int prod = 1;
        for (int i = 0; i < a.length; i ++){
            if (a[i] % 2 != 0){
                prod *= a[i];
            }
        }
        return prod;
    }
    
    public static int idxFirstEven(int a[]){

        for (int i = 0; i < a.length; i++)
            if (a[i] % 2 == 0)
                return i;
        return -1;
    }

    public static int idxLastOdd(int a[]){

        int pos = -1;
        for (int i = 0; i < a.length; i++)
            if (a[i] % 2 != 0)
                pos = i;
        return pos;
    }

    public static int[] input(int n){
        Scanner sc = new Scanner(System.in);

        int a[] = new int[n];
        for (int i = 0; i < a.length; i++){
            System.out.printf("input a[%d]: ", i);
            a[i] = sc.nextInt();
        }
        sc.close();

        return a;
    }

    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);

        System.err.print("Input n: ");
        int n = sc.nextInt();
        int a[] = input(n);

        System.out.printf("Greatest even number in the array: %d\n", maxEven(a));
        System.out.printf("Smallest odd number in the array: %d\n", minOdd(a));
        System.out.printf("Sum of the greatest even number and the smallest odd number in the array: %d\n", maxEven(a) + minOdd(a));
        System.out.printf("Sum of even number in the array: %d\n", sumEven(a));
        System.out.printf("Product of odd number in the array: %d\n", prodOdd(a));
        System.out.printf("First even index is: %d\n", idxFirstEven(a));
        System.out.printf("Last odd index is: %d\n", idxLastOdd(a));
        System.out.printf("New array: ");
        sc.close();
        for (int i = 0; i < n; i++)
            System.out.printf("%d ", a[i]);
    }
}