import './validation';

/* eslint-disable no-unused-vars */
let component;

const getUserData = () => ({
  email: component.emailAddress.value,
  password: component.password.value,
  plan: document.querySelector('[name="plan"]:checked').value,
  profile: {
    name: {
      first: component.firstName.value,
      last: component.lastName.value,
    },
  },
});

const signup = () => {
  //console.log(window.card.card)
  window.stripe.createToken(window.card.card)
  .then(({ error, token }) => {
    if (error) {
      Bert.alert(error);
    } else {
      const user = getUserData();
      const password = user.password;
      user.password = Accounts._hashPassword(user.password);
    }
  });
};

const validate = () => {
  $(component.signupForm).validate({
      //stuff here
    submitHandler() { signup(); },
  });
};

export default function handleSignup(options) {
  component = options.component;
  //validate();
}