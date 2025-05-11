import java.io.*;

public class FileOperations {
    public static void main(String[] args) {
        // 1. Get specific files by extensions from a given folder.
        File folder = new File("path_to_folder");
        File[] files = folder.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(".txt"); // Change the extension as needed
            }
        });
        
        // 2. Check if a file or directory specified by pathname exists or not.
        File file = new File("filename.txt");
        System.out.println(file.exists() ? "File exists" : "File does not exist");
        
        // 3. Check if the given pathname is a directory or a file.
        System.out.println(file.isDirectory() ? "It is a directory" : "It is a file");
        
        // 4. Append text to an existing file.
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter("filename.txt", true));
            writer.append("New text");
            writer.close();
        } catch (IOException e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
        
        // 5. Find the longest word in a text file.
        try {
            BufferedReader reader = new BufferedReader(new FileReader("filename.txt"));
            String line;
            int longestLength = 0;
            String longestWord = "";
            while ((line = reader.readLine()) != null) {
                String[] words = line.split("\\s+");
                for (String word : words) {
                    if (word.length() > longestLength) {
                        longestLength = word.length();
                        longestWord = word;
                    }
                }
            }
            System.out.println("Longest word: " + longestWord);
        } catch (IOException e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
    }
}
