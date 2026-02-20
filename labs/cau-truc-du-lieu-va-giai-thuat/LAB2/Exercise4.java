public class Exercise4 {

    public static boolean isBalanced(String expression) {
        // Using the custom MyStack we created in Exercise 1
        MyStack<Character> stack = new MyStack<>();

        // Iterate through each character in the sequence
        for (int i = 0; i < expression.length(); i++) {
            char ch = expression.charAt(i);

            // 1. For left delimiters, push onto Stack
            if (ch == '(' || ch == '{' || ch == '[') {
                stack.push(ch);
            }
            // 2. For right delimiters, check for a match
            else if (ch == ')' || ch == '}' || ch == ']') {

                // If the stack is empty here, we have a right delimiter without a left one
                if (stack.isEmpty()) {
                    return false;
                }

                // Pop from Stack
                char top = stack.pop();

                // Check whether the popped element matches the right delimiter
                if ((ch == ')' && top != '(') ||
                        (ch == '}' && top != '{') ||
                        (ch == ']' && top != '[')) {
                    return false; // Mismatched brackets
                }
            }
        }

        // 3. If the stack is empty at the end, all delimiters were perfectly matched!
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String test1 = "{[()]}";
        String test2 = "{[(])}";
        String test3 = "((()";
        String test4 = "System.out.println(array[0]);";

        System.out.println(test1 + " is balanced? " + isBalanced(test1)); // Expected: true
        System.out.println(test2 + " is balanced? " + isBalanced(test2)); // Expected: false
        System.out.println(test3 + " is balanced? " + isBalanced(test3)); // Expected: false
        System.out.println(test4 + " is balanced? " + isBalanced(test4)); // Expected: true
    }
}
