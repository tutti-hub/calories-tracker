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

export default Storage;
