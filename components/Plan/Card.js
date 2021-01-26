/* eslint-disable new-cap */

import React from 'react'
import Stripe from '../../utils/stripe'
import $ from 'jquery'

class Card extends React.Component {
  componentDidMount() {
    Stripe((stripe) => {  
      window.elements = stripe.elements();
      window.card = window.elements.create('card');
      window.card.mount('#card-element');

      window.card.addEventListener('change', ({ error }) => {
        const displayError = document.querySelector('.card-errors');
        $('.ccButton').removeClass('disabled');
        if (error) {
          $('.ccButton').addClass('disabled');
          displayError.textContent = error.message;
          displayError.style.display = 'block';
        } else {
          $('.ccButton').removeClass('disabled');
          displayError.style.display = 'none';
        }
      });
    });
  }

  render() {
    return (<div className="Card">
      <div id="card-element" />
      <label className="card-errors" />
    </div>);
  }
}

Card.propTypes = {};
export default Card;
