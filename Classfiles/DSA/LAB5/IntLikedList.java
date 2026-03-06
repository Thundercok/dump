public class IntLikedList {
    private Node<Integer> head;

    public IntLikedList() {
        this.head = null;
    }

    public void addFirst(int data) {
        Node<Integer> newNode = new Node<Integer>(data, this.head);
        this.head = newNode;
    }

    public boolean addLast(int data) {
        Node<Integer> newNode = new Node<Integer>(data, null);
        if (this.head == null) {
            this.head = newNode;
            return true;
        }
        Node<Integer> current = this.head;
        while (current.getNext() != null) {
            current = current.getNext();
        }
        current.setNext(newNode);
        return true;
    }

    public boolean removeAt(int position) {
        if (position < 0 || this.head == null) {
            return false;
        }
        if (position == 0) {
            this.head = this.head.getNext();
            return true;
        }
        Node<Integer> current = this.head;
        for (int i = 0; i < position - 1; i++) {
            if (current.getNext() == null) {
                return false;
            }
            current = current.getNext();
        }
        if (current.getNext() == null) {
            return false;
        }
        current.setNext(current.getNext().getNext());
        return true;
    }

    public int countOdd() {
        int count = 0;
        Node<Integer> current = this.head;
        while (current != null) {
            if (current.getData() % 2 != 0) {
                count++;
            }
            current = current.getNext();
        }
        return count;
    }

    public int searchKey(int key) {
        int position = 0;
        Node<Integer> current = this.head;
        while (current != null) {
            if (current.getData() == key) {
                return position;
            }
            current = current.getNext();
            position++;
        }
        return -1; // Key not found
    }

    public boolean checkSorted() {
        if (this.head == null || this.head.getNext() == null) {
            return true; // An empty list or a single element list is considered sorted
        }
        Node<Integer> current = this.head;
        while (current.getNext() != null) {
            if (current.getData() > current.getNext().getData()) {
                return false; // Not sorted
            }
            current = current.getNext();
        }
        return true; // Sorted
    }

    public void printList() {
        Node<Integer> current = this.head;
        while (current != null) {
            System.out.print(current.getData() + " ");
            current = current.getNext();
        }
        System.out.println();
    }

    private static class Node<T> {
        private T data;
        private Node<T> next;

        Node(T data, Node<T> next) {
            this.data = data;
            this.next = next;
        }

        T getData() {
            return data;
        }

        Node<T> getNext() {
            return next;
        }

        void setNext(Node<T> next) {
            this.next = next;
        }
    }
}
