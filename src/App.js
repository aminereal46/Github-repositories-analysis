import React, { Component } from 'react';
import ProjectCard from './Components/projectCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {title :'',
                  projects:[] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    console.log('debug2 ',event.target.value);
  this.setState({title:event.target.value});
  }
  handleSubmit(event) {
    event.preventDefault();
    console.log('debug');
    fetch("https://api.github.com/search/repositories?q="+this.state.title)
     .then(response => response.json())
     .then(json => {
       console.log('done');
       console.log(json.items[0]);
       this.setState({
         projects: json.items,
         search:true,
         count:json.total_count
       });
     });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <strong>GitHUB project </strong>
            <input type="text" value={this.state.title} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Search" />
        </form><br/>
        <ProjectCard projects= {this.state.projects} title ={this.state.title} search={this.state.search} count={this.state.count}/>
      </div>

    );
  }
}

export default App;
