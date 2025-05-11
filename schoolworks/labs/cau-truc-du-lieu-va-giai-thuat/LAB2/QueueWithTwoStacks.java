public class QueueWithTwoStacks<E> {

    private MyStack<E> inStack;
    private MyStack<E> outStack;

    public QueueWithTwoStacks() {
        inStack = new MyStack<>();
        outStack = new MyStack<>();
    }

    // Enqueue operation: simply push onto the inStack
    public void enQueue(E item) {
        inStack.push(item);
    }

    // Dequeue operation
    public E deQueue() {
        // If the outStack is empty, we need to transfer elements from inStack
        if (outStack.isEmpty()) {
            // Pop everything from inStack and push it to outStack
            // This reverses the LIFO order to FIFO
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }

        // If outStack is still empty after transfer, the queue is empty
        if (outStack.isEmpty()) {
            System.out.println("Queue is empty!");
            return null;
        }

        // Pop the top element from outStack, which is the oldest element
        return outStack.pop();
    }

    public boolean isEmpty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }

    public static void main(String[] args) {
        QueueWithTwoStacks<Integer> myQueue = new QueueWithTwoStacks<>();

        System.out.println("Enqueuing 1, 2, 3...");
        myQueue.enQueue(1);
        myQueue.enQueue(2);
        myQueue.enQueue(3);

        System.out.println("Dequeued: " + myQueue.deQueue()); // Expected: 1

        System.out.println("Enqueuing 4...");
        myQueue.enQueue(4);

        System.out.println("Dequeued: " + myQueue.deQueue()); // Expected: 2
        System.out.println("Dequeued: " + myQueue.deQueue()); // Expected: 3
        System.out.println("Dequeued: " + myQueue.deQueue()); // Expected: 4
    }
}
