import Storage from './Storage.js';

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

export default CalorieTracker;
