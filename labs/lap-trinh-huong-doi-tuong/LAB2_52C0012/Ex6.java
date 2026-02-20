public class Ex6 {
    public static void main(String[] args) {
        int k = 5;
        int arr[] = {4 ,3, 5, 12,3};
        System.out. println(find(arr, k));
    }
    public static int find(int arr[], int k){
        int i;
        for (i = 0; i<  arr.length; i++){
            if (arr[i] == k) {
                return i;
            }
        }
        return -1;
    }
}
