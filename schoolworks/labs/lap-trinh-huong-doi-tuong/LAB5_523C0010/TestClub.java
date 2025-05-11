public class TestClub {
    public static void main(String[] args) {
        Club cb = new Club("MU", 1, 2, 0);
        int numMatches = cb.numMatchesPlayed();
        boolean c = cb.isFinish();

        System.err.println(cb);
        System.err.println("Num of matches the club played : " + numMatches);
        if(c) {
            System.err.println("The club has finished the league.");
        } else {
            System.err.println("The club has NOT finished the league.");
        }
    }   
}
