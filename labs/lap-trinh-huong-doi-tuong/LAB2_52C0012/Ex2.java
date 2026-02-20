class Ex2{
    public static void main(String args[]){
        int arr[] = {1, 99,3 ,4,23,12,3};
        System.out.print(findMin(arr));
    }
    public static int findMin(int arr[]){
        int i = 0;
        int min = arr[0];
        if (arr[i] < min) {
            min = arr[i];
        }   
        return min;
    }
}