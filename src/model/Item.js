class Item {
  constructor(name, calories) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.calories = calories;
  }
}

export default Item;
