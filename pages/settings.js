import React from "react";
import { Grid, Segment, Form, Message, Icon, Button, Select, Input } from 'semantic-ui-react';
import axios from "axios";
import InputColor from 'react-input-color';
import catchErrors from "../utils/catchErrors";
import baseUrl from "../utils/baseUrl";
import baseColors from "../utils/baseColors";

const INITIAL_USER = {
  _id: "",
  fold: "",
  call: "",
  raise: "",
  allin: "",
  name: "",
  email: "",
  difficulty: "",
};


const difficultyOptions = [
    {  text: 'Easy', value: 'easy' },
    {  text: 'Hard', value: 'hard' },
  ]
  

function Settings({ user }) {
  const [userData, setUserData] = React.useState(INITIAL_USER);
  const [disabled, setDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    user.fold = user.fold ? user.fold : baseColors.fold;
    user.call = user.call ? user.call : baseColors.call;
    user.raise = user.raise ? user.raise : baseColors.raise;
    user.allin = user.allin ? user.allin : baseColors.allin;
    setUserData(user);
  }, [user]);

  function handleChange(event, data) {
    const { name, value } = event.target;
    let prevUserData = userData;
    prevUserData[name] = value;
    setUserData(prevState => ({ ...prevState, [name]: value }));
    if(prevUserData.fold && prevUserData.call && prevUserData.raise && prevUserData.allin && prevUserData.difficulty) {
        setDisabled(false);
    }else{
        setDisabled(true);
    }
  }

  function handleChangeDifficulty(event, data) {
    const { name, value } = data;
    let prevUserData = userData;
    prevUserData[name] = value;
    setUserData(prevState => ({ ...prevState, [name]: value }));
    if(prevUserData.fold && prevUserData.call && prevUserData.raise && prevUserData.allin && prevUserData.difficulty) {
        setDisabled(false);
    }else{
        setDisabled(true);
    }
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault()
      setLoading(true)
      setError("")
      setSuccess(false);
      const url = `${baseUrl}/api/settings`
      const { _id, call, raise, allin, fold, difficulty, email } = userData
      const payload = { _id, call, raise, allin, fold, difficulty, email }
      await axios.put(url, payload)
      setSuccess(true)
    } catch (error) {
      catchErrors(error, setError)
    } finally {
      setLoading(false);
    }
  }

  function resetDefaults(){
    setUserData(prevState => ({ ...prevState, ["fold"]: "#FEFEFA" }));
    setUserData(prevState => ({ ...prevState, ["call"]: "#F6EE5E" }));
    setUserData(prevState => ({ ...prevState, ["raise"]: "#CDA270" }));
    setUserData(prevState => ({ ...prevState, ["allin"]: "#CD5D63" }));
  }


  function handleChangeColors(colors,  type) {
    let prevUserData = userData;
    prevUserData[type] = colors.hex;
    setUserData(prevState => ({ ...prevState, [type]: colors.hex }));
    if(prevUserData.fold && prevUserData.call && prevUserData.raise && prevUserData.allin && prevUserData.difficulty) {
        setDisabled(false);
    }else{
        setDisabled(true);
    }
  }

  return (
    <Grid columns='equal' stackable container className="loginGrid">
          <Grid.Column>
            <h1>Settings</h1>
            <Form
            loading={loading}
            error={Boolean(error)}
            success={success}
            onSubmit={handleSubmit}
            >
              <Segment>
                <Message error header="Oops!" content={error} />
                <Message
                    success
                    icon="check"
                    header="Success!"
                    content="Your settings have been updated"
                />
                {/* <Form.Group inline>
                  <label style={{width: 100}}>Fold Color</label>
                  <input type='text' placeholder="Fold Color" value={userData.fold} onChange={handleChange}/>
                  <InputColor style={{width: 50, height: 40, marginLeft: 10 }}
                    initialHexColor={userData.fold}
                    onChange={colors => handleChangeColors(colors, 'fold')}
                    placement="right"
                  />
                </Form.Group>
                <Form.Group inline>
                  <label style={{width: 100}}>Call Color</label>
                  <input type='text' placeholder="Call Color" value={userData.call} onChange={handleChange}/>
                  <InputColor style={{width: 50, height: 40, marginLeft: 10 }}
                    initialHexColor={userData.call}
                    onChange={colors => handleChangeColors(colors, 'call')}
                    placement="right"
                  />
                </Form.Group>
                <Form.Group inline>
                  <label style={{width: 100}}>Raise Color</label>
                  <input type='text' placeholder="Raise Color" value={userData.raise} onChange={handleChange}/>
                  <InputColor style={{width: 50, height: 40, marginLeft: 10 }}
                    initialHexColor={userData.raise}
                    onChange={colors => handleChangeColors(colors, 'raise')}
                    placement="right"
                  />
                </Form.Group>
                <Form.Group inline>
                  <label style={{width: 100}}>All-in Color</label>
                  <input type='text' placeholder="All-in Color" value={userData.allin} onChange={handleChange}/>
                  <InputColor style={{width: 50, height: 40, marginLeft: 10 }}
                    initialHexColor={userData.allin}
                    onChange={colors => handleChangeColors(colors, 'allin')}
                    placement="right"
                  />
                </Form.Group>
                <Form.Field fluid
                  control={Select}
                  name="difficulty"
                  label="Difficulty"
                  placeholder="Difficulty"
                  type="text"
                  options= {difficultyOptions}
                  value={userData.difficulty}
                  onChange={handleChangeDifficulty}
                /> */}
                <Form.Field
                  control={Button}
                  disabled={disabled || loading}
                  color="blue"
                  icon="pencil alternate"
                  content="Submit"
                  type="submit"
                />
                <Button
                  color="blue"
                  onClick={() => resetDefaults()}
                  floating="right"
                >
                Reset to defaults
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
      </Grid>  
)};

export default Settings;
