import './App.css';
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useQuery, gql } from '@apollo/client';

const { format } = require('date-fns');


function App() {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

const GET_WEIGHTS = gql`
  query GetWeights {
    weights {
      id
      date
      weight
    }
  }
`;

  const { loading, error, data } = useQuery(GET_WEIGHTS);
  console.log('data: ', data);

  // Function using fetch to POST to our API endpoint
  async function createWeighIn(data) {
    console.log('in createWeighIn');
    return fetch('/.netlify/functions/weighin-create', {
      body: JSON.stringify(data),
      method: 'POST'
    }).then(response => {
      console.log('response: ', response);
      console.log('response.json(): ', response.json());
      return response.json()
    })
  }

  const handleChange = (e) => {
    console.log('handle change');
    const date = '2021-10-05';
    const [ year, month, day ] = date.split('-').reduce((acc, datePart) => {
      acc = [...acc, datePart]
      return acc;
    },[]);
    const dateObject = new Date(year, month - 1, day);
    const formattedDate = format(dateObject, 'yyyy/MM/dd')
    createWeighIn({
      weight: 112.2,
      date: formattedDate
    }).then((response) => {
      console.log('API response', response)
      // set app state
    }).catch((error) => {
      console.log('API error', error)
    })    
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Today I Weigh</h1>
      </header>
      <form>
        <TextField
          id="date"
          label="Pick a week"
          type="date"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
        <div className="container">
        {days.map((value) => (
          <div key={value} className="day">
            <div>{value}</div>
              <div>
                <FormControl variant="outlined" onChange={e => handleChange(e)}>
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    type="number"
                    endAdornment={<InputAdornment position="end">lbs</InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      'aria-label': 'weight',
                      inputmode: 'decimal',
                      step: '.01'
                    }}
                    labelWidth={0}
                  />
                </FormControl>
              </div>
           </div>
        ))}
        </div>
    </div>
  );
}

export default App;
