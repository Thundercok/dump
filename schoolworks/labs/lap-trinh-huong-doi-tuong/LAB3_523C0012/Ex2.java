import java.util.Scanner;

public class Ex2{

    public static void addArray(int a[][],int b[][], int sum[][],
    int row, int collumn){
        int i, j;
    for (i = 0; i < row; i++)
        for (j = 0; j < collumn; j++)
            sum[i][j] = a[i][j] + b[i][j];
    }

    public static void mupArray(int a[][], int x, int mup[][],
    int row, int collumn){
        int i, j;
    for (i = 0; i < row; i++)
        for (j = 0; j < collumn; j++)
            mup[i][j] = a[i][j] * x;
    }

    public static void printArray(int b[][], int row, int collumn){
        int i, j;
    System.err.println("Printing a matrix(2) in matrix format: ");
    for (i = 0; i < row; i++){
        for (j = 0; j < collumn; j++)
            System.out.print(b[i][j] + "\t");
        System.out.println();
    }
    }

    public static void main(String[] args){
        int i, j, collumn, row;
    Scanner sc = new Scanner(System.in);
    
    //Collumn
    System.out.print("Inputw collumn of 2 matrix: ");
    collumn = sc.nextInt();

    //Row
    System.out.print("Input row of 2 matrix: ");
    row = sc.nextInt();

    //Create 2 matrix;
    int[][] a = new int[row][collumn];
    int[][] b = new int[row][collumn];
    int[][] sum = new int[row][collumn];
    int[][] mup = new int[row][collumn];

    //Input Matrix1
    System.err.println("Input element of the first matrix(1): ");
    for (i = 0; i < row; i++)
        for (j = 0; j < collumn; j++)
            a[i][j] = sc.nextInt();
    
    //Input Matrix2
    System.err.println("Input element of the second matrix(2): ");
    for (i = 0; i < row; i++)
        for (j = 0; j < collumn; j++)
            b[i][j] = sc.nextInt();
    
    //Output sum
    addArray(a, b , sum, row, collumn);
    System.err.println("Sum of two same size matrix: ");
    for (i = 0; i < row; i++){
        for (j = 0; j < collumn; j++)
            System.out.print(sum[i][j] + "\t");
        System.out.println();
    }

    //Output mup
    System.out.print("Input number to muptiply with matrix: ");
    int x = sc.nextInt();
    mupArray(a, x, mup, row, collumn);
    System.err.println("Muptiply of matrix(1) with a number : ");
    for (i = 0; i < row; i++){
        for (j = 0; j < collumn; j++)
            System.out.print(mup[i][j] + "\t");
        System.out.println();
    }

    printArray(b, row, collumn);
    }
}