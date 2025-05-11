public class Club{

    private String name;
    private int wins;
    private int draws;
    private int loses;

    public Club(){
        name = "";
        wins = 0;
        draws = 0;
        loses = 0;
    }

    public Club(String name, int wins, int draws, int loses){
        this.name = name;
        this.wins = wins;
        this.draws = draws;
        this.loses = loses;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }
    
    public void setDraws(int draws) {
        this.draws = draws;
    }

    public void setLoses(int loses) {
        this.loses = loses;
    }

    public String getName() {
        return name;
    }

    public int getWins() {
        return wins;
    }

    public int getDraws() {
        return draws;
    }

    public int getLoses() {
        return loses;
    }

    public int numMatchesPlayed(){
        return this.wins + this.draws + this.loses;
    }

    public boolean isFinish(){
        if (numMatchesPlayed() > 10) 
            return true;
        return false;
    }

    public int getPoints(){
        return wins * 3 + draws * 1 + loses * 0;

    }

    public String toString(){
        return name + " club " + wins + "/" + draws + "/" + loses + " - " + getPoints();
    }

}