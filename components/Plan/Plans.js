import React from 'react';
import centsToDollars from '../../utils/cents-to-dollars';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updatePlan } from '../../redux/store';
import Router from 'next/router'

class PlansList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { plan: props.currentPlan || props.planState || "basic" };
  }

  handlePlanChange(planId){
    this.setState({ plan: planId });
    this.props.updatePlan(planId)
  }

  renderPlan(planId){
    if (typeof window !== "undefined"){
      return  Router.pathname !== '/signup' && planId === "basic" ? false : true
    }
  }

  render() {
    const { plans, currentPlan } = this.props;
    return (
      <div className="Plans">
        {plans.map(({ planId, label, price }) => {
          const isCurrentPlan = currentPlan === planId;
          console.log()
          if (this.renderPlan(planId)){
            return (
              <label key={ planId } className={`Plan ${isCurrentPlan ? 'current' : ''}`}>
              <input
                type="radio"
                name="plan"
                id={ planId }
                value={ planId }
                checked={ planId === this.state.plan }
                disabled={ isCurrentPlan }
                onChange={() => { this.handlePlanChange(planId) }}
                />
              { centsToDollars(price) } - { label }
            </label>
          );
        }
        })}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePlan: bindActionCreators(updatePlan, dispatch),
  }
}

const mapStateToProps = state => {
  return {
    planState: state.plan,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlansList)