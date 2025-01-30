class CalorieTracker {
  constructor() {
    this._caloriesLimit = Storage.getCaloriesLimit();
    this._caloriesTotal = Storage.getCaloriesTotal();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._renderStats();
  }

  get caloriesLimit() {
    return this._caloriesLimit;
  }

  set caloriesLimit(limit) {
    this._caloriesLimit = limit;
    Storage.setCaloriesLimit(limit);
    this._renderStats();
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._caloriesTotal += meal.calories;
    Storage.setMeals(this._meals);
    Storage.setCaloriesTotal(this._caloriesTotal);
    this._renderStats();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._caloriesTotal -= workout.calories;
    Storage.setCaloriesTotal(this._caloriesTotal);
    Storage.setWorkouts(this._workouts);
    this._renderStats();
  }

  removeMeal(id) {
    const meal = this._meals.find((x) => x.id === id);
    this._caloriesTotal -= meal.calories;
    this._meals = this._meals.filter((x) => x.id !== id);
    Storage.setMeals(this._meals);
    Storage.setCaloriesTotal(this._caloriesTotal);
    this._renderStats();
  }

  removeWorkout(id) {
    const workout = this._workouts.find((x) => x.id === id);
    this._caloriesTotal += workout.calories;
    this._workouts = this._workouts.filter((x) => x.id !== id);
    Storage.setCaloriesTotal(this._caloriesTotal);
    Storage.setWorkouts(this._workouts);
    this._renderStats();
  }

  reset() {
    this._caloriesTotal = 0;
    this._meals = [];
    this._workouts = [];
    Storage.setCaloriesTotal(0);
    Storage.setMeals([]);
    Storage.setWorkouts([]);
    this._renderStats();
  }

  get _caloriesConsumed() {
    return this._meals.reduce((acc, meal) => acc + meal.calories, 0);
  }

  get _caloriesBurned() {
    return this._workouts.reduce((acc, work) => acc + work.calories, 0);
  }

  get _caloriesRemaining() {
    return this._caloriesLimit - this._caloriesTotal;
  }

  _displayCaloriesLimit() {
    const el = document.getElementById('calories-limit');
    el.textContent = this._caloriesLimit;
  }

  _displayCaloriesTotal() {
    const el = document.getElementById('calories-total');
    el.textContent = this._caloriesTotal;
  }

  _displayCaloriesConsumed() {
    const el = document.getElementById('calories-consumed');
    el.textContent = this._caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const el = document.getElementById('calories-burned');
    el.textContent = this._caloriesBurned;
  }

  _displayCaloriesRemaining() {
    const el = document.getElementById('calories-remaining');
    el.textContent = this._caloriesRemaining;

    const replaceClasses = (oldToken = 'origin', newToken = 'red') => {
      const bg = { origin: 'bg-secondary-subtle', red: 'bg-danger' };
      const text = { origin: 'text-dark', red: 'text-ligth' };
      const progressBg = { origin: 'bg-success', red: 'bg-danger' };

      const card = el.parentElement.parentElement;
      card.classList.replace(bg[oldToken], bg[newToken]);
      card.classList.replace(text[oldToken], text[newToken]);

      const progress = document.getElementById('calories-progress');
      progress.classList.replace(progressBg[oldToken], progressBg[newToken]);
    };

    if (this._caloriesRemaining < 0) {
      replaceClasses('origin', 'red');
    } else {
      replaceClasses('red', 'origin');
    }
  }

  _displayCaloriesProgress() {
    const percents = (this._caloriesTotal / this._caloriesLimit) * 100;
    document.getElementById('calories-progress').style.width = `${Math.min(
      percents,
      100
    )}%`;
  }

  _displayItems(type) {
    const items = document.getElementById(`${type}-items`);
    items.innerHTML = '';
    const bg = type === 'meal' ? 'bg-success' : 'bg-warning';

    this[`_${type}s`].forEach((x) => {
      items.insertAdjacentHTML(
        'beforeend',
        `<div class="border rounded my-3 p-3 d-flex justify-content-between align-items-center data-id="${x.id}">
        <span class="fs-4 item-name">${x.name}</span>
        <span class="${bg} text-light fs-4 fw-bold px-5 py-2 rounded item-calories">${x.calories}</span>
        <button class="btn btn-danger"><i class="bi bi-x-lg" data-id="${x.id}"></i></button>
        </div>`
      );
    });
  }

  _renderStats() {
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
    this._displayItems('meal');
    this._displayItems('workout');
  }
}

class Item {
  constructor(name, calories) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.calories = calories;
  }
}

class Workout extends Item {
  constructor(name, calories) {
    super(name, calories);
  }
}

class Meal extends Item {
  constructor(name, calories) {
    super(name, calories);
  }
}

class Storage {
  static PREFIX = 'CT';
  static CALORIES_LIMIT = `${Storage.PREFIX}_caloriesLimit`;
  static CALORIES_TOTAL = `${Storage.PREFIX}_caloriesTotal`;
  static MEALS = `${Storage.PREFIX}_meals`;
  static WORKOUTS = `${Storage.PREFIX}_workouts`;

  static getCaloriesLimit(limit = 2000) {
    const storedLimit = localStorage.getItem(Storage.CALORIES_LIMIT);
    console.log({ storedLimit });

    if (storedLimit) {
      limit = +storedLimit;
    }

    return limit;
  }

  static setCaloriesLimit(limit) {
    localStorage.setItem(Storage.CALORIES_LIMIT, limit);
  }

  static getCaloriesTotal(total = 0) {
    const storedTotal = localStorage.getItem(Storage.CALORIES_TOTAL);
    if (storedTotal) {
      total = +storedTotal;
    }
    return total;
  }

  static setCaloriesTotal(total) {
    localStorage.setItem(Storage.CALORIES_TOTAL, total);
  }

  static getMeals(meals = []) {
    const storedMeals = localStorage.getItem(Storage.MEALS);
    if (storedMeals) {
      meals = JSON.parse(storedMeals);
    }
    return meals;
  }

  static setMeals(meals) {
    localStorage.setItem(Storage.MEALS, JSON.stringify(meals));
  }

  static getWorkouts(workouts = []) {
    const storedWorkouts = localStorage.getItem(Storage.WORKOUTS);
    if (storedWorkouts) {
      workouts = JSON.parse(storedWorkouts);
    }
    return workouts;
  }

  static setWorkouts(workouts) {
    localStorage.setItem(Storage.WORKOUTS, JSON.stringify(workouts));
  }
}

class App {
  constructor() {
    this._calorieTracker = new CalorieTracker();
    this._addEventListeners();
  }

  _addEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meals')
      .addEventListener('input', this._filterItems.bind(this, 'meal'));

    document
      .getElementById('filter-workouts')
      .addEventListener('input', this._filterItems.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('set-limit-modal')
      .addEventListener('show.bs.modal', this._showModal.bind(this));

    document
      .getElementById('set-limit-form')
      .addEventListener('submit', this._setDailyLimit.bind(this));
  }

  _newItem(type, event) {
    event.preventDefault();
    const name = event.target.meal || event.target.workout;
    const { calories } = event.target;

    if (!name.value || !calories.value) {
      alert('Please fill in all fields');
      return;
    }

    if (type === 'meal') {
      this._calorieTracker.addMeal(new Meal(name.value, +calories.value));
    } else {
      this._calorieTracker.addWorkout(new Workout(name.value, +calories.value));
    }

    name.value = '';
    calories.value = '';

    event.target.closest('.accordion-collapse').classList.remove('show');
  }

  _removeItem(type, event) {
    if (event.target.classList.contains('bi-x-lg')) {
      const id = event.target.dataset.id;

      const name = event.target
        .closest('div')
        .querySelector('.item-name').textContent;
      const calories = event.target
        .closest('div')
        .querySelector('.item-calories').textContent;

      if (
        confirm(
          `Are you sure you want to delete Item "${name}" (${calories} calories)?`
        )
      ) {
        if (type === 'meal') {
          this._calorieTracker.removeMeal(id);
        } else {
          this._calorieTracker.removeWorkout(id);
        }
      }
    }
  }

  _filterItems(type, event) {
    const filter = event.target.value;
    const items = Array.from(document.getElementById(`${type}-items`).children);

    items.forEach((x) => {
      if (x.textContent.toLowerCase().includes(filter.toLowerCase())) {
        x.classList.replace('d-none', 'd-flex');
      } else {
        x.classList.replace('d-flex', 'd-none');
      }
    });
  }

  _showModal(event) {
    const limit = document.getElementById('new-limit');
    limit.value = this._calorieTracker.caloriesLimit;
  }

  _setDailyLimit(event) {
    event.preventDefault();
    const limit = document.getElementById('new-limit');

    if (!limit.value) {
      alert('Value should be greater than zero');
      return;
    }

    this._calorieTracker.caloriesLimit = +limit.value;
    limit.value = '';
  }

  _reset() {
    if (confirm('Are you sure?')) {
      this._calorieTracker.reset();
      document.getElementById('filter-meals').value = '';
      document.getElementById('filter-workouts').value = '';
      document.getElementById('panel-left').classList.add('show');
      document.getElementById('panel-right').classList.add('show');
    }
  }
}

new App();
