import java.util.HashMap;
import java.util.Scanner;

public class Exercise5 {
    public static void main(String[] args) {
        HashMap<String, String> dictionary = new HashMap<>();
        dictionary.put("hello", "xin chào");
        dictionary.put("world", "thế giới");
        dictionary.put("java", "ngôn ngữ lập trình Java");
        // Add more words as needed

        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.print("Enter a word to look up (or type 'exit' to quit): ");
            String word = scanner.nextLine().toLowerCase();
            if (word.equals("exit")) {
                break;
            }
            if (dictionary.containsKey(word)) {
                System.out.println("Meaning of '" + word + "': " + dictionary.get(word));
            } else {
                System.out.println("Word '" + word + "' not found in the dictionary.");
            }
        }
        scanner.close();
    }
}
