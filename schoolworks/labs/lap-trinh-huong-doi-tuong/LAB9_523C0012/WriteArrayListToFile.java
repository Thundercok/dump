import java.io.*;
import java.util.ArrayList;

public class WriteArrayListToFile {
    public static <E> boolean writeFile(String path, ArrayList<E> lst) {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(path));
            for (E item : lst) {
                writer.write(item.toString());
                writer.newLine();
            }
            writer.close();
            return true;
        } catch (IOException e) {
            System.err.println("An error occurred: " + e.getMessage());
            return false;
        }
    }
}
