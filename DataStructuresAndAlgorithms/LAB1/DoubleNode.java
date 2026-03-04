public class DoubleNode {
    private double data;
    private DoubleNode next;

    public DoubleNode(double data) {
        this.data = data;
        this.next = null;
    }

    public double getData() {
        return data;
    }

    public DoubleNode getNext() {
        return next;
    }

    public void setNext(DoubleNode next) {
        this.next = next;
    }
}
