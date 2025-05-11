import java.util.Scanner;

public class Ex8 {
    
    public static void main( String[] args) {
        System.out.println("\nInput n: ");
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        input.close();
        System.out.println("\nResults: ");
        System.out.println("a. " + functionA(n));
        System.out.println("b. " + functionB(n));
        System.out.println("c. " + functionC(n));
        System.out.println("d. " + functionD(n));
        System.out.println("e. " + functionE(n));
    }

    public static int functionA(int n) {
        return  n * (1 + n) / 2;
    }

    public static int functionB(int n){
        int S = 1;
        for( int i = 1; i <= n; i++) {
            S *= i;
        }   
        return S;
    }
    public static int functionC (int n){
        int S = 1;
        for( int i = 1; i <= n; i++) {
            S += (1/2*i);
        }   
        return S;
    } public static int functionD (int n){
        int S = 1;
        for( int i = 1; i <= n; i++) {
            S += Math.pow(2, i);
        }   
        return S;
    }
    public static int functionE (int n){
        return (n*(n+1)*(2*n+1));
    }
}
