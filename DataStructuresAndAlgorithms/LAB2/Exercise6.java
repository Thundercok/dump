public class Exercise6 {

    public static boolean isPalindrome(String input) {
        MyStack<Character> stack = new MyStack<>();
        MyQueue<Character> queue = new MyQueue<>();

        // 1. Preprocess the string: convert to lowercase and keep only alphanumeric
        // characters
        String cleanedInput = input.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        // 2. Populate both data structures
        for (char c : cleanedInput.toCharArray()) {
            stack.push(c);
            queue.enQueue(c);
        }

        // 3. Compare elements one by one
        while (!stack.isEmpty() && !queue.isEmpty()) {
            char fromStack = stack.pop(); // Reads backward
            char fromQueue = queue.deQueue(); // Reads forward

            if (fromStack != fromQueue) {
                return false; // Mismatch found, not a palindrome
            }
        }

        return true; // All characters matched perfectly
    }

    public static void main(String[] args) {
        String test1 = "dad";
        String test2 = "A man, a plan, a canal: Panama";
        String test3 = "Hello World";

        System.out.println("\"" + test1 + "\" is a palindrome? " + isPalindrome(test1)); // Expected: true
        System.out.println("\"" + test2 + "\" is a palindrome? " + isPalindrome(test2)); // Expected: true
        System.out.println("\"" + test3 + "\" is a palindrome? " + isPalindrome(test3)); // Expected: false
    }
}
