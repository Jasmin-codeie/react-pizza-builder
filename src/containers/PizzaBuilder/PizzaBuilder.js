import React, { Component } from 'react';
import PizzaPreview from '../../components/Pizza/PizzaPreview/PizzaPreview';
import PizzaControls from '../../components/Pizza/PizzaControls/PizzaControls';

import classes from './PizzaBuilder.module.css';
import Modal from '../../components/UI/Modal/Modal';
import PizzaOrder from '../../components/Pizza/PizzaOrder/PizzaOrder';

import axios from '../../axios';
import Spinner from '../../components/UI/Spinner/Spinner';

class PizzaBuilder extends Component {
  state = {
    information: null,
    ingredients: {
      tomato: 0,
      salami: 0,
      blackOlive: 0,
      greenOlive: 0,
      redPepper: 0,
      yellowPepper: 0,
    },
    price: 200,
    ordering: false,
    loading: false,
  }

  orderingToggleHandler = () => {
    this.setState({
      ordering: !this.state.ordering
    });
  }
  
  checkoutHandler = () => {
    this.setState({ loading: true });
    
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.price,
      customer: {
        name: "Elaman",
        phone: "0 700 111 222",
        address: "Somewhere in Karakol"
      },
    };

    axios.post('orders.json', order)
      .then(response => {
        this.setState({ loading: false, ordering: false });
      })
      .catch(error => {
        this.setState({ loading: false, ordering: false });
      });
  }

  lessHandler = (ingredient) => {
    const ingredients = {...this.state.ingredients};
    let price = this.state.price;
    
    if (ingredients[ingredient]) {
      ingredients[ingredient]--;
      price -= this.state.information[ingredient].price;
    }

    this.setState({ ingredients, price });
  }

  moreHandler = (ingredient) => {
    const ingredients = {...this.state.ingredients};
    let price = this.state.price;

    ingredients[ingredient]++;
    price += this.state.information[ingredient].price;

    this.setState({ ingredients, price });
  }

  componentDidMount() {
    axios.get('information.json')
      .then(response => {
        this.setState({
          information: response.data
        });
      })
      .catch(error => {});
  }

  render() {
    let modalContent = <Spinner />;
    if (this.state.ordering && !this.state.loading) {
      modalContent = (
        <PizzaOrder
          information={this.state.information}
          ingredients={this.state.ingredients}
          price={this.state.price}
          checkoutHandler={this.checkoutHandler}
          cancelHandler={this.orderingToggleHandler} />
      );
    }

    let content = <Spinner />;
    if (this.state.information) {
      content = (
        <div className={classes.PizzaBuilder}>
          <PizzaPreview
            price={this.state.price}
            ingredients={this.state.ingredients} />
          <PizzaControls
            ingredients={this.state.ingredients}
            moreHandler={this.moreHandler}
            lessHandler={this.lessHandler}
            orderingToggleHandler={this.orderingToggleHandler} />

          <Modal
            open={this.state.ordering}
            toggleHandler={this.orderingToggleHandler}>
            {modalContent}
          </Modal>
        </div>
      );
    }

    return content;
  }
}

export default PizzaBuilder;