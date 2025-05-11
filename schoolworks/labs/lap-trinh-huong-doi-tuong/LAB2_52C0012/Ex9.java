public class Ex9 {
    public static void main(String args[]) {
        int i = 0;
        int arr[] = {1,3,4,5,6};
        int k = 4;
        int result[] = divisibleNumbers(arr, k);
        for(i = 0;i<arr.length;i++){
            System.out.print(result[i] + " ");
        }
        System.out.println("\n ");
    }
    public static int[] divisibleNumbers(int[] arr,int k){
        int count = 0;
        int  i = 0;
        for (i = 0; i <arr.length;i++){
            if(i % k == 0) {
                count++;
            }
        }
        int result[] = new int[count];
        int index = 0;
        for(i = 0; i < arr.length;i++) {
            if(i% k ==0 ){
                result[index++] = i;
            }
        }
        return result;
    }
}
