public class Ex10 {
    public static void main(String[] args) {
        int[] arr = {1,35,3,2,4,3,2,11,23};
        int i = 0;
       
        System.out.print(thirdLargest(arr));
        
    }
    public static int thirdLargest(int[] arr) {
        int n1 = 0;
        int n2 = 0;
        int i = 0;
        int n3 = 0;
        for(i = 0; i< arr.length; i++){
            if(i > n3) {
                n3 = i;
            }   else if (i > n3 && i != n3) {
                n3 = i;
            }   else if (i > n1 && i != n2 && i != n3){
                n1 = i;
            }   
        }
        return n3;
    }
}
