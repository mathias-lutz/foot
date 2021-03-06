import React, { Component } from 'react';
import './GoalAnimation.css';

class GoalAnimation extends Component {

  render() {
    return(
      <div className='goalanimation ui container'>

          <div className='ui container computer or lower hidden'>
              <img className="ui fluid image" src={require("./images/best_goal_legend-desktop.png")} style={{margin: "0px 0px 0px 0px"}} alt=""/>
              <img className="ui fluid" src={require("./images/best_goal_desktop.gif")} alt="" />
          </div>

          <div className='ui container widescreen hidden large screen hidden'>
              <img className="ui fluid image" src={require("./images/best_goal_legend-mobile.png")} style={{margin: "0px 0px 0px 0px"}} alt=""/>
              <img className="ui fluid" src={require("./images/best_goal_mobile.gif")} alt="" />
          </div>
      </div>
    )
  }
}

export default GoalAnimation;

