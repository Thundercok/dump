public class Vehicle {
    private final String brand;
    private String model;
    private final int year;

    public Vehicle(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public class Car extends Vehicle {
        private int numberOfDoors;
        private int fuelType;

        public Car(String brand, String model, int year, int numberOfDoors, int fuelType) {
            super(brand, model, year);
            this.numberOfDoors = numberOfDoors;
            this.fuelType = fuelType;
        }

        public int getNumberOfDoors() {
            return numberOfDoors;
        }

        public int getFuelType() {
            return fuelType;
        }

        public void setNumberOfDoors(int numberOfDoors) {
            this.numberOfDoors = numberOfDoors;
        }

        public void setFuelType(int fuelType) {
            this.fuelType = fuelType;
        }

    }

    public class Motorcycle extends Vehicle {
        private int engineCapacity;
        private boolean hasSidecar;

        public Motorcycle(String brand, String model, int year, int engineCapacity, boolean hasSidecar) {
            super(brand, model, year);
            this.engineCapacity = engineCapacity;
            this.hasSidecar = hasSidecar;
        }

        public int getEngineCapacity() {
            return engineCapacity;
        }

        public boolean getHasSidecar() {
            return hasSidecar;
        }

        public void setEngineCapacity(int engineCapacity) {
            this.engineCapacity = engineCapacity;
        }

        public void setHasSidecar(boolean hasSidecar) {
            this.hasSidecar = hasSidecar;
        }
    }
}

public static List<Vehicle> search(List<Vehicle> list, int year) {
    List<Vehicle> result = new ArrayList<>();
    for (Vehicle vehicle : list) {
        if (vehicle.getYear() > year) {
            result.add(vehicle);
        }
    }
    return result;
}