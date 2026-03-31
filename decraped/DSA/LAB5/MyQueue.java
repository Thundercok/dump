interface QueueInterface<E> {
    void enQueue(E item);

    E deQueue();

    int size();

    boolean contains(E item);

    void print();

    boolean isEmpty();

    E getFront();
}

public class MyQueue<E> implements QueueInterface<E> {
    private Node<E> front;
    private Node<E> rear;
    private int numNode;

    public MyQueue() {
        this.front = null;
        this.rear = null;
        this.numNode = 0;
    }

    @Override
    public void enQueue(E item) {
        Node<E> newNode = new Node<>(item);
        if (isEmpty()) {
            front = newNode;
            rear = newNode;
        } else {
            rear.setNext(newNode);
            rear = newNode;
        }
        numNode++;
    }

    @Override
    public E deQueue() {
        if (isEmpty())
            return null;
        E data = front.getData();
        front = front.getNext();
        if (front == null) {
            rear = null; // Queue is now empty
        }
        numNode--;
        return data;
    }

    @Override
    public int size() {
        return numNode;
    }

    @Override
    public boolean contains(E item) {
        Node<E> current = front;
        while (current != null) {
            if (current.getData().equals(item))
                return true;
            current = current.getNext();
        }
        return false;
    }

    @Override
    public void print() {
        Node<E> current = front;
        System.out.print("Queue (front to back): ");
        while (current != null) {
            System.out.print(current.getData() + " ");
            current = current.getNext();
        }
        System.out.println();
    }

    @Override
    public boolean isEmpty() {
        return numNode == 0;
    }

    @Override
    public E getFront() {
        if (isEmpty())
            return null;
        return front.getData();
    }
}
