import java.util.Vector;

public class Exercise4 {
    public static Vector<Integer> calculateY(Vector<Integer> x) {
        Vector<Integer> y = new Vector<>();
        for (int i : x) {
            int result = 2 * i * i + 1;
            y.add(result);
        }
        return y;
    }

    public static void main(String[] args) {
        int n = 5;
        Vector<Integer> x = new Vector<>();
        for (int i = 1; i <= n; i++) {
            x.add(i);
        }

        Vector<Integer> y = calculateY(x);
        System.out.println("Vector Y:");
        System.out.println(y);
    }
}
