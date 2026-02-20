import java.io.*;

public class SumIntegersFromFile {
    public static void main(String[] args) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
            BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"));
            String line;
            int sum = 0;
            while ((line = reader.readLine()) != null) {
                String[] numbers = line.split("\\s+");
                for (String numStr : numbers) {
                    sum += Integer.parseInt(numStr);
                }
            }
            writer.write(String.valueOf(sum));
            reader.close();
            writer.close();
            System.out.println("Sum of integers from input.txt was successfully written to output.txt");
        } catch (IOException | NumberFormatException e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
    }
}
