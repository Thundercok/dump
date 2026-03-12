public class Test {
    public static void main(String[] args) {
        MyLinkedList<Integer> list = new MyLinkedList<Integer>();
        list.addFirst(new Integer(2));
        list.addLast(new Integer(3));
        list.print();
    }
}
