public class CharLinkedList implements ListInterface {
    private Node head;

    public CharLinkedList() {
        this.head = null;
    }

    @Override
    public void addFirst(char data) {
        Node newNode = new Node(data, head);
        head = newNode;
    }

    @Override
    public boolean addAfterFirstKey(char data, char key) {
        node current = head;

        while (current != null) {
            if (current.getData() == key) {
                Node newNode = new Node(data, current.getNext())
                current.setNext(newNode);
                return true;
            }
            current = current.getNext();
        }
        return false;
    }

    @Override
    public int largestCharPosition() {
        if (head == null)
            return -1;

        Node current = head;
        char maxVal = head.getData();
        int maxPos = 0;
        int currentPos = 0;

        while (current != null) {
            if (current.getData() > maxVal) {
                maxVal = current.getData();
                maxPos = currentPos;
            }
            current = current.getNext();
            currentPos++;
        }
        return maxPos;
    }
}
