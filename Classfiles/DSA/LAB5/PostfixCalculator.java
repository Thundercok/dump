public class PostfixCalculator {

    public static int calculatePostfix(String s) {
        // Using your custom MyStack instead of java.util.Stack
        MyStack<String> stack = new MyStack<>();

        // Split s into the array split_ch
        String[] split_ch = s.split(" ");

        for (String ch : split_ch) {
            // If ch is an operator
            if (ch.equals("+") || ch.equals("-") || ch.equals("*") || ch.equals("/")) {
                // Pop first and second elements from your stack
                int a = Integer.parseInt(stack.pop());
                int b = Integer.parseInt(stack.pop());
                int res = 0;

                switch (ch) {
                    case "+":
                        res = b + a;
                        break;
                    case "-":
                        res = b - a;
                        break;
                    case "*":
                        res = b * a;
                        break;
                    case "/":
                        res = b / a;
                        break;
                }
                // Push result back into the stack
                stack.push(String.valueOf(res));
            } else {
                // ch is an operand, add it to the stack
                stack.push(ch);
            }
        }

        // Return the final element left at the top of the stack
        return Integer.parseInt(stack.pop());
    }
}
