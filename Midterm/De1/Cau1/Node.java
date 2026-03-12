public class Node {
    private char data;
    private Node next;

    public Node(char data, Node next) {
        this.data = data;
        this.next = next;
    }

    public char getData() {
        return data;
    }

    public Node getNext() {
        return next;
    }

    public void setNext(Node next) {
        this.next = next;
    }

    public void setData(char data) {
        this.data = data;
    }

}
