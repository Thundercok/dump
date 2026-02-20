public class Ex3 {
    public static void main(String args[]) {
        int[] arr = {1, 3, 4, 2};
        System.out.print(sumEven(arr));
    }
    public static int sumEven(int[] arr){
        int i = 0;
        int sum = arr[0];
        for(i = 1; i < arr.length; i++){
            if (arr[i] %2 == 0) {
                sum += arr[i];
            }
        }
        return sum;
    }
}
