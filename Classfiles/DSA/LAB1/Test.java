public class Test {
    public static void main(String[] args) {
        MyLinkedList<Integer> list = new MyLinkedList<>();

        // 1. Initialize List with sample data [cite: 439]
        list.addLast(10);
        list.addLast(7);
        list.addLast(4);
        list.addLast(11);
        list.addLast(8);
        System.out.print("Original ");
        list.print(); // Expected: 10 -> 7 -> 4 -> 11 -> 8 [cite: 442]

        // (a) Count Even items [cite: 464]
        System.out.println("Even count: " + list.countEven());

        // (b) Count Prime items [cite: 465]
        System.out.println("Prime count: " + list.countPrime());

        // (c) Add X (e.g., 99) before first even element [cite: 466]
        list.addBeforeFirstEven(99);
        System.out.print("After adding 99 before first even: ");
        list.print();

        // (d) Find maximum [cite: 467]
        System.out.println("Max value: " + list.findMax());

        // (e) Reverse the list in-place [cite: 468]
        list.reverse();
        System.out.print("Reversed ");
        list.print();

        // (f) Sort the list ascending [cite: 472]
        list.sort();
        System.out.print("Sorted ");
        list.print();
    }
}
