public class Test {
    public static void main(String[] args) {
        System.out.println("=== PART 1 & EXERCISE 3: Integer Linked List ===");
        MyLinkedList<Integer> list = new MyLinkedList<>();

        // Initialize List with sample data
        list.addLast(10);
        list.addLast(7);
        list.addLast(4);
        list.addLast(11);
        list.addLast(8);
        System.out.print("Original ");
        list.print();

        // (a) Count Even items
        System.out.println("Even count: " + list.countEven());

        // (b) Count Prime items
        System.out.println("Prime count: " + list.countPrime());

        // (c) Add X (e.g., 99) before first even element
        list.addBeforeFirstEven(99);
        System.out.print("After adding 99 before first even: ");
        list.print();

        // (d) Find maximum
        System.out.println("Max value: " + list.findMax());

        // (e) Reverse the list in-place
        list.reverse();
        System.out.print("Reversed ");
        list.print();

        // (f) Sort the list ascending
        list.sort();
        System.out.print("Sorted ");
        list.print();

        // Exercise 2: removeCurr
        System.out.println("\n=== EXERCISE 2: removeCurr ===");
        Node<Integer> headNode = list.getHead();
        System.out.println("Removing head node: " + list.removeCurr(headNode));
        list.print();

        // Exercise 1: Fraction Linked List
        System.out.println("\n=== EXERCISE 1: Fraction Linked List ===");
        MyLinkedList<Fraction> fracList = new MyLinkedList<>();
        fracList.addFirst(new Fraction(1, 2));
        fracList.addLast(new Fraction(3, 4));
        fracList.addLast(new Fraction(2, 4));
        fracList.print();
        System.out.println("Contains 1/2: " + fracList.contains(new Fraction(1, 2)));

        // Exercise 4: Double Linked List
        System.out.println("\n=== EXERCISE 4: Double Linked List ===");
        MyDoubleLinkedList dList = new MyDoubleLinkedList();
        dList.addFirst(1.5);
        dList.addLast(3.7);
        dList.addLast(5.2);
        dList.print();
        System.out.println("Find 3.7: " + (dList.find(3.7) != null ? "Found" : "Not Found"));
        System.out.println("Remove first: " + dList.removeFirst());
        dList.print();
    }
}

