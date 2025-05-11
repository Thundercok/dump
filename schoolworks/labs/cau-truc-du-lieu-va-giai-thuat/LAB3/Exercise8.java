class Node<E> {
    E data;
    Node<E> next;
    public Node(E data) { this.data = data; this.next = null; }
}

public class MyLinkedList {
    Node<Integer> head;

    // (a) Chèn phần tử vào danh sách đã sắp xếp (Sorted List)
    public void addSortedList(Integer item) {
        Node<Integer> newNode = new Node<>(item);
        
        // Trường hợp 1: List rỗng hoặc chèn vào đầu
        if (head == null || head.data >= item) {
            newNode.next = head;
            head = newNode;
            return;
        }

        // Trường hợp 2: Tìm vị trí chèn ở giữa hoặc cuối
        Node<Integer> current = head;
        // Duyệt đến khi next null hoặc next.data lớn hơn item
        while (current.next != null && current.next.data < item) {
            current = current.next;
        }
        
        // Chèn newNode vào sau current
        newNode.next = current.next;
        current.next = newNode;
    }

    // (b.1) Đếm số lượng số chẵn
    public int countEven() {
        int count = 0;
        Node<Integer> current = head;
        while (current != null) {
            if (current.data % 2 == 0) {
                count++;
            }
            current = current.next;
        }
        return count;
    }

    // (b.2) Tính tổng các số
    public int sumList() {
        int sum = 0;
        Node<Integer> current = head;
        while (current != null) {
            sum += current.data;
            current = current.next;
        }
        return sum;
    }
}
