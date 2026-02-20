public class Ex5 {
    
    public static void main(String[] args) {
        int[] arr ={1,3,4,2,4,2,1,55,22,7,11};
        System.out.print(countPrimeNum(arr));
    }
    public static int countPrimeNum(int arr[]){
        int count = 0;
        for (int n = 0; n< arr.length; n++) {
            if (n < 2) 
                continue;
        boolean isPrime = true;
        for (int i = 2; i *i <= n; i++){
            if (n % i == 0) 
               isPrime = false;
            isPrime = true;
        }
            if(isPrime)
            count++;
        }
        return count;
    }
    
}
