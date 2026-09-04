import java.util.NoSuchElementException;

public class MyDoubleLinkedList {
    private DoubleNode head;
    private int numNode;

    public MyDoubleLinkedList() {
        head = null;
        numNode = 0;
    }

    public void addFirst(double item) {
        head = new DoubleNode(item, head);
        numNode++;
    }

    public void addLast(double item) {
        if (head == null) {
            addFirst(item);
        } else {
            DoubleNode tmp = head;
            while (tmp.getNext() != null) {
                tmp = tmp.getNext();
            }
            DoubleNode newNode = new DoubleNode(item, null);
            tmp.setNext(newNode);
            numNode++;
        }
    }

    public void addAfter(DoubleNode curr, double item) {
        if (curr == null) {
            addFirst(item);
        } else {
            DoubleNode newNode = new DoubleNode(item, curr.getNext());
            curr.setNext(newNode);
            numNode++;
        }
    }

    public double removeFirst() throws NoSuchElementException {
        if (head == null) {
            throw new NoSuchElementException("Can't remove element from an empty list");
        }
        DoubleNode tmp = head;
        head = head.getNext();
        numNode--;
        return tmp.getData();
    }

    public double removeLast() throws NoSuchElementException {
        if (head == null) {
            throw new NoSuchElementException("Can't remove element from an empty list");
        }
        if (head.getNext() == null) {
            return removeFirst();
        }
        DoubleNode preNode = null;
        DoubleNode delNode = head;
        while (delNode.getNext() != null) {
            preNode = delNode;
            delNode = delNode.getNext();
        }
        preNode.setNext(delNode.getNext());
        numNode--;
        return delNode.getData();
    }

    public double removeAfter(DoubleNode curr) throws NoSuchElementException {
        if (curr == null) {
            throw new NoSuchElementException("Can't remove element from an empty list");
        }
        DoubleNode delNode = curr.getNext();
        if (delNode != null) {
            curr.setNext(delNode.getNext());
            numNode--;
            return delNode.getData();
        } else {
            throw new NoSuchElementException("No next node to remove");
        }
    }

    public double removeCurr(DoubleNode curr) throws NoSuchElementException {
        if (head == null || curr == null) {
            throw new NoSuchElementException("Can't remove element from an empty list or null node");
        }
        if (curr == head) {
            return removeFirst();
        }
        DoubleNode prev = head;
        while (prev != null && prev.getNext() != curr) {
            prev = prev.getNext();
        }
        if (prev == null) {
            throw new NoSuchElementException("Node not found");
        }
        prev.setNext(curr.getNext());
        numNode--;
        return curr.getData();
    }

    public DoubleNode find(double item) {
        DoubleNode tmp = head;
        while (tmp != null) {
            if (tmp.getData() == item) {
                return tmp;
            }
            tmp = tmp.getNext();
        }
        return null;
    }

    public boolean contains(double item) {
        return find(item) != null;
    }

    public int size() {
        return numNode;
    }

    public boolean isEmpty() {
        return numNode == 0;
    }

    public DoubleNode getHead() {
        return head;
    }

    public double getFirst() throws NoSuchElementException {
        if (head == null) {
            throw new NoSuchElementException("Can't get element from an empty list");
        }
        return head.getData();
    }

    public void print() {
        if (head != null) {
            DoubleNode tmp = head;
            System.out.print("List: " + tmp.getData());
            tmp = tmp.getNext();
            while (tmp != null) {
                System.out.print(" -> " + tmp.getData());
                tmp = tmp.getNext();
            }
            System.out.println();
        } else {
            System.out.println("List is empty!");
        }
    }
}
