public class  Ex7  {
    public static void main(String args[]){

        int i = 0;
        int arr[] = {2,3,4,54,3,2};
        square(arr);
        for( i = 0; i < arr.length; i++){
            System.out.print(arr[i] + " ");
        }
    }
    public static void square(int arr[]){
        int i;
        for(i = 0; i < arr.length; i++){
            arr[i] *= arr[i];
        }
    }
}