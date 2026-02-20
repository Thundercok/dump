public interface ListInterface {
    Node getHead();

    void addFirst(char data);

    boolean addAfterFirstKey(char data, char key);

    int largestCharPosition();
}
