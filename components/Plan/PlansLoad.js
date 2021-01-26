import React from 'react';

class PlansLoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = { plan: props.currentPlan || 'small' };
  }

  render() {
    const { plans, currentPlan } = this.props;
    return (
      <div></div>
    );
  }
}

PlansLoad.getInitialProps = async ctx => {
  const { token } = parseCookies(ctx);
  if (!token) {
    return { plans: [] };
  }
  const payload = { headers: { Authorization: token } };
  const url = `${baseUrl}/api/plan`;
  const response = await axios.get(url, payload);
  return response.data;
};

export default PlansLoad