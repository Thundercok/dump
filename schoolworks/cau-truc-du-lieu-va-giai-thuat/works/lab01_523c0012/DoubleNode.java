public class DoubleNode {
    private double data;
    private DoubleNode next;

    public DoubleNode() {
        this(0.0, null);
    }

    public DoubleNode(double data) {
        this(data, null);
    }

    public DoubleNode(double data, DoubleNode next) {
        this.data = data;
        this.next = next;
    }

    public double getData() {
        return data;
    }

    public void setData(double data) {
        this.data = data;
    }

    public DoubleNode getNext() {
        return next;
    }

    public void setNext(DoubleNode next) {
        this.next = next;
    }
}
