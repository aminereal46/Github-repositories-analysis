import React, { Component } from 'react';
import Project from './projectAnalytics';
import '../App.css';

class ProjectCard extends Component {
  constructor(props) {
    super(props);
    console.log('props',props);
    this.state = {noRepsFound:'',
                  repsNbr:0 ,
                  pageNbr : 1,
                  more:'',
                  user:'',
                  repo:''
                  };
    this.getMore = this.getMore.bind(this);

  }
  getMore(){
    console.log('url'+"https://api.github.com/search/repositories?q="+this.state.title+'&page='+this.state.pageNbr);
    fetch("https://api.github.com/search/repositories?q="+this.state.title+'&page='+this.state.pageNbr)
     .then(response => response.json())
     .then(json => {
       console.log('ocunt',json.total_count);
       this.setState({
           count:json.total_count,
           noRepsFound : '',
           pageNbr : this.state.pageNbr + 1,
           repsNbr : this.state.repsNbr + json.items.length,
           projects : this.state.projects.concat(json.items.map(project => {return (
         <div key={project.id}>
           <a href="#" onClick={this.handleClick.bind(this,project)}>{project.full_name}</a><br/>
           {project.description}<br/>
           {project.owner.login}<br/><br/>
         </div>);
         }))
       });
       if(this.state.repsNbr < this.state.count){
         console.log('more');
         this.setState({more : <button onClick={this.getMore}>More ...</button>})
       }else {
         this.setState({more : <div>No more results</div>});
       }
     });
  }
  componentWillReceiveProps(newProps){
    this.setState({
      user:'',
      repo:''
    });
    console.log('search:',newProps.search);
    if(newProps.search && newProps.projects.length === 0){
      this.setState({noRepsFound : 'There is no repository matching '+newProps.title,
                    projects:[]});
    }else{
      console.log('nbr',this.state.pageNbr);
      this.setState({noRepsFound : '',
        projects : newProps.projects.map(project => {return (
      <div key={project.id}>
        <a href="#" onClick={this.handleClick.bind(this,project)}>{project.full_name}</a><br/>
        {project.description}<br/>
        {project.owner.login}<br/><br/>
      </div>);
      })
    });
    if(this.state.repsNbr < newProps.count){
      console.log('more',this.state.pageNbr,' ',newProps.count);
      this.setState({more : <button onClick={this.getMore}>More ...</button>,
        pageNbr : this.state.pageNbr + 1,
        title:newProps.title,
        repsNbr : this.state.repsNbr + newProps.projects.length});
    }else if(newProps.search) {
      console.log('no more');
      this.setState({more : <div>No more results</div>});
    }
    }
  }

  handleClick(project){
    console.log('clicked');
    this.setState({noRepsFound:'',
                    projects:'',
                  more:'',
                  user:project.owner.login,
                  repo:project.name
                });

  }
  render() {
    return (
      <div>
      <Project user={this.state.user} repo={this.state.repo}/>
        {this.state.noRepsFound}
        {this.state.projects}
        {this.state.more}
      </div>
    );
  }
}

export default ProjectCard;
