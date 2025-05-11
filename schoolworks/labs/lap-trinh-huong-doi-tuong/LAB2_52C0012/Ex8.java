import java.math.BigDecimal;

public class Ex8 {
    public static void main(String[] args) {
    BigDecimal arr[] =  {new BigDecimal("1.0"), new BigDecimal("2.0"),new BigDecimal("3.0"), new BigDecimal("4.0")};
        System.out.print(findMax(arr));
    }

    
    public static BigDecimal findMax(BigDecimal[] arr) {
        BigDecimal max = arr[0];
        for (int i = 1; i < arr.length; i++){
            if (arr[i].compareTo(max) > 0) {
                max = arr[i];
            }
        }
        return max;
    }
}
