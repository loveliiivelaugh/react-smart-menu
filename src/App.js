import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Container from '@material-ui/core/Container';

import { FaSearch, FaRandom } from "react-icons/fa";
import TastyApp from './components/TastyApp';

function App() {
  const [meal, setMeal] = useState();
  const [meals, setMeals] = useState();
  const [ingredients, setIngredients] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Search meal and fetch from API
  async function searchMeal(e) {
    e.preventDefault();

    const search = document.getElementById('search'),
    single_mealEl = document.getElementById('single-meal');
    // Clear single meal
    single_mealEl.innerHTML = '';

    // Get search term
    const term = search.value;

    // Check for empty
    try {
      if (term.trim()) {
        setIsLoading(true);
        await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)
        .then(res => res.json())
        .then(data => {
          setMeals(data.meals);
          setIsLoading(false);
        });
        // Clear search text
        search.value = '';
      } else {
        alert('Please enter a search term');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  // Fetch meal by ID
  async function getMealById(mealID) {
    try {
      setIsLoading(true);
      await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID)
      .then(res => res.json())
      .then(data => {
        console.info(data);
        if ( data.meals !== null ) {
          if (data.meals[0]) {
            const meal = data.meals[0];
            addMealToDOM(meal);
            setIsLoading(false);
          } 
        }
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  // Handle single meal click 
  function singleMealClick(e) {
    console.info("I've been clicked");
    if (e.target) {
      const mealID = e.target.getAttribute('data-mealid');
      getMealById(mealID);
    } else {
      alert("Something is going wrong here?");
    }
  }

  // Fetch meal by main ingredient
  async function getMealByIngredient(ingredient) {
    await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast")
    .then(res => res.json())
    .then(data => {
      console.info(data);
      getMealById(data.meals[0].idMeal);
    });
  }

  // todo -> This is a paid portion of the service ( $5 - one time fee )
  // Fetch meal by multiple ingredients
  async function getMealByIngredients(ingredients) {
    const testIngredients = ["cheese", "milk", "eggs", "bacon", "jalapenos"];
    console.info(testIngredients);
    console.info(testIngredients.toString());
    // actual fetch call to return results including multiple ingredients
    await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredients.toString());
    // test call
    await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast,garlic,salt")
    .then(res => res.json())
    .then(data => {
      console.info(data);
    });
  }

  // Add meal to DOM
  function addMealToDOM(meal) {
    const ingredients = [];

    for(let i = 1; i <= 20; i++) {
      if ( meal[`strIngredient${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      } else {
        break;
      }
    }
    setMeal(meal);
    setIngredients(ingredients);
  }

  console.info(isLoading);

  return (
    <div className="App">
      <Container className="container">
        <h1>Meal Finder</h1>
        <Container className="tastyapp-container">
          <TastyApp />
        </Container>
      </Container>
    </div>
  );
}

export default App;
