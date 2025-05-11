public class Ex1{
    public static int findMax(int arr[]) {
        int i = 0;
        int max = arr[0];
        for(i = 0; i < arr.length; i++){
            if(arr[i] > max){
                max = arr[i];
            }
        }
        return max;
    }
    public static void main(String args[]){
        int[] arr = {1, 4, 5, 7 ,3 ,4};
        System.out.print(findMax(arr));
    }
}