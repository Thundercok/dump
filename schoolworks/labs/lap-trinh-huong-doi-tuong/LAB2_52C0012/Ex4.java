public class Ex4 {
    public static int countFrequency(int k,int arr[]){
        int i;
        int result = 0;
        for( i = 0; i < arr.length; i++) {
            if (arr[i] ==k) {
                result += 1;
            }
        }
        return result;
    }
    public static void main(String[] args) {
        int[] arr = {1, 4, 3, 2 ,1, 23, 4};
        int k = 4;
        System.out.print(countFrequency(k, arr));
    }
}
