import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { FavoriteIcon, ShareIcon, ExpandMoreIcon, MoreVertIcon } from '@material-ui/icons';


function RecipeReviewCard(recipe, i) {
  
  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {recipe.recipe.name.split("")[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              {/* <MoreVertIcon /> */}
            </IconButton>
          }
          title={recipe.recipe.name}
          subheader="September 14, 2016"
        />
        <CardMedia
          className={classes.media}
          image={recipe.recipe.thumbnail_url}
          title={recipe.recipe.name}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
          {recipe.recipe.nutrition &&
            <div>
              <strong>Nutrition</strong><br />
              Calories: {recipe.recipe.nutrition.calories}<br />
              Fat: {recipe.recipe.nutrition.fat}<br />
              Fiber: {recipe.recipe.nutrition.fiber}<br />
              Protein: {recipe.recipe.nutrition.protein}<br />
              Sugar: {recipe.recipe.nutrition.sugar}<br />
            </div>
          }
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            {/* <FavoriteIcon /> */}
          </IconButton>
          <IconButton aria-label="share">
            {/* <ShareIcon /> */}
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            {/* <ExpandMoreIcon /> */}
            Expand
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Ingredients:</Typography>
            <Typography paragraph>
              {recipe.recipe.sections[0].components &&
                recipe.recipe.sections[0].components.map((ing, i) => (
                  <div key={i}>
                    <p>{ing.raw_text}</p>
                  </div>
                ))
              }
            </Typography>
            <Typography paragraph>Instructions:</Typography>
            <Typography paragraph>
              {recipe.recipe.instructions &&
                recipe.recipe.instructions.map(instruc => (
                  <ul>
                    <li>
                      Step {instruc.position}:<br />
                      {instruc.display_text}
                    </li>
                  </ul>
              ))}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }

const TastyApp = () => {
  const [name, setName] = useState();
  const [recipe, setRecipe] = useState();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(3);

  async function getRecipes(e) {
    e.preventDefault();
    console.info(name.toString());
    await fetch("https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&tags=under_30_minutes&q=" + name, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.REACT_APP_KEY || "ac72153c36mshd1814c8f1af20f3p1518fbjsnabee85184908",
        "x-rapidapi-host": process.env.REACT_APP_HOST || "tasty.p.rapidapi.com"
      }
    })
    .then(response => response.json())
    .then(data => {
      setRecipe(data);
      const search = document.getElementById("search");
      search = "";
    })
    .catch(err => {
      console.error(err);
    });
  }

  function nextResults() {
    setStart(start + 3);
    if ( end > recipe.results.length ) {
      setEnd(recipe.results.length)
    } else {
      setEnd(end + 3);
    }
  }

  function prevResults() {
    setStart(start - 3);
    if ( start <= 3 ) {
      setEnd(3)
    } else {
      setEnd(end - 3);
    }
  }

  return (
    <div className="tasty-app">
      <form action="" onSubmit={getRecipes}>
        <label>Name of food or ingredients to search by.</label>
        <input 
          id="search" 
          type="text" 
          placeholder="Query..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
        <Button variant="contained" color="primary" type="submit" className="btn">Search</Button>
      </form>
      <div className="cards">
        {recipe &&
          recipe.results.slice(start, end).map((data, i) => (
            <RecipeReviewCard recipe={data} key={i} />
          ))
        }
      </div>
      <div className="buttons">
        {start &&
          start > 0 && 
          <Button variant="contained" color="primary" onClick={prevResults}>Prev</Button>
        }
        {recipe &&
          recipe.results.length > 3 && 
          recipe.results.length > end &&
            <Button variant="contained" color="primary" onClick={nextResults}>Next</Button>
        }
        {recipe &&
          <div>
            <p><small>Total Results: {recipe.results.length}</small></p>
            <p>
              page 1 of {parseInt(recipe.results.length / 3)}
            </p>
          </div>
        }
      </div>
      
      <div className="footer">
        <p>
          API details: <a href="https://rapidapi.com/apidojo/api/tasty" target="blank">https://rapidapi.com/apidojo/api/tasty</a>
        </p>
      </div>
    </div>
  )
}

export default TastyApp;


// -- for testing -- //

  // if (recipe) {
  //   console.info({
  //     total_returned: recipe.results[0],
  //     name: recipe.results[0].name,
  //     img_url: recipe.results[0].thumbnail_url,
  //     video_url: recipe.results[0].original_video_url,
  //     brand_name: recipe.results[0].brand.name,
  //     // Nutritional Values
  //     nutrition : {
  //       calories: recipe.results[0].nutrition.calories,
  //       carbohydrates: recipe.results[0].nutrition.carbohydrates,
  //       fat: recipe.results[0].nutrition.fat,
  //       fiber: recipe.results[0].nutrition.fiber,
  //       protein: recipe.results[0].nutrition.protein,
  //       sugar: recipe.results[0].nutrition.sugar,
  //       updated_at: recipe.results[0].nutrition.updated_at,

  //     }
  //   });
  //   console.info(recipe);
  // }

