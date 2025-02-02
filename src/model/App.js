import Tracker from './Tracker.js';
import Workout from './Workout.js';
import Meal from './Meal.js';

class App {
  constructor() {
    this._calorieTracker = new Tracker();
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

export default App;
