
public class ImageLoaderTest {
    public static void main(String[] args) {
        ImageLoader l1 = ImageLoader.getInstance();
        ImageLoader l2 = ImageLoader.getInstance();

        System.out.println(l1.loadImage());
        System.out.println(l2.loadImage());
    }
}