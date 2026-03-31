interface StackInterface<E> {
    void push(E item);

    E pop();

    int size();

    boolean contains(E item);

    void print();

    boolean isEmpty();

    E getpeek();
}
